import setupO11y from "./otel-config.ts";
import Messenger from "./Messenger.tsx";

function App() {

  setupO11y();
  return (
    <div className="w-4/5 mx-auto my-auto p-10">
      <h1 className="text-4xl text-center bold">Fetch instrumentation example</h1>
      <hr/>
      <Messenger />
    </div>
  );
}

export default App;
