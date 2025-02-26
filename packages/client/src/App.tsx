import { useEffect } from "react";
import BookLibrary from "./books/BookLibrary.tsx";

function App() {

  useEffect(()  => {
    throw new Error('Why doe smy stuff fail')
  }, []);
  return (
    <>
      <div className="w-4/5 mx-auto my-auto p-10">
        <BookLibrary />
      </div>
    </>
  );
}

export default App;
