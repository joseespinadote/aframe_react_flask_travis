import React, { useState } from "react";
import TravisClient from "./TravisClient";
//import TravisClientAR from "./TravisClientAR";
import TravisClientVR from "./TravisClientVR";

function Start() {
  const [opcion, setOpcion] = useState("");
  return (
    <div>
      <button
        onClick={(e) => {
          setOpcion("txt");
        }}
      >
        text
      </button>
      <button
        onClick={(e) => {
          setOpcion("VR");
        }}
      >
        VR
      </button>
      <button
        onClick={(e) => {
          setOpcion("AR");
        }}
      >
        AR
      </button>
      {opcion == "txt" && <TravisClient />}
      {opcion == "VR" && <TravisClientVR />}
    </div>
  );
}

export default Start;
