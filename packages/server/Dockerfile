FROM node:20-alpine

WORKDIR /app

COPY package-lock.json .

COPY package.json .

COPY src ./dist

COPY *.json .

COPY *.sh .

COPY .env.docker ./.env

RUN ls -l

RUN npm install

RUN npm install -g bunyan

EXPOSE 3000

ENV OTEL_LOG_LEVEL INFO

CMD ["node", "-r", "dotenv/config", "-r", "/app/dist/tracing.js", "/app/dist/index.js", "|", "bunyan"]
