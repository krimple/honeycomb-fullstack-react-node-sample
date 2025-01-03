# Open Telemetry and Honeycomb Web SDK Full-Stack JavaScript instrumentation demo

This sample project shows a React front-end instrumented with Honeycomb's open-source [Web SDK](https://github.com/honeycombio/honeycomb-opentelemetry-web), 
pointing to a backend service running in Node.js and Express, which is instrumented with the OpenTelemetry Node SDK, part of [opentelemetry-js](https://github.com/open-telemetry/opentelemetry-js).

It is a simple demo to show the minimum configuration needed to:

1. Capture web-layer traces including click events and document loading
2. Trace fetch calls which make requests to a network service REST API
3. Pick up and trace incoming routes to Express in a Node.js application
4. Follow the trace to the handlers, with introduced latency in a middleware function

To run:

```
# in one window (or detach)
docker compose up --build

# in other window (after any docker compose down -v or first time)
# you have to run the migrations to the postgres database to allow
# table inserts
npm install
npm run flyway:migrate
```
## Dependencies

* Flyway (`brew install flyway`)
* Node.js LTS
* Docker and compose
* A Honeycomb account

