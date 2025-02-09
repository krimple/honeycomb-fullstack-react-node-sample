import { Book } from "../types.ts";
import { otelWrapperWithResponse } from "../../utils/otel/otelWrapperWithResponse.ts";
import { otelWrapper } from "../../utils/otel/otelWrapper.ts";
import { SpanStatusCode, trace } from "@opentelemetry/api";
import { otelSendAttributeInCurrentSpan } from "../../utils/otel/addAttributeToSpan.ts";

const resourceEndpoint = `${
  import.meta.env.VITE_PUBLIC_APP_SERVER_URL
}/api/books`;

// TODO: super cheapo dummy feature flag - use flagd later?
export const functionMode = import.meta.env.VITE_PUBLIC_FF_API_CALL_TYPE;

/**
 * n.b. deciding at this layer is a problem, because we're turning it into a promise
 *
 * Call either the async/await or promise-based fetch of books
 * based on the value in packages/client-es2015/.env
 */
// export const fetchBooks = (): Promise<Book[]> => {
//   if (functionMode === "promise") {
//     console.log("using promises");
//     return fetchBooksPromise();
//   } else if (functionMode === "async-unwrapped") {
//     console.log("using unwrapped async/await");
//     return fetchBooksAsyncUnwrapped();
//   } else {
//     console.log("using async/await");
//     return fetchBooksAsync();
//   }
// };

/**
 * An unwrapped fetch call with async/await
 */
export async function fetchBooksAsyncUnwrapped() {
  otelSendAttributeInCurrentSpan('app.demo-function-mode', 'async-unwrapped');
  const result = await fetch(resourceEndpoint);
  if (!result.ok) {
    throw new Error(result.statusText);
  }
  return (await result.json()) as Book[];
}
/**
 * We are wrapping an async function so the helper `otelWrapperWithResponse` here is
 * handling creating the span in the context, tracking the success/failure and updating
 * the span status/embedding the exception. This wrapper uses a generic type for the data
 * returned.
 */
export async function fetchBooksAsync(): Promise<Book[]> {
  return otelWrapperWithResponse<Book[]>(async () => {
    otelSendAttributeInCurrentSpan('app.demo-function-mode', 'async-wrapped');
    const result = await fetch(resourceEndpoint);
    if (!result.ok) {
      throw new Error(result.statusText);
    }
    return (await result.json()) as Book[];
  }, "fetchBooks async wrapper");
}
/**
 * Note: in a promise auto-wrapped fetch, the error is reported by the instrumentation
 * and no span exists; you don't have to record the exception or set the state
 * of the span created by the fetch.
 *
 * @returns Promise<Book[]> the list of books
 */
export function fetchBooksPromise(): Promise<Book[]> {
  return new Promise((resolve, reject) => {
    otelSendAttributeInCurrentSpan('app.demo-function-mode', 'promise');
    fetch(resourceEndpoint)
      .then((result) => {
        // result is ok only if  200 <= result <= 299
        if (!result.ok) {
          // some sort of HTTP status code returned from server,
          // treat as a logical error
          throw new Error(result.statusText || "unknown error");
        }
        // next promise in the chain returned by this statement
        return result.json();
      })
      .then((books) => resolve(books))
      .catch((e) => {
        const span = trace.getActiveSpan();
        span?.recordException(e);
        span?.setStatus({
          code: SpanStatusCode.ERROR,
          message: "message" in e ? e.getMessage() : "unknown error",
        });
        // of course tell the console...
        console.error(e);
        reject(e);
      });
  });
}

/**
 * Note: in a promise auto-wrapped fetch, the error is reported by the instrumentation
 * and no span exists. Therefore you don't have to record the exception and set the state
 * of the span created by the fetch.
 * @param book the book to persist
 */
export function addBookPromises(book: Book) {
  return fetch(`${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    // TODO - camel case to snake case field mapping - should be a mapping in the server side
    // perhaps - noting it here because we are sending snake case downstream
    body: JSON.stringify(book),
  }).then((result) => {
    otelSendAttributeInCurrentSpan('app.demo-function-mode', 'promise');
    // fetch doesn't throw errors for statuses < 500
    // so you have to interrogate the result
    if (!result.ok) {
      console.dir(result);
      throw new Error(result.statusText || "unknown error");
    }
  });
}

/**
 * Because you are wrapping an async function, you are responsible for creating the span, so we call
 * the `otelWrapper` helper function here, which creates a span and sets the status based on pass/fail.
 * @param book
 */
export async function addBookAsync(book: Book) {
  return otelWrapper(async () => {
    otelSendAttributeInCurrentSpan('app.demo-function-mode', 'async-wrapped');
    try {
      const result = await fetch(
        `${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          // TODO - camel case to snake case field mapping - should be a mapping in the server side
          // perhaps - noting it here because we are sending snake case downstream
          body: JSON.stringify(book),
        }
      );

      if (!result.ok) {
        throw new Error(result.statusText);
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  }, "addBook");
}
export async function addBookAsyncUnwrapped(book: Book) {
  try {
    otelSendAttributeInCurrentSpan('app.demo-function-mode', 'async-unwrapped');
    const result = await fetch(
      `${import.meta.env.VITE_PUBLIC_APP_SERVER_URL}/api/books`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        // TODO - camel case to snake case field mapping - should be a mapping in the server side
        // perhaps - noting it here because we are sending snake case downstream
        body: JSON.stringify(book),
      }
    );

    if (!result.ok) {
      throw new Error(result.statusText);
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}
