import { SetMetadata } from '@nestjs/common';

export const ASYNC_EVENT_HANDLER = 'ASYNC_EVENT_HANDLER';

export const AsyncEventHandler = (
  event: string,
  options?: { dedupeTtl?: number },
): MethodDecorator => SetMetadata(ASYNC_EVENT_HANDLER, { event, options });

//@AsyncEventHandler('order.created')
//async sendOrderEmail(event) {}
