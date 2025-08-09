# Stage 1
FROM node:20-alpine AS builder

WORKDIR /build

RUN corepack enable pnpm

COPY package*.json .
COPY pnpm*.yaml .

RUN pnpm install

COPY src src
COPY tsconfig.json .

RUN pnpm run build

# Stage 2
FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable pnpm

COPY --from=builder build/package*.json .
COPY --from=builder build/dist dist
COPY public public

RUN pnpm install --prod

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system  --uid 1001 nodejs

USER nodejs

EXPOSE 8000

ENV PORT=8000

CMD [ "pnpm","run","start" ]