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
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { ProductsModule } from './products/products.module';
import { NodeResolver } from './resolver/node.resolver';
import { UploadModule } from './upload/upload/upload.module';
import { AccountModule } from './user-session/account/account.module';
import { JwtModule } from './user-session/jwt/jwt.module';
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
  ],

  providers: [AppService],
  controllers: [SessionController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(graphqlUploadExpress())
      .forRoutes({ path: 'graphql', method: RequestMethod.ALL }); //apply auth and permission middleware later
  }
}
