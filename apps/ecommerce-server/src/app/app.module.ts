import { Module } from '@nestjs/common';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { constraintDirectiveTypeDefs } from 'graphql-constraint-directive/apollo4';
import {
  DateResolver,
  DateTimeResolver,
  EmailAddressResolver,
  GraphQLDeweyDecimalResolver,
  JSONResolver,
  ObjectIDResolver,
  URLResolver,
} from 'graphql-scalars';
import path from 'path';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_MONGODB_URI),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async () => {
        const options: ApolloDriverConfig = {
          playground: true,
          introspection: true,
          typePaths: [path.resolve(__dirname, './src/app/schemas/*.gql')],
          resolvers: {
            JSON: JSONResolver,
            Date: DateResolver,
            DateTime: DateTimeResolver,
            ObjectId: ObjectIDResolver,
            Decimal: GraphQLDeweyDecimalResolver,
            EmailAddress: EmailAddressResolver,
            URL: URLResolver,
          },
          typeDefs: [constraintDirectiveTypeDefs],
        };

        return options;
      },
    }),
    ProductsModule,
  ],

  providers: [AppService],
})
export class AppModule {}
