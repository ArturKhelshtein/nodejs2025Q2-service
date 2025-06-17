FROM node:22.14.0-alpine AS deps

WORKDIR /app
RUN apk add --no-cache netcat-openbsd wget
COPY package*.json ./
RUN npm install
RUN npm install -g @nestjs/cli
COPY prisma ./prisma/
RUN npx prisma generate

FROM node:22.14.0-alpine
WORKDIR /app
RUN apk add --no-cache wget netcat-openbsd dos2unix
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/prisma ./prisma

COPY tsconfig.json ./
COPY migrate.sh ./
COPY src ./src
COPY doc ./doc
RUN dos2unix migrate.sh && \
    chmod +x migrate.sh && \
    ls -la migrate.sh

ENV PORT=4000 \
    HOST=0.0.0.0 \
    NODE_ENV=development

EXPOSE 4000

CMD ["./migrate.sh"]