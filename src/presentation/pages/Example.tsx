import type React from "react";
import useStores from "../hooks/use-stores";

const Example: React.FC = () => {
  // pick specific store and use it
  const { data, status, errorMessage, fetchData, resetData, retry } =
    useStores("dataStore");

  return (
    <div>
      <p>Status: {status}</p>
      <p>Data: {data}</p>
      <p>Error: {errorMessage ?? "pas d'erreur"}</p>
      <button type="button" onClick={fetchData}>
        {status === "loading" ? "loading" : "Fetch Data"}
      </button>
      <button
        type="button"
        onClick={resetData}
        disabled={["idle"].includes(status)}
      >
        Reset
      </button>
      <button
        type="button"
        onClick={retry}
        disabled={!["success", "error"].includes(status)}
      >
        Retry
      </button>
    </div>
  );
};

export default Example;
