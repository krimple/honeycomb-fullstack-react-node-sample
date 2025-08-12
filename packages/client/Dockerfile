FROM node:20-alpine AS builder

ARG SYMBOLS_PATH

WORKDIR /app

COPY src/ ./src

COPY nginx/ ./nginx

COPY index.html .

COPY package-lock.json .

COPY package.json .

COPY *.js .

COPY *.ts .

COPY *.json .

COPY .env.docker ./.env

RUN ls -l

RUN npm install

RUN npm run build

# Copy symbols for symbolicator

RUN mkdir -p ${SYMBOLS_PATH}/assets/

RUN cp -r dist/assets/*.* ${SYMBOLS_PATH}/assets/
RUN echo "directory contents: " && ls -R ${SYMBOLS_PATH}/assets/

FROM nginx:stable-alpine as nginx-local

COPY --from=builder /app/dist /usr/share/nginx/html

# Remove the map files
RUN rm /usr/share/nginx/html/assets/*.map

COPY --from=builder /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

FROM honeycombio/honeycomb-opentelemetry-collector:latest as collector-local
COPY --from=builder ${SYMBOLS_PATH} /symbols/
