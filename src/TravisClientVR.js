import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setToken,
  setUserAsync,
  getReposAsync,
  getBuildsAsync,
  selectToken,
  selectUser,
  selectRepos,
  selectRepoTree,
} from "./userSlice";

function aBox() {
  return (
    <a-box
      cursor-listener
      id_artefacto="caja"
      position="-1 0.5 -3"
      rotation="0 45 0"
      color="black"
    ></a-box>
  );
}

function sceneGenerator(repoTree, AFRAME) {
  if (!AFRAME.components["cursor-listener"]) {
    AFRAME.registerComponent("cursor-listener", {
      init: function () {
        this.el.addEventListener("click", (e) => {
          let id_artefacto = this.el.getAttribute("id_artefacto");
          if (id_artefacto == "caja") {
          }
        });
        this.el.addEventListener("mouseenter", (e) => {
          let id_artefacto = this.el.getAttribute("id_artefacto");
          if (id_artefacto == "caja") {
            this.el.setAttribute(
              "animation",
              "property: material.color; from: #000; to: #FFF; dur: 500; autoplay: true"
            );
          }
        });
        this.el.addEventListener("mouseleave", (e) => {
          let id_artefacto = this.el.getAttribute("id_artefacto");
          if (id_artefacto == "caja") {
            this.el.removeAttribute("animation");
            this.el.setAttribute("material", "color: black");
          }
        });
        this.el.addEventListener("fusing", (e) => {
          let id_artefacto = this.el.getAttribute("id_artefacto");
          if (id_artefacto == "caja") {
          }
        });
      },
    });
  }
  console.log(repoTree);
  return [aBox];
}

function TravisClientVR() {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const repos = useSelector(selectRepos);
  const repoTree = useSelector(selectRepoTree);
  const dispatch = useDispatch();
  let actors = repoTree && sceneGenerator(repoTree, AFRAME);

  useEffect(() => {
    return () => {};
  });

  return (
    <div>
      <a-scene>
        <a-camera>
          <a-entity
            cursor="fuse: true; fuseTimeout: 1000"
            position="0 0 -1"
            geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.02"
            material="color: yellow; shader: flat"
          ></a-entity>
        </a-camera>
        {actors &&
          actors.map((Item, index) => {
            return <Item key={index} />;
          })}
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
    </div>
  );
}

export default TravisClientVR;

/*
<a-box
  cursor-listener
  id_artefacto="caja"
  position="-1 0.5 -3"
  rotation="0 45 0"
  color="black"
></a-box>
*/
