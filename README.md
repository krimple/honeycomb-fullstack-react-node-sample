# Open Telemetry and Honeycomb Web SDK Full-Stack JavaScript instrumentation demo

This sample project shows a React front-end instrumented with Honeycomb's open-source [Web SDK](https://github.com/honeycombio/honeycomb-opentelemetry-web), 
pointing to a backend service running in Node.js and Express, which is instrumented with the OpenTelemetry Node SDK, 
part of [opentelemetry-js](https://github.com/open-telemetry/opentelemetry-js).

It is a simple demo to show the minimum configuration needed to:

1. Capture web-layer traces including click events and document loading
2. Trace fetch calls which make requests to a network service REST API
3. Pick up and trace incoming routes to Express in a Node.js application
4. Follow the trace to the handlers, with introduced latency in a middleware function

### Setup

1. cp packages/client/.env-sample packages/client/.env
2. cp packages/server/.env-sample packages/server/.env
3. cp .env-sample .env and change the `HONEYCOMB_API_KEY` to your Honeycomb ingest key so the collector can send data to honeycomb
4. Login to docker (`docker login`)
5. Login to ghcr.io (`docker login ghcr.io`)

### Build and run

```
docker compose up --build
```
Note: JSON-based logging via bunyan for app server in docker logs, as is all container builds, database and other logging information

### Access the frontend

The react frontend is hosted at `http://localhost:5173` 

## Dependencies

* Node.js LTS
* Docker and compose
* A Honeycomb account

