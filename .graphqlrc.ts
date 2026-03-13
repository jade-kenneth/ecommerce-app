import assert from 'node:assert';
import path from 'node:path';

import dotenv from 'dotenv';

dotenv.config({
  path: path.join(__dirname, 'apps/ecommerce-app/.env.local'),
  encoding: 'utf8',
});

const NEXT_PUBLIC_PORTAL_API = process.env.NEXT_PUBLIC_PORTAL_API;

assert(
  NEXT_PUBLIC_PORTAL_API,
  'NEXT_PUBLIC_PORTAL_API is required to run GraphQL codegen',
);

const scalars = {
  DateTime: {
    input: 'string | Date',
    output: 'string',
  },
  JSON: 'Record<string, any>',
  ObjectID: 'string',
  Decimal: 'string',
  Cursor: 'string',
  Upload: 'File',
};

function createApolloV4CodegenConfig(
  schema: string | string[],
  documents: string | string[],
  outputPath: string,
) {
  return {
    schema,
    documents,
    extensions: {
      codegen: {
        overwrite: true,
        ignoreNoDocuments: false,
        hooks: {
          afterAllFileWrite: ['prettier --write'],
        },
        generates: {
          [outputPath]: {
            plugins: [
              {
                add: {
                  content: [
                    '/* eslint-disable */',
                    '// @ts-nocheck',
                    '// Generated file',
                  ],
                },
              },
              'typescript',
              'typescript-operations',
              'typed-document-node',
            ],
            config: {
              scalars,
              addDocBlocks: false,
              strictScalars: true,
              dedupeFragments: true,
              pureMagicComment: true,
              disableDescriptions: true,
              nonOptionalTypename: true,
              documentMode: 'documentNode',
            },
          },
        },
      },
    },
  };
}

const projects = {
  'ecommerce-app.admin': createApolloV4CodegenConfig(
    NEXT_PUBLIC_PORTAL_API,
    './apps/ecommerce-app/libs/graphql/src/**/*.{ts,tsx,gql,graphql}',
    './apps/ecommerce-app/libs/graphql/src/generated.tsx',
  ),
};

export default {
  projects,
};
