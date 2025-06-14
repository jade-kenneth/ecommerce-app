# Line 1
FROM node:20-alpine as builder
# Line 2
ENV NODE_ENV build
# Line 3
WORKDIR /ecommerce-server
# Line 4
COPY package*.json ./
# Line 5
RUN npm install --legacy-peer-deps
# Line 6
COPY . .
# Line 7
RUN npm run build:server

# Line 8
FROM node:20-alpine
# Line 9
ENV NODE_ENV production
# Line 10
WORKDIR /ecommerce-server
# Line 11
COPY --from=builder  ./package*.json ./
COPY --from=builder  ./node_modules/ ./node_modules/
COPY --from=builder  ./dist/ecommerce-server/ ./dist/ecommerce-server/
# Line 12
CMD ["node", "dist/ecommerce-server/main.js"]