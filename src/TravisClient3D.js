import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setToken,
  setUserAsync,
  getReposAsync,
  getBuildsAsync,
  getBuildJobsAsync,
  getJobAsync,
  getJobLogAsync,
  selectToken,
  selectUser,
  selectRepos,
  selectBuilds,
  selectBuildJobs,
  selectJob,
  selectJobLog,
} from "./userSlice";
import "./TravisClient.css";

function TravisClient3D() {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const repos = useSelector(selectRepos);
  const builds = useSelector(selectBuilds);
  const buildJobs = useSelector(selectBuildJobs);
  const job = useSelector(selectJob);
  const jobLog = useSelector(selectJobLog);
  const dispatch = useDispatch();

  var source = new EventSource("/stream");
  source.onmessage = function (event) {
    console.log(event.data);
  };
  return (
    <div>
      <div>
        <a-scene>
          <a-entity camera look-controls wasd-controls position="0 2 0">
            <a-cursor></a-cursor>
          </a-entity>
          <a-entity environment></a-entity>
        </a-scene>
      </div>
      <button
        onClick={(e) => {
          var sceneEl = document.querySelector("a-scene");
          let posicion_incial = " 1 1 -1.5";
          let str_geometria = "primitive: plane; width: 3; height: 0.75";
          let str_alineacion_texto = "center";
          let str_color = "color: green";
          let text = "holaaa";
          let es_visible = true;
          let entityEl = document.createElement("a-text");
          entityEl.setAttribute("geometry", str_geometria);
          entityEl.setAttribute("material", str_color);
          entityEl.setAttribute("value", text);
          entityEl.setAttribute("align", str_alineacion_texto);
          entityEl.setAttribute("anchor", "center");
          entityEl.setAttribute("baseline", "center");
          entityEl.setAttribute("position", posicion_incial);
          entityEl.setAttribute("visible", es_visible);
          sceneEl.appendChild(entityEl);
        }}
      >
        ok2
      </button>
    </div>
  );
}

export default TravisClient3D;
