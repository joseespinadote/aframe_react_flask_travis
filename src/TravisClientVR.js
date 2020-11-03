import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getRepoTreeAsync,
  getJobLogAsync,
  selectToken,
  selectRepos,
  selectRepoTree,
  selectJobLog,
} from "./userSlice";

function repoOptionsGenerator(aScene, repos) {
  let zOffset = -2;
  let position = { x: 0, y: 0, z: 0 };
  let rotation = { x: -70, y: 0, z: 0 };
  let numBoxInRow = 6;
  let counter = 0;
  repos.repositories.map((item, index) => {
    if (!item.active) return;
    if (counter > numBoxInRow) {
      counter = 0;
      numBoxInRow += 1;
      zOffset -= 0.5;
    }
    position.x = counter - numBoxInRow / 2;
    position.y = 0.3;
    position.z =
      Math.sin(Math.abs(position.x / numBoxInRow) * Math.PI) + zOffset;
    rotation.y = position.x * -5;
    counter += 1;
    let texto = item.name.substring(0, 15);
    texto = texto == item.name ? texto : texto + "...";
    if (texto.length > 8)
      texto = texto.substring(0, 8) + "\n " + texto.substring(9, texto.length);
    elementGenerator(aScene, "opcionRepo", position, rotation, texto, item.id);
  });
}

function buildOptionsGenerator(aScene, repoTree) {
  let els = aScene.querySelectorAll(".opcionBuild");
  for (var i = els.length - 1; i >= 0; i--) {
    let element = els[i];
    element.parentNode.removeChild(element);
  }
  let position = { x: -1.5, y: 0.5, z: -2.2 };
  let rotation = { x: 0, y: 15, z: 0 };

  repoTree.builds &&
    repoTree.builds.map((item, index) => {
      /*id;
    state;
    branch.name;
    commit.message;
    created_by.login;*/
      let texto1 = item.state;
      let texto2 = item.started_at;
      elementGenerator(
        aScene,
        "opcionBuild",
        position,
        rotation,
        texto1,
        item.id,
        texto2
      );
      position.y += 0.21;
    });
  if (repoTree.builds) {
    if (!AFRAME.components["cursor-listener2"]) {
      AFRAME.registerComponent("cursor-listener2", {
        init: function () {
          this.el.addEventListener("click", (e) => {
            let id_artefacto = this.el.getAttribute("id_artefacto");
            if (id_artefacto == "pin") {
              if (repoTree) {
                let id_build = this.el.getAttribute("id_build");
                let obj = repoTree.builds.find((item) => {
                  return item.id == id_build;
                });
                if (obj) {
                  let counter = 1;
                  obj.jobs.map((item) => {
                    let entityText = document.createElement("a-entity");
                    entityText.setAttribute(
                      "text",
                      "align:left;width:1;value:" + JSON.stringify(item.config)
                    );
                    entityText.setAttribute(
                      "position",
                      "1 " + counter.toString() + " -1"
                    );
                    counter += 0.21;
                    entityText.setAttribute(
                      "geometry",
                      "primitive: plane; height: 0.2; width: 1"
                    );
                    entityText.setAttribute("material", "color: blue");
                    entityText.setAttribute("rotation", "0 -20 0");
                    entityText.setAttribute("class", "buildMatrix");
                    entityText.setAttribute("id_job", item.id);
                    entityText.setAttribute("id_artefacto", "panelJob");
                    entityText.setAttribute("cursor-listener", false);
                    aScene.appendChild(entityText);
                  });
                }
              }
            }
          });
          this.el.addEventListener("mouseenter", (e) => {
            let id_artefacto = this.el.getAttribute("id_artefacto");
            if (id_artefacto == "pin") {
              let els = aScene.querySelectorAll(".buildMatrix");
              for (var i = els.length - 1; i >= 0; i--) {
                let element = els[i];
                element.parentNode.removeChild(element);
              }
              els = aScene.querySelectorAll(".pin");
              for (var i = 0; i < els.length; i++) {
                let element = els[i];
                element.setAttribute("rotation", "0 0 90");
                element.removeAttribute("animation");
              }
              this.el.setAttribute(
                "animation",
                "property: rotation; from: 0 0 90; to: 0 0 45; dur: 500; autoplay: true"
              );
            }
          });
        },
      });
    }
  }
}
function elementGenerator(
  aScene,
  tipoObjeto,
  position = null,
  rotation = null,
  text = "(empty)",
  item_id = null,
  fecha = null
) {
  if (tipoObjeto == "opcionRepo") {
    let entityEl = document.createElement("a-entity");
    let texto = "align: center; value:" + text + "; color:#FFF; width: 3;";
    position && entityEl.setAttribute("position", position);
    rotation && entityEl.setAttribute("rotation", rotation);
    entityEl.setAttribute("id_artefacto", tipoObjeto);
    item_id && entityEl.setAttribute("id_repo", item_id);
    entityEl.setAttribute("cursor-listener", false);
    entityEl.setAttribute(
      "geometry",
      "primitive: plane; width: 0.9; height: 0.3"
    );
    entityEl.setAttribute("material", "color: #000; side:double");
    entityEl.setAttribute("text", texto);
    aScene.appendChild(entityEl);
  } else if (tipoObjeto == "opcionBuild") {
    let color = text == "passed" ? "green" : text == "failed" ? "red" : "gray";
    let entityBox = document.createElement("a-box");
    position && entityBox.setAttribute("position", position);
    rotation && entityBox.setAttribute("rotation", rotation);
    entityBox.setAttribute("width", "2");
    entityBox.setAttribute("class", "opcionBuild");
    entityBox.setAttribute("height", "0.2");
    entityBox.setAttribute("depth", "2");
    entityBox.setAttribute("material", "color: " + color + "; opacity: 0.8");
    entityBox.setAttribute("cursor-listener", false);
    let entityTitle = document.createElement("a-text");
    entityTitle.setAttribute("value", text);
    entityTitle.setAttribute("position", "-1 0 1");
    entityTitle.setAttribute("rotation", "0 0 0");
    entityTitle.setAttribute("width", "3");
    entityTitle.setAttribute("align", "left");
    let entityDate = document.createElement("a-text");
    entityDate.setAttribute("value", fecha);
    entityDate.setAttribute("position", "0 0 1");
    entityDate.setAttribute("rotation", "0 0 0");
    entityDate.setAttribute("width", "2");
    entityDate.setAttribute("align", "left");
    let entityPin = document.createElement("a-image");
    entityPin.setAttribute("material", "alphaTest: 0.5");
    entityPin.setAttribute("position", "-0.2 0.05 1.01");
    entityPin.setAttribute("rotation", "0 0 90");
    entityPin.setAttribute("scale", "0.2 0.2 0");
    entityPin.setAttribute("src", "#pin");
    entityPin.setAttribute("id_artefacto", "pin");
    entityPin.setAttribute("id_build", item_id);
    entityPin.setAttribute("class", "pin");
    entityPin.setAttribute("cursor-listener2", false);
    entityBox.appendChild(entityTitle);
    entityBox.appendChild(entityPin);
    entityBox.appendChild(entityDate);
    aScene.appendChild(entityBox);
  }
}

