import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setToken,
  setUserAsync,
  getReposAsync,
  getBuildsAsync,
  selectToken,
  selectUser,
  selectRepos,
  selectBuilds,
} from "./userSlice";
import "./TravisClient.css";

function TravisClient() {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const repos = useSelector(selectRepos);
  const builds = useSelector(selectBuilds);
  const dispatch = useDispatch();
  return (
    <div>
      <input
        value={token ? token : ""}
        onChange={(e) => {
          dispatch(setToken(e.target.value));
        }}
      />
      <button
        onClick={(e) => {
          dispatch(setUserAsync(token));
        }}
      >
        ok
      </button>
      {user && (
        <div>
          <table>
            <tbody>
              <tr>
                <td>avatar</td>
                <td>
                  <img width="10%" src={user.avatar_url} />
                </td>
              </tr>
              <tr>
                <td>login</td>
                <td>{user.login}</td>
              </tr>
              <tr>
                <td>name</td>
                <td>{user.name}</td>
              </tr>
              <tr>
                <td>email</td>
                <td>{user.email}</td>
              </tr>
            </tbody>
          </table>
          <button
            onClick={(e) => {
              dispatch(getReposAsync(token));
            }}
          >
            ver repositorios
          </button>
        </div>
      )}
      {builds && <div>{JSON.stringify(builds, null, 2)}</div>}
      {repos && (
        <div>
          <table>
            <thead>
              <tr>
                <th>name</th>
                <th>slug</th>
                <th>description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {repos.repositories.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.slug}</td>
                    <td>{item.description}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          dispatch(getBuildsAsync(token, item.id));
                        }}
                      >
                        ver builds
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TravisClient;

/*
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
*/
