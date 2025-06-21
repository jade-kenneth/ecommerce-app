import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { constraintDirectiveTypeDefs } from 'graphql-constraint-directive';
import path from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();

definitionsFactory.generate({
  typePaths: [path.resolve(__dirname, '../src/app/schemas/*.gql')],
  path: path.resolve(__dirname, '../src/app/__generated/graphql-types.ts'),
  outputAs: 'interface',
  defaultScalarType: 'unknown',
  customScalarTypeMapping: {
    DateTime: 'Date',
    ObjectId: 'Types.ObjectId',
    EmailAddress: 'string',
    JSON: 'Record<string, any>',
    URL: 'string',
    Decimal: '_Decimal',
  },
  additionalHeader:
    "import { Types } from 'mongoose'\nimport { Decimal as _Decimal } from 'decimal.js'",
  typeDefs: [constraintDirectiveTypeDefs],
});
