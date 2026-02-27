import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { isNil } from 'es-toolkit/compat';
import { Types } from 'mongoose';
import { Tokens } from '../../../types/tokens';
import {
  OrderItem,
  OrderStatus,
  PaymentMethodType,
} from '../../__generated/graphql-types';
import { PaymentsService } from '../../payments/payments.service';
import { ProductReviewsRepository } from '../../product-reviews/repositories/product-reviews.repository';
import { Order, OrdersRepository } from './repositories/orders.repository';

@Injectable()
export class OrderService {
  constructor(
    @Inject(Tokens.OrdersToken)
    private readonly orders: OrdersRepository,
    @Inject(Tokens.ProductReviewsRepositoryToken)
    private readonly productReviews: ProductReviewsRepository,
    private readonly payments: PaymentsService,
  ) {}

  public async myOrders(accountId: Types.ObjectId): Promise<Order[]> {
    return this.orders.list({ accountId }).collect();
  }

  public async findOrder(
    accountId: Types.ObjectId,
    orderId: Types.ObjectId,
  ): Promise<Order | null> {
    return this.orders.find({ _id: orderId, accountId });
  }

  public async updateOrderStatus(params: {
    orderId: Types.ObjectId;
    productId?: Types.ObjectId | null;
    status?: OrderStatus | null;
    rating?: number | null;
    message?: string | null;
  }): Promise<Order> {
    const order = await this.orders.find(params.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    const hasStatusUpdate = !isNil(params.status);
    const hasRatingUpdate = !isNil(params.rating);
    const hasMessageUpdate = !isNil(params.message);
    const hasItemFeedbackUpdate = hasRatingUpdate || hasMessageUpdate;

    if (!hasStatusUpdate && !hasItemFeedbackUpdate) {
      throw new Error('No order update fields were provided');
    }

    if (hasItemFeedbackUpdate && isNil(params.productId)) {
      throw new Error('productId is required when updating item feedback');
    }

    const nextStatus = hasStatusUpdate ? params.status : order.status;
    const updatedAt = new Date();
    const shouldSendPurchaseEvent =
      hasStatusUpdate &&
      ![OrderStatus.PAID, OrderStatus.COMPLETED].includes(order.status) &&
      [OrderStatus.PAID, OrderStatus.COMPLETED].includes(nextStatus);

    const shouldVerifyPayment =
      hasStatusUpdate &&
      [OrderStatus.PAID, OrderStatus.COMPLETED].includes(nextStatus) &&
      order.paymentMethod?.type === PaymentMethodType.GCASH;

    if (shouldVerifyPayment) {
      await this.assertPaymentVerified(order);
    }

    let nextItems = order.items;
    let reviewProductId: Types.ObjectId | null = null;
    let reviewItem: OrderItem | null = null;
    if (hasItemFeedbackUpdate && params.productId) {
      const productId = params.productId.toString();
      const targetItemIndex = order.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (targetItemIndex < 0) {
        throw new Error('Order item not found');
      }

      const nextItem = {
        ...order.items[targetItemIndex],
      };

      if (hasRatingUpdate) {
        const value = Number(params.rating);
        if (!Number.isFinite(value) || value < 1 || value > 5) {
          throw new Error('Rating must be between 1 and 5');
        }
        nextItem.rating = value;
      }

      if (hasMessageUpdate) {
        nextItem.message = params.message?.trim() ?? '';
      }

      nextItems = order.items.map((item, index) =>
        index === targetItemIndex ? nextItem : item,
      );
      reviewProductId = params.productId;
      reviewItem = nextItem;
    }

    const updatePayload: Partial<Order> = {
      updatedAt,
    };

    if (hasStatusUpdate) {
      updatePayload.status = nextStatus;
    }
    if (hasItemFeedbackUpdate) {
      updatePayload.items = nextItems;
    }

    await this.orders.update(params.orderId, {
      ...updatePayload,
    });

    const updatedOrder = {
      ...order,
      ...updatePayload,
    };

    if (hasItemFeedbackUpdate && reviewProductId && reviewItem) {
      const rating = Number(reviewItem.rating ?? 0);
      if (Number.isFinite(rating) && rating >= 1 && rating <= 5) {
        await this.upsertProductReview({
          orderId: order._id,
          productId: reviewProductId,
          accountId: order.accountId,
          rating,
          message: reviewItem.message?.trim() ?? '',
          updatedAt,
        });
      }
    }

    if (shouldSendPurchaseEvent) {
      await this.sendPurchaseAnalytics(updatedOrder);
    }

    return updatedOrder;
  }

  private async assertPaymentVerified(order: Order) {
    if (!order.paymentRequestId) {
      throw new Error('Payment verification is required');
    }

    const payment = await this.payments.getPaymentRequest(
      order.paymentRequestId,
    );
    const status = (payment?.status ?? '').toUpperCase();
    const successStatuses = new Set([
      'SUCCEEDED',
      'COMPLETED',
      'PAID',
      'SUCCESS',
      'SUCCESSFUL',
      'SETTLED',
    ]);

    if (!successStatuses.has(status)) {
      throw new Error('Payment not verified');
    }
  }

  private async sendPurchaseAnalytics(order: Order) {
    if (!order.gaClientId) {
      return;
    }

    try {
      await axios.post(
        `https://www.google-analytics.com/mp/collect?measurement_id=G-N7BZ4QRB31&api_secret=kd1nvBHlSvu25oIW0E5Emg`,
        {
          client_id: order.gaClientId,
          events: [
            {
              name: 'purchase',
              params: {
                transaction_id: order._id,
                value: order.total,
                currency: 'PHP',
              },
            },
          ],
        },
      );
    } catch (error) {
      console.error('GA purchase event dispatch failed:', error);
    }
  }

  private async upsertProductReview(params: {
    orderId: Types.ObjectId;
    productId: Types.ObjectId;
    accountId: Types.ObjectId;
    rating: number;
    message: string;
    updatedAt: Date;
  }) {
    const existing = await this.productReviews.find({
      orderId: params.orderId,
      productId: params.productId,
      accountId: params.accountId,
    });

    if (existing) {
      await this.productReviews.update(existing._id, {
        rating: params.rating,
        message: params.message,
        updatedAt: params.updatedAt,
      });
      return;
    }

    await this.productReviews.create({
      _id: new Types.ObjectId(),
      orderId: params.orderId,
      productId: params.productId,
      accountId: params.accountId,
      rating: params.rating,
      message: params.message,
      createdAt: params.updatedAt,
      updatedAt: params.updatedAt,
    });
  }
}
