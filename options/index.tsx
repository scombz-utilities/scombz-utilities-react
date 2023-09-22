import { useState } from "react";

function OptionsIndex() {
  const [data, setData] = useState("");

  return (
    <div>
      <h1>This is the Option UI page!</h1>
      <input onChange={(e) => setData(e.target.value)} value={data} />
    </div>
  );
}

export default OptionsIndex;
