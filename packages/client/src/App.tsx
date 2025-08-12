import BookLibrary from "./books/BookLibrary.tsx";

function App() {
  return (
    <>
      <header>
        <h1>Fullstack Telemetry and Errors Demo</h1>
        <p>Session ID is { sessionStorage.getItem("sessionId") }</p>
       </header>
      <div className="w-4/5 mx-auto my-auto p-10">
        <BookLibrary />
      </div>
    </>
  );
}

export default App;
