import React, { useState, useEffect, Fragment } from "react";
//import { elementGenerator } from "./elementGenerator";
import { useSelector, useDispatch } from "react-redux";
import {
  repoOptionsGenerator,
  buildOptionsGenerator,
  showLoading,
  hideLoading,
} from "./funciones";
import {
  setToken,
  setUserAsync,
  getReposAsync,
  getExternalReposAsync,
  getRepoTreeAsync,
  getBuildsAsync,
  getBuildJobsAsync,
  getJobLogAsync,
  selectToken,
  selectUser,
  selectLoading,
  selectRepos,
  selectBuilds,
  selectBuildJobs,
  selectJobLog,
  selectRepoTree,
  clearAll,
} from "./userSlice";

function Escena3D() {
  const [reposRendered, setReposRendered] = useState(false);
  const token = useSelector(selectToken);
  const loading = useSelector(selectLoading);
  const repos = useSelector(selectRepos);
  const jobLog = useSelector(selectJobLog);
  const repoTree = useSelector(selectRepoTree);
  const dispatch = useDispatch();

  dispatch(setToken("EDA3W8-FZmyIpOO0PutuCQ"));

  useEffect(() => {
    const aScene = document.querySelector("a-scene");
    loading ? showLoading(aScene) : hideLoading(aScene);
    repos && repoOptionsGenerator(aScene, repos);
    repoTree && buildOptionsGenerator(aScene, repoTree);
    if (!AFRAME.components["click-component"]) {
      AFRAME.registerComponent("click-component", {
        init: function () {
          this.el.addEventListener("click", (e) => {
            let id = this.el.getAttribute("id");
            if (id == "btnLoadRepos") {
              dispatch(getExternalReposAsync(token, "github/rails"));
            } else if (id == "opcionRepo") {
              let id_repo = this.el.getAttribute("id_repo");
              dispatch(getRepoTreeAsync(token, id_repo));
            } else {
              console.log(this);
            }
          });
        },
      });
    }
  });
  return (
    <a-scene cursor="rayOrigin: mouse" raycaster="objects: .clickable">
      <a-assets>
        <img id="piso" src="/dist/imgs/piso.jpg" />
      </a-assets>
      <a-camera>
        <a-entity
          click-component
          id="btnBack"
          class="clickable"
          text="align: center; value:Back; color:#FFF; width: 0.15; font:kelsonsans"
          geometry="primitive: plane; width: 0.02; height: 0.02"
          material="color: black"
          position="0 -0.072 -0.1"
        ></a-entity>
      </a-camera>
      <a-plane
        position="0 0 -4"
        rotation="-90 0 0"
        width="50"
        height="50"
        repeat="10 10"
        src="#piso"
      ></a-plane>
      <a-entity
        click-component
        id="btnLoadRepos"
        class="clickable"
        text="align: center; value:load repos; color:#FFF; width: 2;"
        geometry="primitive: plane; width: 0.5; height: 0.5"
        material="color: blue"
        position="0 0.3 -1"
        rotation="-90 0 0"
      ></a-entity>
      <a-sky color="#ECECEC"></a-sky>
    </a-scene>
  );
}

export default Escena3D;
