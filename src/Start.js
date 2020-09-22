import React, { useState } from "react";
import TravisClient from "./TravisClient";
import TravisClient3D from "./TravisClient3D";

function Start() {
  const [opcion, setOpcion] = useState("");
  return (
    <div>
      <button
        onClick={(e) => {
          setOpcion("2d");
        }}
      >
        2d
      </button>
      <button
        onClick={(e) => {
          setOpcion("3d");
        }}
      >
        3d
      </button>
      {opcion == "2d" && <TravisClient />}
      {opcion == "3d" && <TravisClient3D />}
    </div>
  );
}

export default Start;
