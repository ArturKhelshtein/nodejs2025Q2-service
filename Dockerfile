FROM node:20.11.1-alpine AS deps

WORKDIR /app
RUN apk add --no-cache netcat-openbsd wget
COPY package*.json ./
RUN npm install
COPY prisma ./prisma/
RUN npx prisma generate

FROM node:20.11.1-alpine
WORKDIR /app
RUN apk add --no-cache wget netcat-openbsd
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/prisma ./prisma

COPY tsconfig.json ./
COPY migrate.sh ./
RUN chmod +x migrate.sh

ENV PORT=4000 \
    HOST=0.0.0.0 \
    NODE_ENV=development

EXPOSE 4000

CMD ["./migrate.sh"]