import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { isNil } from 'es-toolkit/compat';
import { Types } from 'mongoose';
import { Tokens } from '../../../types/tokens';
import {
  OrderStatus,
  PaymentMethodType,
} from '../../__generated/graphql-types';
import { PaymentsService } from '../../payments/payments.service';
import { Order, OrdersRepository } from './repositories/orders.repository';

@Injectable()
export class OrderService {
  constructor(
    @Inject(Tokens.OrdersToken)
    private readonly orders: OrdersRepository,
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

    if (!hasStatusUpdate && !hasRatingUpdate && !hasMessageUpdate) {
      throw new Error('No order update fields were provided');
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

    let rating: number | undefined;
    if (hasRatingUpdate) {
      const value = Number(params.rating);
      if (!Number.isFinite(value) || value < 0 || value > 5) {
        throw new Error('Rating must be between 0 and 5');
      }
      rating = value;
    }

    const message = hasMessageUpdate ? params.message.trim() : undefined;

    const updatePayload: Partial<Order> = {
      updatedAt,
    };

    if (hasStatusUpdate) {
      updatePayload.status = nextStatus;
    }
    if (!isNil(rating)) {
      updatePayload.rating = rating;
    }
    if (!isNil(message)) {
      updatePayload.message = message;
    }

    await this.orders.update(params.orderId, {
      ...updatePayload,
    });

    const updatedOrder = {
      ...order,
      ...updatePayload,
    };

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
}
