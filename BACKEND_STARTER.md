You are a senior NestJS + Nx backend engineer. Generate a backend scaffold that mirrors my backend architecture style.

Important:
- Do not hardcode any app name.
- Use:
  - `APP_NAME`
  - `APP_ROOT = apps/${APP_NAME}`
  - `SRC_ROOT = ${APP_ROOT}/src`

Project assumptions:
- Nx monorepo
- TypeScript
- NestJS + Apollo GraphQL (SDL-first) + Mongoose

Create:
- `${APP_ROOT}/scripts/generate-graphql-types.ts`
- `${SRC_ROOT}/main.ts`
- `${SRC_ROOT}/app/app.module.ts`
- `${SRC_ROOT}/app/app.controller.ts`
- `${SRC_ROOT}/app/app.service.ts`
- `${SRC_ROOT}/app/config/*`
- `${SRC_ROOT}/app/schemas/*.gql`
- `${SRC_ROOT}/app/__generated/graphql-types.ts`
- `${SRC_ROOT}/libs/*` (repository + mongoose-repository + async-event-module + object helpers)
- `${SRC_ROOT}/util/*` (authorization directive + safe parse + cursor)
- `${SRC_ROOT}/types/*`
- sample feature module: products (module/service/resolver/repository)
- sample REST controller module: ratings (controller/service)

Implementation requirements:
1. `main.ts`: bootstrap Nest app, CORS, listen on `process.env.PORT`.
2. `app.module.ts`: ConfigModule, MongooseModule, GraphQLModule (Apollo), upload scalar, custom directive transformer, feature modules.
3. `app.controller.ts` + `app.service.ts`: simple `GET /` response.
4. `generate-graphql-types.ts`: `GraphQLDefinitionsFactory` from `.gql` -> `__generated/graphql-types.ts`.
5. Strong typing in repository abstractions and utils.

Also generate a `package.json` snippet including these packages I use.

Dependencies:
- `@apollo/server` (`^4.11.3`)
- `@getbrevo/brevo` (`^3.0.1`)
- `@graphql-tools/utils`
- `@nestjs/apollo` (`^12.2.1`)
- `@nestjs/common` (`^10.4.1`)
- `@nestjs/core` (`^10.0.2`)
- `@nestjs/graphql` (`^12.2.2`)
- `@nestjs/mongoose` (`^10.1.0`)
- `@nestjs/platform-express` (`^10.4.1`)
- `@nx/nest` (`22.3.3`)
- `axios` (`^1.13.2`)
- `bcrypt` (`^6.0.0`)
- `bs58` (`^6.0.0`)
- `cloudinary` (`^2.7.0`)
- `crypto-hash` (`^3.1.0`)
- `date-fns` (`^4.1.0`)
- `decimal.js` (`^10.5.0`)
- `es-toolkit` (`^1.43.0`)
- `express` (`4.22.1`)
- `googleapis` (`^150.0.1`)
- `graphql` (`^16.10.0`)
- `graphql-constraint-directive` (`^6.0.0`)
- `graphql-scalars` (`^1.24.0`)
- `graphql-upload` (`15.0.0`)
- `ioredis` (`^5.9.2`)
- `jsonwebtoken` (`^9.0.3`)
- `kafkajs` (`^2.2.4`)
- `luxon` (`^3.7.2`)
- `mongodb` (`^6.12.0`)
- `mongoose` (`^8.9.4`)
- `ms` (`^2.1.3`)
- `ramda` (`^0.30.1`)
- `randombytes` (`^2.1.0`)
- `yamljs` (`^0.3.0`)
- `zod` (`^3.25.56`)

Dev dependencies:
- `@nestjs/testing` (`^10.0.2`)
- `@nx/js` (`22.3.3`)
- `@nx/node` (`22.3.3`)
- `@types/node` (`24.2.0`)
- `nx` (`22.3.3`)
- `ts-node` (`10.9.1`)
- `typescript` (`^5.9.3`)
- `webpack-cli` (`^5.1.4`)

Packages to verify (imported in source but not found in package.json):
- `@graphql-tools/utils`

Output format:
1. Directory tree
2. Full file contents (fenced blocks)
3. Nx `project.json` target snippet (`generate-graphql-types`)
4. Install + generate + serve commands

Keep code strongly typed, clean, and production-lean.
