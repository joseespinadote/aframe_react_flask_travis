import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    token: "",
    user: null,
    repos: null,
    builds: null,
    selectedBuild: null,
    buildJobs: null,
    job: null,
    jobLog: null,
    repoTree: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
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
    setSelectedBuild: (state, action) => {
      state.selectedBuild = action.payload;
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
    clearAll: (state) => {
      state.loading = false;
      state.token = "";
      state.user = null;
      state.repos = null;
      state.builds = null;
      state.selectedBuild = null;
      state.buildJobs = null;
      state.job = null;
      state.jobLog = null;
      state.repoTree = null;
    },
  },
});

export const { setToken, clearAll } = userSlice.actions;
const {
  setLoading,
  setUser,
  getRepos,
  getBuilds,
  setSelectedBuild,
  getBuildJobs,
  getJob,
  getJobLog,
  getRepoTree,
} = userSlice.actions;

export const setUserAsync = (token) => (dispatch) => {
  dispatch(setLoading(true));
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
    })
    .finally(() => dispatch(setLoading(false)));
};

export const getReposAsync = (token) => (dispatch) => {
  dispatch(setLoading(true));
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
    })
    .finally(() => dispatch(setLoading(false)));
};
export const getExternalReposAsync = (token, externalProject) => (dispatch) => {
  dispatch(setLoading(true));
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
    })
    .finally(() => dispatch(setLoading(false)));
};
export const getBuildsAsync = (token, repo_id) => (dispatch) => {
  dispatch(setLoading(true));
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
    })
    .finally(() => dispatch(setLoading(false)));
};

export const getLogAsync = (token, build_id) => (dispatch) => {
  dispatch(setLoading(true));
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
    })
    .finally(() => dispatch(setLoading(false)));
};

export const getBuildJobsAsync = (token, build_id) => (dispatch) => {
  dispatch(setLoading(true));
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
    })
    .finally(() => dispatch(setLoading(false)));
};

export const getJobAsync = (token, job_id) => (dispatch) => {
  dispatch(setLoading(true));
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
    })
    .finally(() => dispatch(setLoading(false)));
};

export const getJobLogAsync = (token, job_id) => (dispatch) => {
  dispatch(setLoading(true));
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
    })
    .finally(() => dispatch(setLoading(false)));
};

export const getRepoTreeAsync = (token, repo_id) => (dispatch) => {
  dispatch(setLoading(true));
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
    })
    .finally(() => dispatch(setLoading(false)));
};

export const selectBuildById = (build_id) => (dispatch, getState) => {
  let obj = getState().user.repoTree.builds.find((item) => {
    return item.id == build_id;
  });
  obj ? dispatch(setSelectedBuild(obj)) : dispatch(setSelectedBuild(null));
};

export const selectLoading = (state) => state.user.loading;
export const selectToken = (state) => state.user.token;
export const selectUser = (state) => state.user.user;
export const selectRepos = (state) => state.user.repos;
export const selectBuilds = (state) => state.user.builds;
export const selectSelectedBuild = (state) => state.user.selectedBuild;
export const selectBuildJobs = (state) => state.user.buildJobs;
export const selectJob = (state) => state.user.job;
export const selectJobLog = (state) => state.user.jobLog;
export const selectRepoTree = (state) => state.user.repoTree;

export default userSlice.reducer;
