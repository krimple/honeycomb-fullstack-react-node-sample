import Messenger from "./Messenger.tsx";
import BookLibrary from "./books/BookLibrary.tsx";

function App() {
  return (
    <>
      <div className="w-4/5 mx-auto my-auto p-10">
        <h1 className="text-4xl text-center bold">
          Fetch example
        </h1>
        <hr />
        <Messenger />
        <BookLibrary />
      </div>
    </>
  );
}

export default App;
