import Messenger from "./Messenger.tsx";
import OpenTelemetry from "./OpenTelemetry.tsx";

function App() {
  return (
    <>
    <OpenTelemetry />
      <div className="w-4/5 mx-auto my-auto p-10">
        <h1 className="text-4xl text-center bold">
          Fetch example
        </h1>
        <hr />
        <Messenger />
      </div>
    </>
  );
}

export default App;
