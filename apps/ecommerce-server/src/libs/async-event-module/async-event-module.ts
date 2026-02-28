import { DynamicModule, Module } from '@nestjs/common';
import {
  DiscoveryModule,
  DiscoveryService,
  MetadataScanner,
  Reflector,
} from '@nestjs/core';
import Redis from 'ioredis';
import { Kafka } from 'kafkajs';
import { AsyncEventDispatcher } from './async-event-dispatcher';
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
              connectionTimeout: 3000,
              requestTimeout: 30000,
              retry: {
                initialRetryTime: 300,
                retries: 10,
              },
              // ssl: {}, // required on redpanda cloud remove when using local dev
              // sasl: {
              //   // required on redpanda cloud remove when using local dev
              //   // remove sasl when using local dev
              //   mechanism: 'scram-sha-256',
              //   username: process.env.KAFKA_USERNAME,
              //   password: process.env.KAFKA_PASSWORD,
              // },
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
              tls: undefined, // required on Railway
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
        AsyncEventDispatcher,
        KafkaEventProducer,
        KafkaEventConsumer,
      ],

      exports: [AsyncEventDispatcher, KafkaEventProducer],
    };
  }
}
