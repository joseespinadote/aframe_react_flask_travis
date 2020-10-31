import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getRepoTreeAsync,
  selectToken,
  selectRepos,
  selectRepoTree,
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
  let position = { x: -2, y: 1.5, z: -4.5 };
  let rotation = { x: 0, y: 0, z: 0 };
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
    position.x += 0.2;
  });
}
function elementGenerator(
  aScene,
  tipoObjeto,
  position = null,
  rotation = null,
  text = "(empty)",
  repo_id = null,
  fecha = null
) {
  if (tipoObjeto == "opcionRepo") {
    let entityEl = document.createElement("a-entity");
    let texto = "align: center; value:" + text + "; color:#FFF; width: 3;";
    position && entityEl.setAttribute("position", position);
    rotation && entityEl.setAttribute("rotation", rotation);
    entityEl.setAttribute("id_artefacto", tipoObjeto);
    repo_id && entityEl.setAttribute("id_repo", repo_id);
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
    entityBox.setAttribute("width", "0.2");
    entityBox.setAttribute("class", "opcionBuild");
    entityBox.setAttribute("height", "2");
    entityBox.setAttribute("depth", "5");
    entityBox.setAttribute("material", "color: " + color + "; opacity: 0.5");
    let entityTitle = document.createElement("a-text");
    entityTitle.setAttribute("value", text);
    entityTitle.setAttribute("position", "0 -0.75 2.5");
    entityTitle.setAttribute("rotation", "0 0 90");
    entityTitle.setAttribute("width", "3");
    entityTitle.setAttribute("align", "left");
    let entityDate = document.createElement("a-text");
    entityDate.setAttribute("value", fecha);
    entityDate.setAttribute("position", "0 0 2.5");
    entityDate.setAttribute("rotation", "0 0 90");
    entityDate.setAttribute("width", "2");
    entityDate.setAttribute("align", "left");
    entityBox.appendChild(entityTitle);
    entityBox.appendChild(entityDate);
    aScene.appendChild(entityBox);
    /*
    botón pa ver el log
    <a-entity position="0 1.1 2.5" rotation="0 0 90" geometry="primitive: plane; height: 0.2; width: 0.2" material="color:blue" text="align: center; width: 2; value: Log"></a-entity>
    */
  }
}

function TravisClientVR() {
  const [reposRendered, setReposRendered] = useState(false);
  const token = useSelector(selectToken);
  const repos = useSelector(selectRepos);
  const repoTree = useSelector(selectRepoTree);
  const dispatch = useDispatch();

  useEffect(() => {
    const aScene = document.querySelector("a-scene");
    repoTree && buildOptionsGenerator(aScene, repoTree);
    if (!reposRendered) {
      repos && repoOptionsGenerator(aScene, repos);
      if (!AFRAME.components["cursor-listener"]) {
        AFRAME.registerComponent("cursor-listener", {
          init: function () {
            this.el.addEventListener("click", (e) => {
              let id_artefacto = this.el.getAttribute("id_artefacto");
              let id_repo = this.el.getAttribute("id_repo");
              if (id_artefacto == "opcionRepo") {
                dispatch(getRepoTreeAsync(token, id_repo));
              }
            });
            this.el.addEventListener("mouseenter", (e) => {
              let id_artefacto = this.el.getAttribute("id_artefacto");
              if (id_artefacto == "opcionRepo") {
                this.el.setAttribute(
                  "animation",
                  "property: material.color; from: #000; to: #FFF; dur: 500; autoplay: true"
                );
              }
            });
            this.el.addEventListener("mouseleave", (e) => {
              let id_artefacto = this.el.getAttribute("id_artefacto");
              if (id_artefacto == "opcionRepo") {
                this.el.removeAttribute("animation");
                this.el.setAttribute("material", "color: #000");
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
      setReposRendered(true);
    }
    return () => {};
  });

  return (
    <a-scene>
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
        width="30"
        height="30"
        repeat="30 30"
        src="./dist/piso.jpg"
      ></a-plane>
      <a-sky color="#ECECEC"></a-sky>
    </a-scene>
  );
}

export default TravisClientVR;
