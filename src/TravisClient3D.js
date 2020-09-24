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
  var posRepox = 3;
  var posRepoy = 0.7;
  var posRepoz = 1;
  var posBuildx = -3;
  var posBuildy = 0.7;
  var posBuildz = 1;
  if (!AFRAME.components["cursor-repo-listener"]) {
    AFRAME.registerComponent("cursor-repo-listener", {
      init: function () {
        this.el.addEventListener("click", (e) => {
          dispatch(getBuildsAsync(token, this.el.getAttribute("repo_id")));
        });
        this.el.addEventListener("mouseenter", (e) => {
          this.el.setAttribute("scale", "1.3 1.3 1");
        });
        this.el.addEventListener("mouseleave", (e) => {
          this.el.setAttribute("scale", "1 1 1");
        });
      },
    });
  }
  if (!AFRAME.components["cursor-build-listener"]) {
    AFRAME.registerComponent("cursor-build-listener", {
      init: function () {
        this.el.addEventListener("click", (e) => {
          dispatch(getBuildJobsAsync(token, this.el.getAttribute("build_id")));
        });
        this.el.addEventListener("mouseenter", (e) => {
          this.el.setAttribute("scale", "1.3 1.3 1");
        });
        this.el.addEventListener("mouseleave", (e) => {
          this.el.setAttribute("scale", "1 1 1");
        });
      },
    });
  }
  useEffect(() => {
    let inputTravisToken = document.querySelector("#inTravisToken");
    let btnOkToken = document.querySelector("#btnOkToken");
    let keyboard = document.querySelector("#keyboard");

    keyboard.addEventListener("didopen", (e) => {
      keyboard.setAttribute("position", "-0.5 1 -2");
      inputTravisToken.value = token;
    });
    btnOkToken.addEventListener("click", () => {
      dispatch(setUserAsync(token));
      dispatch(getReposAsync(token));
    });
  });

  /*var source = new EventSource("/stream");
  source.onmessage = function (event) {
    console.log(event.data);
  };*/

  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        {buildJobs && (
          <div
            id="htmlElement"
            style={{
              background: "#F8F8F8",
              color: "#333",
              fontSize: "50px",
            }}
          >
            <table>
              <thead>
                <tr>
                  <th>os</th>
                  <th>compiler</th>
                  <th>languaje</th>
                  <th>dist</th>
                  <th>env</th>
                </tr>
              </thead>
              <tbody>
                {buildJobs.jobs.map((item) => {
                  return (
                    <tr>
                      <td>{item.config.os}</td>
                      <td>{item.config.compiler}</td>
                      <td>{item.config.language}</td>
                      <td>{item.config.dist}</td>
                      <td>{item.config.env}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <a-scene>
        {buildJobs && (
          <a-entity
            geometry="primitive: plane ;height:3; width:3.8"
            material="shader: html; target: #htmlElement"
            position="0 2 7"
            rotation="0 180 0"
          ></a-entity>
        )}
        <a-entity environment="preset: forest"></a-entity>
        <a-entity laser-controls="hand: right"></a-entity>
        <a-camera
          look-controls-enabled
          wasd-controls-enabled
          mouse-cursor
        ></a-camera>
        <a-keyboard id="keyboard"></a-keyboard>
        <a-input
          id="inTravisToken"
          position="0 2 -2"
          placeholder="travis token here!"
          color="black"
          width="1"
          type="text"
          name="token"
          value=""
        ></a-input>
        <a-button id="btnOkToken" position="1 2 -2" value="Ok"></a-button>
        {user && (
          <Fragment>
            <a-entity
              position="1 2.5 -2"
              rotation="10 0 0"
              geometry="primitive: plane; width: auto; height: auto"
              material="color: #000080; opacity: 0.2"
              text={
                "color: #FFFF00; align: left; value: user: " +
                user.name +
                "\nmail: " +
                user.email +
                "\nlogin: " +
                user.login +
                "; width: 2.5;wrap-count: 30"
              }
            ></a-entity>
            <a-image
              position="-1 2.5 -2"
              rotation="10 10 0"
              src={user.avatar_url}
            ></a-image>
          </Fragment>
        )}
        {repos &&
          repos.repositories.map((item) => {
            posRepoy += 0.3;
            if (posRepoy > 2) {
              posRepoy = 1;
              posRepoz += 2;
            }
            return (
              <Fragment key={item.id}>
                <a-entity
                  cursor-repo-listener
                  repo_id={item.id}
                  position={posRepox + " " + posRepoy + " " + posRepoz}
                  rotation="0 -90 0"
                  geometry="primitive: plane; width: auto; height: auto"
                  material="color: #000080; opacity: 0.2"
                  text={
                    "color: #FFFF00; align: left; value: name: " +
                    item.name +
                    "\nslug: " +
                    item.slug +
                    "\ndescription: " +
                    item.description +
                    "; width: 1.8;wrap-count: 60"
                  }
                ></a-entity>
              </Fragment>
            );
          })}
        {builds &&
          builds.builds.map((item) => {
            posBuildy += 0.3;
            if (posBuildy > 2) {
              posBuildy = 1;
              posBuildz += 2;
            }
            return (
              <Fragment key={item.id}>
                <a-entity
                  cursor-build-listener
                  build_id={item.id}
                  position={posBuildx + " " + posBuildy + " " + posBuildz}
                  rotation="0 90 0"
                  geometry="primitive: plane; width: auto; height: auto"
                  material="color: #000080; opacity: 0.2"
                  text={
                    "color: #FFFF00; align: left; value: number: " +
                    item.number +
                    "\nstate: " +
                    item.state +
                    "\nduration: " +
                    item.event_type +
                    "\nbranch name: " +
                    item.branch.name +
                    "; width: 1.8;wrap-count: 60"
                  }
                ></a-entity>
              </Fragment>
            );
          })}
      </a-scene>
    </div>
  );
}

export default TravisClient3D;
