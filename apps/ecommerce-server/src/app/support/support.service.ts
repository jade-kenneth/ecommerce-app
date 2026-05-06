import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import OpenAI from 'openai';
import { AccountType } from '../../types/common';
import { ConfigService } from '../config/config.service';
import { Claims } from '../identity/types';
import { ProductsService } from '../products/products.service';
import { OrderService } from '../shopping/order/order.service';
import { Order } from '../shopping/order/repositories/orders.repository';

type SupportResponseOptions = {
  model?: string;
  instructions?: string;
  claims?: Claims;
};

type SearchProductsArgs = {
  name: string;
  first?: number;
};

type GetMyOrdersArgs = {
  first?: number;
};

type SearchProductToolItem = {
  id: string;
  name: string;
  price: string | null;
  pieces: number | null;
  points: string | null;
};

type MyOrderToolItem = {
  id: string;
  status: string;
  total: string | null;
  itemCount: number;
  createdAt: string | null;
};

const SEARCH_PRODUCTS_TOOL_NAME = 'searchProducts';
const GET_MY_ORDERS_TOOL_NAME = 'getMyOrders';
const DEFAULT_PRODUCT_LIMIT = 5;
const MAX_PRODUCT_LIMIT = 10;
const DEFAULT_ORDER_LIMIT = 5;
const MAX_ORDER_LIMIT = 10;
const MAX_TOOL_CALL_ROUNDS = 3;
const PHP_CURRENCY_FORMATTER = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

