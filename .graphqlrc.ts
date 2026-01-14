import dotenv from 'dotenv';
import assert from 'node:assert';
import path from 'node:path';

dotenv.config({
  debug: true,
  path: path.join(__dirname, '.env.local'),
  encoding: 'utf8',
});

const NEXT_PUBLIC_PORTAL_API = process.env.NEXT_PUBLIC_PORTAL_API;

assert(NEXT_PUBLIC_PORTAL_API);

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

function createAdminConfig(
  schema: string | string[],
  documents: string | string[],
  outputPath: string
) {
  return {
    schema,
    documents,
    extensions: {
      codegen: {
        debug: true,
        overwrite: true,
        ignoreNoDocuments: true,
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
                    '// Last modified: ' + new Date().toUTCString(),
                  ],
                },
              },
              'typescript',
              'typescript-operations',
              'typescript-react-apollo',
            ],
            config: {
              scalars,
              addDocBlocks: false,
              strictScalars: true,
              dedupeFragments: true,
              pureMagicComment: true,
              disableDescriptions: true,
              skipDocumentsValidation: true,
              onlyOperationTypes: true,
              withRefetchFn: true,
              nonOptionalTypename: true,
            },
          },
        },
      },
    },
  };
}

const projects = {
  'ecommerce-app.admin': createAdminConfig(
    NEXT_PUBLIC_PORTAL_API,
    './apps/ecommerce-app/src/libs/global/src/graphql/**/*.gql',
    './apps/ecommerce-app/src/libs/global/src/graphql/generated.tsx'
  ),
};

export default {
  projects,
};
