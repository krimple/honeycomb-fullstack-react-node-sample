import { Book } from "../types.ts";
import { otelSendAttributeInCurrentSpan } from "../../utils/otel/addAttributeToSpan.ts";

const resourceEndpoint = `${
  import.meta.env.VITE_PUBLIC_APP_SERVER_URL
}/api/books`;

/**
 * An unwrapped fetch call with async/await
 */
export async function fetchBooks() {
  otelSendAttributeInCurrentSpan('app.demo-function-mode', 'async-unwrapped');
  const result = await fetch(resourceEndpoint);
  if (!result.ok) {
    throw new Error(result.statusText);
  }
  return (await result.json()) as Book[];
}

export async function addBook(book: Book) {
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
