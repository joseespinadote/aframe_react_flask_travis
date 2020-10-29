import React, { useState, useEffect, Fragment } from "react";
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
import { AFrameRenderer, Marker } from "react-web-ar";

function TravisClientAR() {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const repos = useSelector(selectRepos);
  const builds = useSelector(selectBuilds);
  const buildJobs = useSelector(selectBuildJobs);
  const job = useSelector(selectJob);
  const jobLog = useSelector(selectJobLog);
  const dispatch = useDispatch();
  var posRepox = -1.4;
  var posRepoy = 0;
  var posRepoz = -1;
  // var posBuildx = -3;
  // var posBuildy = 0.7;
  // var posBuildz = 1;
  if (!AFRAME.components["cursor-listener"]) {
    AFRAME.registerComponent("cursor-listener", {
      init: function () {
        this.el.addEventListener("click", (e) => {
          let id_artefacto = this.el.getAttribute("id_artefacto");
          if (id_artefacto == "user_avatar") {
            dispatch(getReposAsync(token));
          } else if (id_artefacto == "user_repo") {
            dispatch(getBuildsAsync(token, this.el.getAttribute("repo_id")));
          }
        });
        this.el.addEventListener("mouseenter", (e) => {
          let id_artefacto = this.el.getAttribute("id_artefacto");
          if (id_artefacto == "user_avatar") {
            this.el.setAttribute("material", "color: #ADD8E6");
          } else if (id_artefacto == "user_repo") {
            this.el.setAttribute("material", "color: green; opacity:0.3");
          }
        });
        this.el.addEventListener("mouseleave", (e) => {
          let id_artefacto = this.el.getAttribute("id_artefacto");
          if (id_artefacto == "user_avatar") {
            this.el.setAttribute("material", "color: white");
          } else if (id_artefacto == "user_repo") {
            this.el.setAttribute("material", "color: blue; opacity:0.3");
          }
        });
      },
    });
  }

  useEffect(() => {});

  if (builds) {
    alert(JSON.stringify(builds, null, 2));
  }

  if (repos) {
    return (
      <div>
        <AFrameRenderer
          arToolKit={{ sourceType: "webcam", debugUIEnabled: false }}
        >
          <a-entity
            position="0 0 -3"
            geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03;"
            material="color: cyan; shader: flat"
            cursor="maxDistance: 30; fuse: true"
          >
            <a-animation
              begin="click"
              easing="ease-in"
              attribute="scale"
              fill="forwards"
              from="0.2 0.2 0.2"
              to="1 1 1"
              dur="150"
            ></a-animation>
            <a-animation
              begin="fusing"
              easing="ease-in"
              attribute="scale"
              fill="backwards"
              from="1 1 1"
              to="0.2 0.2 0.2"
              dur="1500"
            ></a-animation>
          </a-entity>
          <Marker parameters={{ preset: "hiro" }}>
            {repos &&
              repos.repositories.map((item) => {
                posRepox += 0.4;
                if (posRepox > 1) {
                  posRepox = -1;
                  posRepoz += 0.4;
                }
                return (
                  <a-entity
                    cursor-listener
                    id_artefacto="user_repo"
                    repo_id={item.id}
                    position={posRepox + " " + posRepoy + " " + posRepoz}
                    rotation="-90 0 0"
                    geometry="primitive: plane; width: 0.3; height: 0.1;"
                    material="color: blue; opacity:0.3"
                    text={
                      "color: yellow; align: center; value: " +
                      item.name +
                      ";width: 0.7;zOffset: 0.1"
                    }
                  ></a-entity>
                );
              })}
          </Marker>
        </AFrameRenderer>
      </div>
    );
  }

  return (
    <div>
      <AFrameRenderer
        arToolKit={{ sourceType: "webcam", debugUIEnabled: false }}
      >
        <a-entity
          position="0 0 -3"
          geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03;"
          material="color: cyan; shader: flat"
          cursor="maxDistance: 30; fuse: true"
        >
          <a-animation
            begin="click"
            easing="ease-in"
            attribute="scale"
            fill="forwards"
            from="0.2 0.2 0.2"
            to="1 1 1"
            dur="150"
          ></a-animation>
          <a-animation
            begin="fusing"
            easing="ease-in"
            attribute="scale"
            fill="backwards"
            from="1 1 1"
            to="0.2 0.2 0.2"
            dur="1500"
          ></a-animation>
        </a-entity>
        <Marker parameters={{ preset: "hiro" }}>
          {user ? (
            <a-image
              id_artefacto="user_avatar"
              rotation="-90 0 0"
              cursor-listener
              src={user.avatar_url}
            ></a-image>
          ) : (
            <a-entity
              rotation="-90 0 0"
              geometry="primitive: plane; width: 1; height: 1"
              material="color: #000080; opacity: 0.2"
              text="color: #FFFF00; align: center; value: No user; width: 2.5;"
            ></a-entity>
          )}
        </Marker>
      </AFrameRenderer>
    </div>
  );
}

export default TravisClientAR;

/*
      
{buildJobs && (
  <span>.</span>
)}
{user && (<span>.</span>)}
{repos &&
  repos.repositories.map((item) => {
    posRepoy += 0.3;
    if (posRepoy > 2) {
      posRepoy = 1;
      posRepoz += 2;
    }
    return (<span>.</span>);
  })}
{builds &&
  builds.builds.map((item) => {
    posBuildy += 0.3;
    if (posBuildy > 2) {
      posBuildy = 1;
      posBuildz += 2;
    }
    return (<span>.</span>);
  })}
*/
