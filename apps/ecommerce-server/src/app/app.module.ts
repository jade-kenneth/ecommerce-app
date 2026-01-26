import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { constraintDirectiveTypeDefs } from 'graphql-constraint-directive/apollo4';
import {
  DateTimeResolver,
  JSONResolver,
  ObjectIDResolver,
} from 'graphql-scalars';

import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import path from 'path';
import { AsyncEventModule } from '~/async-event-module/async-event-module';
import { AppService } from './app.service';
import { AuthMiddleware } from './auth/auth-middleware';
import { CartsModule } from './carts/carts.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { MailModule } from './mail/mail.module';
import { PaymentsModule } from './payments/payment.module';
import { ProductsModule } from './products/products.module';
import { NodeResolver } from './resolver/node.resolver';
import { UploadModule } from './upload/upload/upload.module';
import { AccountModule } from './user-session/account/account.module';
import { JwtModule } from './user-session/jwt/jwt.module';
import { LicenseController } from './user-session/license/license.controller';
import { LicenseModule } from './user-session/license/license.module';
import { SessionController } from './user-session/session/session.controller';
import { SessionModule } from './user-session/session/session.module';
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
    NodeResolver,
    UploadModule,
    ConfigModule,
    SessionModule,
    CartsModule,
    PaymentsModule,
    LicenseModule,
    MailModule,
    AsyncEventModule.forRootAsync({
      useFactory: () => {
        console.log('KAFKA_BROKER:', process.env.KAFKA_BROKER);
        console.log('KAFKA_PASSWORD exists:', !!process.env.KAFKA_PASSWORD);

        console.log('REDISHOST:', process.env.REDISHOST);
        console.log('REDISPORT:', process.env.REDISPORT);
        console.log('REDISPASSWORD exists:', !!process.env.REDISPASSWORD);
        return {
          context: 'account',
          kafka: {
            brokers: [process.env.KAFKA_BROKER],
            ssl: true,
            sasl: {
              mechanism: 'plain', // "plain"
              username: 'token',
              password: process.env.KAFKA_PASSWORD,
            },
          },
          redis: {
            host: process.env.REDISHOST,
            port: Number(process.env.REDISPORT),
            password: process.env.REDISPASSWORD,
          },
          concurrency: 5,
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
