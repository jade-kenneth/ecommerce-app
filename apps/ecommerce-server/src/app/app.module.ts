import { Module } from '@nestjs/common';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { constraintDirectiveTypeDefs } from 'graphql-constraint-directive/apollo4';
import {
  DateTimeResolver,
  JSONResolver,
  ObjectIDResolver,
} from 'graphql-scalars';
import path from 'path';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { NodeResolver } from './resolver/node.resolver';

@Module({
  imports: [
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
          introspection: true,
          typePaths: [path.resolve(__dirname, './src/app/schemas/*.gql')],
          resolvers: {
            JSON: JSONResolver,
            DateTime: DateTimeResolver,
            ObjectId: ObjectIDResolver,
          },
          typeDefs: [constraintDirectiveTypeDefs],
        };

        return options;
      },
    }),
    ProductsModule,
    NodeResolver,
  ],

  providers: [AppService],
})
export class AppModule {}
