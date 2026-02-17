import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';

import { defaultFieldResolver, GraphQLError, GraphQLSchema } from 'graphql';
import * as R from 'ramda';
import { AccountType } from '~/types/common';

export function authorizationRequiredDirectiveSchemaTransformer(
  schema: GraphQLSchema,
  directiveName: string,
) {
  return mapSchema(schema, {
    [MapperKind.MUTATION_ROOT_FIELD]: (fieldConfig) => {
      return resolveFieldConfig(fieldConfig, schema, directiveName);
    },
    [MapperKind.QUERY_ROOT_FIELD]: (fieldConfig) => {
      return resolveFieldConfig(fieldConfig, schema, directiveName);
    },
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      return resolveFieldConfig(fieldConfig, schema, directiveName);
    },
  });
}

function resolveFieldConfig(fieldConfig, schema, directiveName) {
  const authorizationRequiredDirective = getDirective(
    schema,
    fieldConfig,
    directiveName,
  )?.[0];

  if (authorizationRequiredDirective) {
    const { resolve = defaultFieldResolver, resolveField } = fieldConfig;
    if (resolveField) {
      const originalResolveField = resolveField;
      fieldConfig.resolveField = async function (source, args, context, info) {
        const { claims, permissions } = context;
        if (
          !claims ||
          !R.includes(claims.role, authorizationRequiredDirective['roles']) ||
          (authorizationRequiredDirective['permissions'] &&
            (claims.role === AccountType.Admin ||
              claims.role === AccountType.Member) &&
            !R.any(
              (permission) =>
                R.includes(
                  permission,
                  authorizationRequiredDirective['permissions'],
                ),
              permissions,
            ))
        ) {
          throw new GraphQLError('access denied', {
            extensions: {
              code: 'FORBIDDEN',
            },
          });
        }

        const result = await originalResolveField(source, args, context, info);

        return result;
      };
    }

    fieldConfig.resolve = async function (source, args, context, info) {
      const { claims, permissions } = context;

      if (
        !claims ||
        !R.includes(claims.role, authorizationRequiredDirective['roles']) ||
        (authorizationRequiredDirective['permissions'] &&
          (claims.role === AccountType.Member ||
            claims.role === AccountType.Admin) &&
          !R.any(
            (permission) =>
              R.includes(
                permission,
                authorizationRequiredDirective['permissions'],
              ),
            permissions,
          ))
      ) {
        throw new GraphQLError('access denied', {
          extensions: {
            code: 'FORBIDDEN',
          },
        });
      }

      const result = await resolve(source, args, context, info);

      return result;
    };

    return fieldConfig;
  }

  return fieldConfig;
}
