import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { constraintDirectiveTypeDefs } from 'graphql-constraint-directive';
import path from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();

definitionsFactory.generate({
  typePaths: [path.resolve(__dirname, '.src/app/**/*.gql')],
  path: path.resolve(__dirname, '../src/app/__generated/graphql-types.ts'),
  outputAs: 'interface',
  defaultScalarType: 'unknown',
  customScalarTypeMapping: {
    DateTime: 'Date',
    EmailAddress: 'string',
    JSON: 'Record<string, any>',
    URL: 'string',
  },
  //   additionalHeader: "import { ObjectId as _ObjectId } from '@mazal/object-id'",
  typeDefs: [constraintDirectiveTypeDefs],
});
