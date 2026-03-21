/**
 * build 5x
 */
import path from 'path';

import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import type { GraphQLSchema } from 'graphql';
import { constraintDirectiveTypeDefs } from 'graphql-constraint-directive/apollo4';
import {
  DateTimeResolver,
  JSONResolver,
  ObjectIDResolver,
} from 'graphql-scalars';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { authorizationRequiredDirectiveSchemaTransformer } from 'src/util/authorization-required-directive';

import { safeParseFloat } from '../util/safe-parse-float';

import { AppService } from './app.service';
import { AuthMiddleware } from './auth/auth-middleware';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { AccountModule } from './identity/account/account.module';
import { JwtModule } from './identity/jwt/jwt.module';
import { LicenseController } from './identity/license/license.controller';
import { LicenseModule } from './identity/license/license.module';
import { SessionController } from './identity/session/session.controller';
import { SessionModule } from './identity/session/session.module';
import { MailModule } from './mail/mail.module';
import { PaymentsModule } from './payments/payment.module';
import { ProductReviewsModule } from './product-reviews/product-reviews.module';
import { ProductsModule } from './products/products.module';
import { RatingsModule } from './ratings/ratings.module';
import { NodeResolver } from './resolver/node.resolver';
import { ShoppingModule } from './shopping/shopping.module';
import { SupportModule } from './support/support.module';
import { UploadModule } from './upload/upload/upload.module';

import { AsyncEventModule } from '~/async-event-module/async-event-module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.DATABASE_MONGODB_URI,
        socketTimeoutMS: 60000,
        heartbeatFrequencyMS: 2000,
        serverSelectionTimeoutMS: 30000,
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,

      useFactory: async () => {
        const options: ApolloDriverConfig = {
          playground: true,
          csrfPrevention: false,
          introspection: true,
          typePaths: [path.resolve(__dirname, './src/app/schemas/*.gql')],
          resolvers: {
            JSON: JSONResolver,
            DateTime: DateTimeResolver,
            ObjectId: ObjectIDResolver,
            Upload: GraphQLUpload,
          },
          typeDefs: [constraintDirectiveTypeDefs],

          // destructure context to get req object from middleware
          context: ({ req }) => ({ claims: req.claims }),

          // apply authorizationRequired directive
          transformSchema: async (schema: GraphQLSchema) => {
            let combinedSchemas = schema;
            const schemaTransformers = [
              {
                name: 'authorizationRequired',
                fn: authorizationRequiredDirectiveSchemaTransformer,
              },
            ];
            schemaTransformers.forEach((s) => {
              combinedSchemas = s.fn(combinedSchemas, s.name);
            });

            return combinedSchemas;
          },
        };

        return options;
      },
    }),
    JwtModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.getString('JWT_SECRET_KEY'),
        oldSecret: config.getString('OLD_JWT_SECRET_KEY', {
          optional: true,
        }),
      }),
      inject: [ConfigService],
    }),
    AccountModule,
    ProductsModule,
    ProductReviewsModule,
    NodeResolver,
    UploadModule,
    ConfigModule,
    SessionModule,
    ShoppingModule,
    PaymentsModule,
    LicenseModule,
    MailModule,
    RatingsModule,
    SupportModule,
    AsyncEventModule.forRootAsync({
      useFactory: () => {
        return {
          context: 'ecommerce',
          kafka: {
            brokers: [process.env.KAFKA_URL],
          },
          redis: {
            host: process.env.REDISHOST,
            port: safeParseFloat(process.env.REDISPORT, 0),
            password: process.env.REDISPASSWORD,
          },
          concurrency: 8,
        };
      },
    }),
  ],

  providers: [AppService],
  controllers: [SessionController, LicenseController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(graphqlUploadExpress(), AuthMiddleware)

      .forRoutes({ path: '*', method: RequestMethod.ALL }); //apply auth and permission middleware later
  }
}
