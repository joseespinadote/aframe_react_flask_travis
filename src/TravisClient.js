import React, { useState } from "react";
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
  selectRepos,
  selectBuilds,
  selectBuildJobs,
  selectJobLog,
  selectRepoTree,
} from "./userSlice";
import "./TravisClient.css";

function TravisClient() {
  const [externalProject, setExternalProject] = useState(
    "github/ObjectProfile"
  );
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const repos = useSelector(selectRepos);
  const builds = useSelector(selectBuilds);
  const buildJobs = useSelector(selectBuildJobs);
  const jobLog = useSelector(selectJobLog);
  const repoTree = useSelector(selectRepoTree);
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
          <h4>Choose repo source</h4>
          <table>
            <tbody>
              <tr>
                <td>
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
                      <tr>
                        <td colSpan="2">
                          <button
                            onClick={(e) => {
                              dispatch(getReposAsync(token));
                            }}
                          >
                            get user repos
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table>
                    <tbody>
                      <tr>
                        <td>provider/user</td>
                        <td>
                          <input
                            value={externalProject}
                            onChange={(e) => {
                              setExternalProject(e.target.value);
                            }}
                            placeholder="ex: github/user"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <button
                            onClick={(e) => {
                              dispatch(
                                getExternalReposAsync(token, externalProject)
                              );
                            }}
                          >
                            get provider/user repos
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {repos && (
        <div>
          <h4>repos</h4>
          <table>
            <thead>
              <tr>
                <th>name</th>
                <th>slug</th>
                <th>description</th>
                <th>active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {repos.repositories ? (
                repos.repositories.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.slug}</td>
                      <td>{item.description}</td>
                      <td>{item.active ? "active" : ""}</td>
                      <td>
                        {item.active && (
                          <div>
                            <button
                              onClick={(e) => {
                                dispatch(getBuildsAsync(token, item.id));
                              }}
                            >
                              load builds
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5">
                    <h3>No repos</h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {builds && (
        <div>
          <h4>builds</h4>
          <table>
            <thead>
              <tr>
                <th>number</th>
                <th>state</th>
                <th>duration</th>
                <th>event_type</th>
                <th>branch</th>
                <th>stages</th>
                <th>commit</th>
                <th>started_at</th>
                <th>finished_at</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {builds.builds ? (
                builds.builds.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.number}</td>
                      <td>{item.state}</td>
                      <td>{item.duration}</td>
                      <td>{item.event_type}</td>
                      <td>{item.branch.name}</td>
                      <td>{JSON.stringify(item.stages, null, 2)}</td>
                      <td>
                        {item.commit && (
                          <a href={item.commit.compare_url} target="_blank">
                            {item.commit.message}
                          </a>
                        )}
                      </td>
                      <td>{item.started_at}</td>
                      <td>{item.finished_at}</td>
                      <td>
                        <button
                          onClick={(e) => {
                            dispatch(getBuildJobsAsync(token, item.id));
                          }}
                        >
                          ver jobs
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9">
                    <strong>No builds</strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {buildJobs && (
        <div>
          <h4>jobs</h4>
          <table>
            <thead>
              <tr>
                <th>number</th>
                <th>state</th>
                <th>started_at</th>
                <th>finished_at</th>
                <th>owner</th>
                <th>created_at</th>
                <th>updated_at</th>
                <th>config</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {buildJobs.jobs ? (
                buildJobs.jobs.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.number}</td>
                      <td>{item.state}</td>
                      <td>{item.started_at}</td>
                      <td>{item.finished_at}</td>
                      <td>{item.owner && item.owner.login}</td>
                      <td>{item.created_at}</td>
                      <td>{item.updated_at}</td>
                      <td>
                        {item.config && (
                          <table>
                            <tbody>
                              <tr>
                                <td>os</td>
                                <td>{item.config.os}</td>
                              </tr>
                              <tr>
                                <td>compiler</td>
                                <td>{item.config.compiler}</td>
                              </tr>
                              <tr>
                                <td>languaje</td>
                                <td>{item.config.language}</td>
                              </tr>
                              <tr>
                                <td>dist</td>
                                <td>{item.config.dist}</td>
                              </tr>
                              <tr>
                                <td>env</td>
                                <td>{item.config.env}</td>
                              </tr>
                              <tr>
                                <td>group</td>
                                <td>{item.config.group}</td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            dispatch(getJobLogAsync(token, item.id));
                          }}
                        >
                          ver log
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8">
                    <strong>No jobs</strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {jobLog && (
        <div>
          <h4>job log</h4>
          {jobLog.content}
        </div>
      )}
      {repoTree && (
        <div>
          <h4>repo tree</h4>
          <table>
            <thead>
              <tr>
                <th>state</th>
                <th>event_type</th>
                <th>previous_state</th>
                <th>started_at</th>
                <th>branch</th>
                <th>commit</th>
                <th>jobs</th>
                <th>created_by</th>
              </tr>
            </thead>
            <tbody>
              {repoTree.builds ? (
                repoTree.builds.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.state}</td>
                      <td>{item.event_type}</td>
                      <td>{item.previous_state}</td>
                      <td>{item.started_at}</td>
                      <td>{item.branch && item.branch.name}</td>
                      <td>{item.commit && item.commit.message}</td>
                      <td>
                        {item.jobs.map((subitem) => {
                          return subitem.config ? (
                            <div key={subitem.id}>
                              <b>{subitem.id}</b>
                              <br />
                              config.os:"{subitem.config.os}"<br />
                              config.language:"{subitem.config.language}"<br />
                              config.dist:"{subitem.config.dist}"
                              <hr />
                            </div>
                          ) : (
                            "No config"
                          );
                        })}
                      </td>
                      <td>{item.created_by && item.created_by.login}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8">
                    <b>No builds</b>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TravisClient;