function TravisClientVR() {
  const [reposRendered, setReposRendered] = useState(false);
  const token = useSelector(selectToken);
  const repos = useSelector(selectRepos);
  const jobLog = useSelector(selectJobLog);
  const repoTree = useSelector(selectRepoTree);
  const dispatch = useDispatch();

  jobLog && alert(JSON.stringify(jobLog));

  useEffect(() => {
    const aScene = document.querySelector("a-scene");
    repoTree && buildOptionsGenerator(aScene, repoTree);
    if (!reposRendered) {
      repos && repoOptionsGenerator(aScene, repos);
      setReposRendered(true);
      if (!AFRAME.components["cursor-listener"]) {
        AFRAME.registerComponent("cursor-listener", {
          init: function () {
            this.el.addEventListener("click", (e) => {
              let id_artefacto = this.el.getAttribute("id_artefacto");
              if (id_artefacto == "opcionRepo") {
                let id_repo = this.el.getAttribute("id_repo");
                dispatch(getRepoTreeAsync(token, id_repo));
              } else if (id_artefacto == "panelJob") {
                let id_job = this.el.getAttribute("id_job");
                dispatch(getJobLogAsync(token, id_job));
              }
            });
            this.el.addEventListener("mouseenter", (e) => {
              let id_artefacto = this.el.getAttribute("id_artefacto");
              if (id_artefacto == "opcionRepo") {
                this.el.setAttribute(
                  "animation",
                  "property: material.color; from: #000; to: #FFF; dur: 500; autoplay: true"
                );
              } else if (id_artefacto == "pin") {
                /*
                if (repoTree) {
                  let id_build = this.el.getAttribute("id_build");
                  let obj = repoTree.builds.find((item) => {
                    return item.id === id_build;
                  });
                  console.log(obj);
                }
                let els = aScene.querySelectorAll(".pin");
                for (var i = 0; i < els.length; i++) {
                  let element = els[i];
                  element.setAttribute("rotation", "0 0 90");
                  element.removeAttribute("animation");
                }
                this.el.setAttribute(
                  "animation",
                  "property: rotation; from: 0 0 90; to: 0 0 45; dur: 500; autoplay: true"
                );
                */
              }
            });
            this.el.addEventListener("mouseleave", (e) => {
              let id_artefacto = this.el.getAttribute("id_artefacto");
              if (id_artefacto == "opcionRepo") {
                this.el.removeAttribute("animation");
                this.el.setAttribute("material", "color: #000");
              } else if (id_artefacto == "pin") {
              }
            });
            this.el.addEventListener("fusing", (e) => {
              let id_artefacto = this.el.getAttribute("id_artefacto");
              if (id_artefacto == "opcionRepo") {
              }
            });
          },
        });
      }
    }
    return () => {};
  });

  return (
    <a-scene>
      <a-assets>
        <img id="pin" src="/dist/pin-icon.png" />
        <img id="piso" src="/dist/piso.jpg" />
      </a-assets>
      <a-camera>
        <a-entity
          cursor="fuse: true; fuseTimeout: 1000"
          position="0 0 -1"
          geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.02"
          material="color: yellow; shader: flat"
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
      <a-sky color="#ECECEC"></a-sky>
    </a-scene>
  );
}

export default TravisClientVR;
/*
<a-assets>
        <a-asset-item
          id="plant-obj"
          src="/dist/plant/Low-Poly Plant_.obj"
        ></a-asset-item>
        <a-asset-item
          id="plant-mtl"
          src="/dist/plant/Low-Poly Plant_.mtl"
        ></a-asset-item>
      </a-assets>
<a-entity
  position="-2 0 0"
  obj-model="obj: #plant-obj; mtl: #plant-mtl"
></a-entity>
*/
