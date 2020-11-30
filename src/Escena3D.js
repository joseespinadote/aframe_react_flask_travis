import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  repoOptionsGenerator,
  buildOptionsGenerator,
  errorsGenerator,
  renderBuildMatrix,
  showLoading,
  hideLoading,
  goBack,
} from "./funciones";
import {
  setToken,
  getExternalReposAsync,
  getRepoTreeAsync,
  getJobLogAsync,
  selectToken,
  selectLoading,
  selectRepos,
  selectJobLog,
  selectRepoTree,
  selectBuildById,
  selectSelectedBuild,
  clearAll,
  clearSelectBuildById,
  clearRepoTree,
  clearJobLog,
} from "./userSlice";

function Escena3D() {
  const [reposRendered, setReposRendered] = useState(false);
  const [repoTreeRendered, setRepoTreeRendered] = useState(false);
  const [buildMatrixRendered, setbuildMatrixRendered] = useState(false);
  const [logRendered, setLogRendered] = useState(false);
  const token = useSelector(selectToken);
  const loading = useSelector(selectLoading);
  const repos = useSelector(selectRepos);
  const jobLog = useSelector(selectJobLog);
  const repoTree = useSelector(selectRepoTree);
  const selectedBuild = useSelector(selectSelectedBuild);
  const dispatch = useDispatch();

  dispatch(setToken("EDA3W8-FZmyIpOO0PutuCQ"));

  useEffect(() => {
    const aScene = document.querySelector("a-scene");
    loading ? showLoading(aScene) : hideLoading(aScene);
    if (repos && !reposRendered && !loading) {
      repoOptionsGenerator(aScene, repos);
      setReposRendered(true);
    }
    if (repoTree && !repoTreeRendered && !loading) {
      buildOptionsGenerator(aScene, repoTree);
      setRepoTreeRendered(true);
    }
    if (selectedBuild && !buildMatrixRendered && !loading) {
      renderBuildMatrix(selectedBuild, aScene);
      setbuildMatrixRendered(true);
    }
    if (jobLog && !logRendered && !loading) {
      errorsGenerator(aScene, jobLog.errores);
      setLogRendered(true);
    }
    if (!AFRAME.components["click-component"]) {
      AFRAME.registerComponent("click-component", {
        init: function () {
          let id = this.el.getAttribute("id_objeto");
          this.el.addEventListener("click", (e) => {
            if (id == "btnLoadRepos") {
              dispatch(getExternalReposAsync(token, "github/rails"));
            } else if (id == "opcionRepo") {
              let id_repo = this.el.getAttribute("id_repo");
              dispatch(getRepoTreeAsync(token, id_repo));
              setRepoTreeRendered(false);
            } else if (id == "opcionBuild") {
              let els = aScene.querySelectorAll("[id_build]");
              for (let i = els.length - 1; i >= 0; i--) {
                els[i].object3D.position.x = -1.5;
              }
              let id_build = this.el.getAttribute("id_build");
              dispatch(selectBuildById(id_build));
              setbuildMatrixRendered(false);
              this.el.object3D.position.x += 0.2;
            } else if (id == "buildMatrix") {
              let id_job = this.el.getAttribute("id_job");
              dispatch(getJobLogAsync(token, id_job));
              setLogRendered(false);
            } else if (id == "btnBack") {
              goBack(aScene);
            } else {
            }
          });
          this.el.addEventListener("mousedown", (e) => {
            if (id == "btnLeft") {
              let els = aScene.querySelectorAll(".log");
              for (let i = els.length - 1; i >= 0; i--) {
                let element = els[i];
                let toX = -99 + element.object3D.position.x;
                element.setAttribute(
                  "animation",
                  "property: position; to: " +
                    toX.toString() +
                    " 1.6 -1.5; dur: 20000; easing: linear;"
                );
              }
            } else if (id == "btnRight") {
              let els = aScene.querySelectorAll(".log");
              for (let i = els.length - 1; i >= 0; i--) {
                let element = els[i];
                let toX = 99 + element.object3D.position.x;
                element.setAttribute(
                  "animation",
                  "property: position; to: " +
                    toX.toString() +
                    " 1.6 -1.5; dur: 20000; easing: linear;"
                );
              }
            }
          });
          this.el.addEventListener("mouseup", (e) => {
            if (id == "btnLeft" || id == "btnRight") {
              let els = aScene.querySelectorAll(".log");
              for (let i = els.length - 1; i >= 0; i--) {
                let element = els[i];
                element.removeAttribute("animation");
              }
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
        <a-asset-item id="tux" src="/dist/tux/scene.gltf"></a-asset-item>
        <a-asset-item id="osx" src="/dist/osx/scene.gltf"></a-asset-item>
        <a-asset-item
          id="question"
          src="/dist/question/scene.gltf"
        ></a-asset-item>
      </a-assets>
      <a-camera>
        <a-entity
          click-component
          id="btnBack"
          id_objeto="btnBack"
          class="clickable"
          text="align: center; value:Back; color:#FFF; width: 0.15; font:kelsonsans"
          geometry="primitive: plane; width: 0.02; height: 0.02"
          material="color: black"
          position="0 -0.072 -0.1"
          animation="property: position; from: 0 -1 -0.1; to: 0 -0.072 -0.1; dur: 1000; easing: linear; dir: reverse;"
        ></a-entity>
        <a-entity
          click-component
          id="btnLeft"
          id_objeto="btnLeft"
          class="clickable"
          text="align: center; value:<--; color:#FFF; width: 0.15; font:kelsonsans"
          geometry="primitive: plane; width: 0.02; height: 0.02"
          material="color: black"
          position="-0.03 -0.072 -0.1"
          animation="property: position; from: -0.03 -1 -0.1; to: -0.03 -0.072 -0.1; dur: 1000; easing: linear; dir: reverse;"
        ></a-entity>
        <a-entity
          click-component
          id="btnRight"
          id_objeto="btnRight"
          class="clickable"
          text="align: center; value:-->; color:#FFF; width: 0.15; font:kelsonsans"
          geometry="primitive: plane; width: 0.02; height: 0.02"
          material="color: black"
          position="0.03 -0.072 -0.1"
          animation="property: position; from: 0.03 -1 -0.1; to: 0.03 -0.072 -0.1; dur: 1000; easing: linear; dir: reverse;"
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
        id_objeto="btnLoadRepos"
        class="clickable"
        text="align: center; value:load repos; color:#FFF; width: 2;"
        geometry="primitive: plane; width: 0.5; height: 0.5"
        material="color: blue"
        position="0 1 -1"
        rotation="-90 0 0"
      ></a-entity>
      <a-sky color="#ECECEC"></a-sky>
    </a-scene>
  );
}

export default Escena3D;
