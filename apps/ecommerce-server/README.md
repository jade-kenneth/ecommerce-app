## Configuration

- `AUTH_MONGODB_URI`
- `JWT_SECRET_KEY`
- `REDPANDA_BROKERS`

## Start

```bash
JWT_SECRET_KEY=be586b6fd25efdc6cdb924467b0cbd6c AUTH_MONGODB_URI=mongodb://localhost:27117,localhost:27118/auth npx nx run auth:serve
```

```
JWT_SECRET_KEY=be586b6fd25efdc6cdb924467b0cbd6c HIGHPOINT_THRESHOLD=2 npm run server
```

## Start Projection

```bash
AUTH_MONGODB_URI=mongodb://localhost:27117,localhost:27118/auth EVENT_STORE_MONGODB_URI=mongodb://localhost:27117,localhost:27118/event_store PROJECTIONS=account REDPANDA_BROKERS=localhost:9092,localhost:9093,localhost:9094 npx nx run auth:serve
```

```bash
AUTH_MONGODB_URI=mongodb+srv://admin:ppdIw4d0ZKYPsqkzu7Ow@wallet-development.mcemd.mongodb.net/auth EVENT_STORE_MONGODB_URI=mongodb+srv://admin:nEagp4D8g38VogEAgWtH@wallet-eventstore-devel.1ajlz.mongodb.net/eventstore REDPANDA_BROKERS=52.221.209.147:9092,13.229.83.234:9092,18.142.114.196:9092 npx nx run auth:serve --args='-p account'
```

## Create Kafka Topic

```bash
REDPANDA_BROKERS=localhost:9092,localhost:9093,localhost:9094 rpk topic create --replicas 3 --partitions 1 auth-account
REDPANDA_BROKERS=localhost:9092,localhost:9093,localhost:9094 rpk topic create --replicas 3 --partitions 1 account-account
REDPANDA_BROKERS=localhost:9092,localhost:9093,localhost:9094 rpk topic create --replicas 3 --partitions 1 account-platform
```
