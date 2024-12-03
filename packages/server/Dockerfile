FROM node:20-alpine

WORKDIR /app

COPY package-lock.json .

COPY package.json .

COPY *.js .

COPY *.json .

COPY *.sh .

COPY .env .

RUN ls -l

RUN corepack enable

RUN pnpm install

EXPOSE 3000

ENV OTEL_LOG_LEVEL INFO

CMD ["node", "-r", "./tracing.js", "./index.js"]
