import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: "EDA3W8-FZmyIpOO0PutuCQ",
    user: null,
    repos: null,
    builds: null,
    buildJobs: null,
    job: null,
    jobLog: null,
    repoTree: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    getRepos: (state, action) => {
      state.repos = action.payload;
    },
    getBuilds: (state, action) => {
      state.builds = action.payload;
    },
    getBuildJobs: (state, action) => {
      state.buildJobs = action.payload;
    },
    getJob: (state, action) => {
      state.job = action.payload;
    },
    getJobLog: (state, action) => {
      state.jobLog = action.payload;
    },
    getRepoTree: (state, action) => {
      state.repoTree = action.payload;
    },
    clearAll: (state, action) => {
      state.builds = null;
      state.buildJobs = null;
      state.job = null;
      state.jobLog = null;
      state.repoTree = null;
    },
  },
});

export const { setToken, clearAll } = userSlice.actions;
const {
  setUser,
  getRepos,
  getBuilds,
  getBuildJobs,
  getJob,
  getJobLog,
  getRepoTree,
} = userSlice.actions;

export const setUserAsync = (token) => (dispatch) => {
  axios
    .get("/user", {
      params: {
        token: token,
      },
    })
    .then((res) => {
      dispatch(setUser(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getReposAsync = (token) => (dispatch) => {
  axios
    .get("/repos", {
      params: {
        token: token,
      },
    })
    .then((res) => {
      dispatch(getRepos(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getExternalReposAsync = (token, externalProject) => (dispatch) => {
  axios
    .get("/extRepos", {
      params: {
        token: token,
        provider_login: externalProject,
      },
    })
    .then((res) => {
      dispatch(getRepos(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getBuildsAsync = (token, repo_id) => (dispatch) => {
  axios
    .get("/builds", {
      params: {
        token: token,
        repo_id: repo_id,
      },
    })
    .then((res) => {
      dispatch(getBuilds(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getLogAsync = (token, build_id) => (dispatch) => {
  axios
    .get("/build_log", {
      params: {
        token: token,
        build_id: build_id,
      },
    })
    .then((res) => {
      dispatch(getLog(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getBuildJobsAsync = (token, build_id) => (dispatch) => {
  axios
    .get("/buildJobs", {
      params: {
        token: token,
        build_id: build_id,
      },
    })
    .then((res) => {
      dispatch(getBuildJobs(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getJobAsync = (token, job_id) => (dispatch) => {
  axios
    .get("/job", {
      params: {
        token: token,
        job_id: job_id,
      },
    })
    .then((res) => {
      dispatch(getJob(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getJobLogAsync = (token, job_id) => (dispatch) => {
  axios
    .get("/jobLog", {
      params: {
        token: token,
        job_id: job_id,
      },
    })
    .then((res) => {
      dispatch(getJobLog(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getRepoTreeAsync = (token, repo_id) => (dispatch) => {
  axios
    .get("/repoTree", {
      params: {
        token: token,
        repo_id: repo_id,
      },
    })
    .then((res) => {
      dispatch(getRepoTree(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const selectToken = (state) => state.user.token;
export const selectUser = (state) => state.user.user;
export const selectRepos = (state) => state.user.repos;
export const selectBuilds = (state) => state.user.builds;
export const selectBuildJobs = (state) => state.user.buildJobs;
export const selectJob = (state) => state.user.job;
export const selectJobLog = (state) => state.user.jobLog;
export const selectRepoTree = (state) => state.user.repoTree;

export default userSlice.reducer;
