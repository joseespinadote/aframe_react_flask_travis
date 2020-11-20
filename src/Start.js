import React, { useState } from "react";
import TravisClientVR from "./TravisClientVR";
import { useSelector, useDispatch } from "react-redux";
import {
  setToken,
  setUserAsync,
  getReposAsync,
  getExternalReposAsync,
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

function TheirRepo(props) {
  const [externalProject, setExternalProject] = useState("github/rails");
  const loading = useSelector(selectLoading);
  const repos = useSelector(selectRepos);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  return (
    <div className="column is-offset-1 is-10">
      <p className="title is-2">Use vrengi with other people's repositories</p>
      <div className="block">
        You can try this prototipe with a user, and his/her provider, assuming
        that he/she is currently using Travis (.org)
        <br />
        The format is "provider"/"username", for example: "github/rails"
      </div>
      <div className="field has-addons">
        <div className={loading ? "control is-loading" : "control"}>
          <input
            size="24"
            value={externalProject}
            onChange={(e) => {
              setExternalProject(e.target.value);
            }}
            className="input"
            type="text"
            placeholder="provider/user"
          />
        </div>
        <div className="control">
          <button
            className="button is-link"
            onClick={(e) => {
              dispatch(getExternalReposAsync(token, externalProject));
            }}
          >
            Get data
          </button>
        </div>
      </div>
      {repos && (
        <div>
          {repos.repositories ? (
            <div>
              {repos.repositories.filter((item) => item.active).length > 0 ? (
                <div>
                  <div className="block">
                    Super! this user has{" "}
                    {repos.repositories.filter((item) => item.active).length}{" "}
                    repositories active on Travis (.org)
                  </div>
                  <button
                    className="button is-primary"
                    onClick={(e) => {
                      props.setOpcion("VR");
                    }}
                  >
                    So, let me in!
                  </button>
                </div>
              ) : (
                <div className="notification is-warning">
                  The user has repositories, but no one them are activated in
                  Travis (.org)
                </div>
              )}
            </div>
          ) : (
            <div className="notification is-warning">
              Invalid "provider/user"... sorry
            </div>
          )}
        </div>
      )}
      <hr />
      <button
        className="button is-ghost"
        onClick={(e) => {
          dispatch(clearAll());
          props.setOpcion("");
        }}
      >
        Go back
      </button>
    </div>
  );
}

function OwnRepo(props) {
  const [currentToken, setCurrentToken] = useState("");
  const loading = useSelector(selectLoading);
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const repos = useSelector(selectRepos);
  const dispatch = useDispatch();
  if (repos) props.setOpcion("VR");
  return (
    <div className="column is-offset-1 is-10">
      <p className="title is-2">Use vrengi with your own repositories</p>
      <div className="block">
        You can try this prototipe with your Travis (.org) API key.{" "}
        <a href="https://travis-ci.org/account/preferences" target="_blank">
          You can copy the token here
        </a>
      </div>
      <div className="field has-addons">
        <div className={loading ? "control is-loading" : "control"}>
          <input
            size="24"
            value={currentToken}
            onChange={(e) => {
              if (user) dispatch(clearAll());
              setCurrentToken(e.target.value);
            }}
            onBlur={(e) => {
              dispatch(setToken(currentToken));
            }}
            className="input"
            type="text"
            placeholder="Paste your Travis token here"
          />
        </div>
        <div className="control">
          <button
            className="button is-link"
            onClick={(e) => {
              dispatch(setUserAsync(token));
            }}
          >
            Get data
          </button>
        </div>
      </div>
      {user && (
        <div>
          {" "}
          {user.id ? (
            <div>
              <p className="title is-3">Is this you?</p>
              <table className="table">
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
                className="button is-primary"
                onClick={(e) => {
                  dispatch(getReposAsync(token));
                }}
              >
                Yes! let me in
              </button>
            </div>
          ) : (
            <div className="notification is-warning">
              Invalid token. Check if your token is TravisCI &rarr; .org &larr;
            </div>
          )}
        </div>
      )}
      <hr />
      <button
        className="button is-ghost"
        onClick={(e) => {
          dispatch(clearAll());
          props.setOpcion("");
        }}
      >
        Go back
      </button>
    </div>
  );
}

function Landing(props) {
  const dispatch = useDispatch();
  return (
    <div>
      <div className="columns">
        <div className="column is-offset-1 is-10">
          <h1 className="title">vrengi</h1>
          <p className="subtitle">(virtual reality + engineering)</p>
          <strong>What is this?</strong>
          <div className="block">
            This is a very first artifact for a study about the use of virtual
            reality in software engineering. This work is part of a master's
            degree thesis (and I really need your feedback!)
          </div>
          <strong>What does this site do?</strong>
          <div className="block">
            In a few words, you can enjoy your TravisCI (.org) infromation in a
            3D (three dimensions) enviroment in your browser (for a best
            experience, use a tablet)
          </div>
          <strong>OK cool... but, why?</strong>
          <div className="block">
            I'm not sure. That's why I'm doing some experiments ;) Also, that's
            why your feedback will be highly appreciated. My mail is
            joseguillermoespina at gmail
          </div>
          <p className="title is-2">Do you want to try?</p>
          <p className="subtitle is-4">We have have 2 flavors for you</p>
          <div className="field">
            <div className="control">
              <button
                className="button is-primary"
                onClick={(e) => {
                  props.setOpcion("ownRepo");
                }}
              >
                use your own repositories with your Travis (.org) API key
              </button>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-link"
                onClick={(e) => {
                  dispatch(setToken("EDA3W8-FZmyIpOO0PutuCQ"));
                  props.setOpcion("theirRepo");
                }}
              >
                use other people's repositories with they provider and user name
                (without any key)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Start() {
  const [opcion, setOpcion] = useState("");
  if (opcion == "") return <Landing setOpcion={setOpcion} />;
  if (opcion == "ownRepo") return <OwnRepo setOpcion={setOpcion} />;
  if (opcion == "theirRepo") return <TheirRepo setOpcion={setOpcion} />;
  if (opcion == "VR") return <TravisClientVR />;

  return (
    <div>
      <ul>
        <li></li>
      </ul>
      <button
        onClick={(e) => {
          setOpcion("txt");
        }}
      >
        text
      </button>
      <button
        onClick={(e) => {
          setOpcion("VR");
        }}
      >
        VR
      </button>
      <button
        onClick={(e) => {
          setOpcion("AR");
        }}
      >
        AR
      </button>
      {opcion == "txt" && <TravisClient />}
    </div>
  );
}

export default Start;
