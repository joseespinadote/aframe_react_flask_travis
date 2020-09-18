import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: "EDA3W8-FZmyIpOO0PutuCQ",
    user: null,
    repos: null,
    builds: null,
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
  },
});

export const { setToken } = userSlice.actions;
const { setUser, getRepos, getBuilds } = userSlice.actions;

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

export const selectToken = (state) => state.user.token;
export const selectUser = (state) => state.user.user;
export const selectRepos = (state) => state.user.repos;
export const selectBuilds = (state) => state.user.builds;

export default userSlice.reducer;
