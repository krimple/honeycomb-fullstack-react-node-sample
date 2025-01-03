# Simple (dumb) React demo shell with Honeycomb's Web SDK installed


Full instrumentation example

```javascript
    // // Fetch books from the backend
    // const fetchBooksWrapped = async () => {
    //     return await context.with(trace.setSpan(context.active(), span), async () => {
    //         try {
    //             const response = await fetch(`${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`);
    //             if (!response.ok) {
    //                 span.setStatus({
    //                     code: SpanStatusCode.ERROR,
    //                     message: response.statusText,
    //                 });
    //                 // TODO - handle this condition properly - for now return undefined? YUCK?
    //                 return;
    //             }
    //             // parse up data and send back
    //             const data = await response.json();
    //             setBooks(data);
    //         } catch (error) {
    //             // @ts-expect-error error type unknown
    //             span.recordException(error);
    //             console.error(error);
    //         } finally {
    //             span.end();
    //         }
    //     });
    // };
```