@Injectable()
export class SupportService {
  private readonly defaultModel: string;
  private readonly openai: OpenAI | null;
  private readonly searchProductsTool = {
    type: 'function',
    name: SEARCH_PRODUCTS_TOOL_NAME,
    description:
      'Search products by product name and return short product matches.',
    strict: true,
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: {
          type: 'string',
          description: 'Product name or keyword to search.',
        },
        first: {
          type: 'integer',
          minimum: 1,
          maximum: MAX_PRODUCT_LIMIT,
          description: `Maximum number of products to return (1-${MAX_PRODUCT_LIMIT}).`,
        },
      },
      required: ['name', 'first'],
    },
  } satisfies OpenAI.Responses.FunctionTool;
  private readonly getMyOrdersTool = {
    type: 'function',
    name: GET_MY_ORDERS_TOOL_NAME,
    description:
      'Get the authenticated member order history and latest order statuses.',
    strict: true,
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        first: {
          type: 'integer',
          minimum: 1,
          maximum: MAX_ORDER_LIMIT,
          description: `Maximum number of recent orders to return (1-${MAX_ORDER_LIMIT}).`,
        },
      },
      required: ['first'],
    },
  } satisfies OpenAI.Responses.FunctionTool;

  constructor(
    private readonly configService: ConfigService,
    private readonly product: ProductsService,
    private readonly order: OrderService,
  ) {
    const apiKey =
      this.configService.getString('OPENAI_API_KEY', {
        optional: true,
      }) ??
      this.configService.getString('OPEN_API_KEY', {
        optional: true,
      });

    this.defaultModel =
      this.configService.getString('OPENAI_MODEL', {
        optional: true,
      }) ?? 'gpt-4.1-mini';

    this.openai = apiKey ? new OpenAI({ apiKey }) : null;
  }

  async createSupportResponse(
    userPrompt: string,
    options?: SupportResponseOptions,
  ) {
    const openai = this.getOpenAIClient();
    const model = options?.model ?? this.defaultModel;
    const instructions = this.buildInstructions(options?.instructions);

    let response = await openai.responses.create({
      model,
      input: userPrompt,
      instructions,
      tools: this.getToolDefinitions(),
    });

    response = await this.runFunctionTools(response, model, options?.claims);

    return response;
  }

  async createSupportAnswer(
    userPrompt: string,
    options?: SupportResponseOptions,
  ) {
    const response = await this.createSupportResponse(userPrompt, options);
    return response.output_text;
  }

  private getOpenAIClient() {
    if (!this.openai) {
      throw new Error('Missing OPENAI_API_KEY or OPEN_API_KEY');
    }

    return this.openai;
  }

  private buildInstructions(instructions?: string) {
    const base = `
You are an ecommerce support assistant. You only help with topics related to products and orders in this store.

If the user asks about anything unrelated to products, orders, or shopping on this platform, politely decline and redirect them:
"I can only help with questions about our products and orders. Is there something I can assist you with regarding our store?"

When the user asks to find products, calls out product names, or asks for product suggestions:
1) Always call the searchProducts tool first before answering.
2) Present results with product name and price in Philippine Peso (PHP), for example ₱1,234.56.
3) If one product is shown, end with: "Would you like to order this item?"
4) If multiple products are shown, end with: "Would you like to order any of these?"
5) If no products are found, say so briefly and ask for another keyword or product type.

When the user asks about "my orders", order history, or order status:
1) Always call the getMyOrders tool first before answering.
2) Summarize results by newest orders first with status, total amount (PHP), and date.
3) If there are no orders, say that no orders were found yet.
4) If tool output returns AUTH_REQUIRED, ask the user to sign in before checking orders.
5) After showing orders, ask if the user wants details for a specific order.

Keep responses concise, helpful, and action-oriented toward placing an order.
`.trim();

    if (!instructions?.trim()) {
      return base;
    }

    return `${instructions.trim()}\n\n${base}`;
  }

  private async runFunctionTools(
    initialResponse: OpenAI.Responses.Response,
    model: string,
    claims?: Claims,
  ) {
    const openai = this.getOpenAIClient();
    let response = initialResponse;

    for (let round = 0; round < MAX_TOOL_CALL_ROUNDS; round += 1) {
      const functionCalls = this.getFunctionCalls(response);
      if (functionCalls.length === 0) {
        return response;
      }

      const toolOutputs = await Promise.all(
        functionCalls.map((call) => this.executeFunctionCall(call, claims)),
      );

      response = await openai.responses.create({
        model,
        previous_response_id: response.id,
        input: toolOutputs,
        tools: this.getToolDefinitions(),
      });
    }

    return response;
  }

  private getFunctionCalls(response: OpenAI.Responses.Response) {
    return response.output.filter(
      (item): item is OpenAI.Responses.ResponseFunctionToolCall =>
        item.type === 'function_call',
    );
  }

  private async executeFunctionCall(
    call: OpenAI.Responses.ResponseFunctionToolCall,
    claims?: Claims,
  ): Promise<OpenAI.Responses.ResponseInputItem.FunctionCallOutput> {
    if (call.name === SEARCH_PRODUCTS_TOOL_NAME) {
      return this.executeSearchProductsFunctionCall(call);
    }

    if (call.name === GET_MY_ORDERS_TOOL_NAME) {
      return this.executeGetMyOrdersFunctionCall(call, claims);
    }

    return this.buildFunctionToolOutput(call.call_id, {
      error: `Unsupported tool: ${call.name}`,
    });
  }

  private async executeSearchProductsFunctionCall(
    call: OpenAI.Responses.ResponseFunctionToolCall,
  ): Promise<OpenAI.Responses.ResponseInputItem.FunctionCallOutput> {
    const args = this.parseSearchProductsArgs(call.arguments);
    if (!args) {
      return this.buildFunctionToolOutput(call.call_id, {
        error:
          'Invalid arguments. Expected {"name": string, "first"?: number}.',
      });
    }

    const first = args.first ?? DEFAULT_PRODUCT_LIMIT;
    const products = await this.searchProducts(args.name, first);
    const items = products.map((entry) => this.toSearchProductToolItem(entry));

    return this.buildFunctionToolOutput(call.call_id, {
      query: args.name,
      count: items.length,
      items,
    });
  }

  private async executeGetMyOrdersFunctionCall(
    call: OpenAI.Responses.ResponseFunctionToolCall,
    claims?: Claims,
  ): Promise<OpenAI.Responses.ResponseInputItem.FunctionCallOutput> {
    const args = this.parseGetMyOrdersArgs(call.arguments);
    if (!args) {
      return this.buildFunctionToolOutput(call.call_id, {
        error: 'Invalid arguments. Expected {"first"?: number}.',
      });
    }

    if (
      !claims?.sub ||
      claims.role !== AccountType.Member ||
      !Types.ObjectId.isValid(claims.sub)
    ) {
      return this.buildFunctionToolOutput(call.call_id, {
        error: 'AUTH_REQUIRED',
        message: 'User must be signed in as member to view orders.',
      });
    }

    const first = args.first ?? DEFAULT_ORDER_LIMIT;
    const orders = await this.getMyOrders(claims.sub, first);
    const items = orders.map((entry) => this.toMyOrderToolItem(entry));

    return this.buildFunctionToolOutput(call.call_id, {
      authRequired: false,
      count: items.length,
      items,
    });
  }

  private parseSearchProductsArgs(
    rawArguments: string,
  ): SearchProductsArgs | null {
    let parsed: unknown;

    try {
      parsed = JSON.parse(rawArguments);
    } catch {
      return null;
    }

    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const candidate = parsed as {
      name?: unknown;
      first?: unknown;
    };

    const name =
      typeof candidate.name === 'string' ? candidate.name.trim() : '';
    if (!name) {
      return null;
    }

    let first: number | undefined;
    if (
      typeof candidate.first === 'number' &&
      Number.isFinite(candidate.first)
    ) {
      const normalized = Math.trunc(candidate.first);
      first = Math.min(MAX_PRODUCT_LIMIT, Math.max(1, normalized));
    }

    return first ? { name, first } : { name };
  }

  private parseGetMyOrdersArgs(rawArguments: string): GetMyOrdersArgs | null {
    let parsed: unknown;

    try {
      parsed = JSON.parse(rawArguments);
    } catch {
      return null;
    }

    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const candidate = parsed as {
      first?: unknown;
    };

    let first: number | undefined;
    if (
      typeof candidate.first === 'number' &&
      Number.isFinite(candidate.first)
    ) {
      const normalized = Math.trunc(candidate.first);
      first = Math.min(MAX_ORDER_LIMIT, Math.max(1, normalized));
    }

    return first ? { first } : {};
  }

  private getToolDefinitions(): OpenAI.Responses.Tool[] {
    return [this.searchProductsTool, this.getMyOrdersTool];
  }

  private buildFunctionToolOutput(
    callId: string,
    payload: unknown,
  ): OpenAI.Responses.ResponseInputItem.FunctionCallOutput {
    return {
      type: 'function_call_output',
      call_id: callId,
      output: JSON.stringify(payload),
    };
  }

  private toSearchProductToolItem(product: {
    _id?: unknown;
    name?: unknown;
    price?: unknown;
    pieces?: unknown;
    points?: unknown;
  }): SearchProductToolItem {
    const id = this.toIdString(product._id);
    const name = typeof product.name === 'string' ? product.name : '';
    const price = this.formatPhilippineCurrency(product.price);
    const pieces = typeof product.pieces === 'number' ? product.pieces : null;
    const points = product.points == null ? null : String(product.points);

    return { id, name, price, pieces, points };
  }

  private toMyOrderToolItem(order: Order): MyOrderToolItem {
    const id = this.toIdString(order._id);
    const status = String(order.status);
    const total = this.formatPhilippineCurrency(order.total);
    const itemCount = Array.isArray(order.items) ? order.items.length : 0;
    const createdAt =
      order.createdAt instanceof Date
        ? order.createdAt.toISOString()
        : order.createdAt
          ? new Date(order.createdAt).toISOString()
          : null;

    return { id, status, total, itemCount, createdAt };
  }

  private formatPhilippineCurrency(value: unknown): string | null {
    const numberValue = this.toNumber(value);
    if (numberValue === null) {
      return null;
    }

    return PHP_CURRENCY_FORMATTER.format(numberValue);
  }

  private toNumber(value: unknown): number | null {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }

      const normalized = trimmed.replace(/[, ]+/g, '');
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : null;
    }

    if (
      value &&
      typeof value === 'object' &&
      'toString' in value &&
      typeof value.toString === 'function'
    ) {
      const parsed = Number(value.toString());
      return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
  }

  private toIdString(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number') {
      return String(value);
    }

    if (
      value &&
      typeof value === 'object' &&
      'toString' in value &&
      typeof value.toString === 'function'
    ) {
      return value.toString();
    }

    return '';
  }

  private async searchProducts(name: string, first = DEFAULT_PRODUCT_LIMIT) {
    return this.product.searchProductByName({
      search: name,
      first,
      filter: {},
    });
  }

  private async getMyOrders(accountId: string, first = DEFAULT_ORDER_LIMIT) {
    const orders = await this.order.myOrders(new Types.ObjectId(accountId));
    return orders
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, first);
  }
}
