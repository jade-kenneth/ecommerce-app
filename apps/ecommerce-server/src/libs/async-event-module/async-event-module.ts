import { DynamicModule, Module } from '@nestjs/common';
import {
  DiscoveryModule,
  DiscoveryService,
  MetadataScanner,
  Reflector,
} from '@nestjs/core';
import Redis from 'ioredis';
import { Kafka } from 'kafkajs';
import { KafkaEventConsumer } from './kafka.consumer';
import { KafkaEventProducer } from './kafka.producer';
import { AsyncEventTokens } from './tokens';
import { AsyncEventModuleOptions } from './types';

@Module({
  imports: [DiscoveryModule],
})
export class AsyncEventModule {
  static forRootAsync(options: {
    useFactory: (
      ...args: unknown[]
    ) => AsyncEventModuleOptions | Promise<AsyncEventModuleOptions>;
    inject?: unknown[];
  }): DynamicModule {
    return {
      module: AsyncEventModule,
      global: true,
      providers: [
        {
          provide: AsyncEventTokens.Options,
          useFactory: options.useFactory,
          inject: <never>options.inject || [],
        },

        {
          provide: AsyncEventTokens.Kafka,
          useFactory: (opts: AsyncEventModuleOptions) =>
            new Kafka({
              brokers: opts.kafka.brokers,
              clientId: opts.kafka.clientId ?? opts.context,
              sasl: {
                mechanism: 'plain',
                username: process.env.KAFKA_USERNAME,
                password: process.env.KAFKA_PASSWORD,
              },
              ssl: false,
            }),
          inject: [AsyncEventTokens.Options],
        },

        {
          provide: AsyncEventTokens.KafkaConsumer,
          useFactory: async (kafka: Kafka, opts: AsyncEventModuleOptions) => {
            const consumer = kafka.consumer({
              groupId: `async-event-${opts.context}`,
            });
            await consumer.connect();

            await consumer.subscribe({
              topic: `async-event-${opts.context}`,
            });

            return consumer;
          },
          inject: [AsyncEventTokens.Kafka, AsyncEventTokens.Options],
        },

        {
          provide: AsyncEventTokens.Redis,
          useFactory: (opts: AsyncEventModuleOptions) => {
            if (!opts.redis) return null;

            return new Redis({
              host: opts.redis.host,
              port: opts.redis.port,
              password: process.env.REDISPASSWORD,
              tls: {}, // required on Railway
            });
          },

          inject: [AsyncEventTokens.Options],
        },

        {
          provide: AsyncEventTokens.Handlers,
          useFactory: () => new Map<string, any>(),
        },

        DiscoveryService,
        MetadataScanner,
        Reflector,
        KafkaEventProducer,
        KafkaEventConsumer,
      ],

      exports: [KafkaEventProducer],
    };
  }
}
