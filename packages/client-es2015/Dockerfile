FROM node:20-alpine AS builder

WORKDIR /app

COPY src/ ./src

COPY nginx/ ./nginx

COPY index.html .

COPY package-lock.json .

COPY package.json .

COPY *.js .

COPY *.ts .

COPY *.json .

COPY .env .

RUN ls -l

RUN corepack enable

RUN pnpm install

RUN pnpm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY --from=builder /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
