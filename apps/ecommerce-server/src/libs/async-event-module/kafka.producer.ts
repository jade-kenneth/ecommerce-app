import { Inject, Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { AsyncEventTokens } from './tokens';
import { AsyncEvent, AsyncEventModuleOptions } from './types';

@Injectable()
export class KafkaEventProducer {
  private producer: Producer;

  constructor(
    @Inject(AsyncEventTokens.Kafka) private readonly kafka: Kafka,
    @Inject(AsyncEventTokens.Options)
    private readonly options: AsyncEventModuleOptions,
  ) {}

  async onModuleInit() {
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async emit(event: AsyncEvent) {
    await this.producer.send({
      topic: `async-event-${this.options.context}`,
      messages: [
        {
          key: event.id,
          value: JSON.stringify(event),
          headers: { type: Buffer.from(event.type) },
        },
      ],
    });
  }
}
