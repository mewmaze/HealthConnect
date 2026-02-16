import React, { useReducer, useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import api from "./api/api";
import { AuthContextProvider } from "./hooks/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import customTheme from "./theme/theme";

import Layout from "./layout/Layout";
import MyPage from "./pages/mypage/MyPage";
import Edit from "./pages/profile/ProfileEdit";
import MyPost from "./pages/post/MyPost";
import Login from "./pages/login/Login";
import Signup from "./pages/sigup/Signup";
import Challenge from "./pages/challenge/Challenge";
import Home from "./pages/Home";
import ChallengeCreate from "./pages/challenge/ChallengeCreate";
import ChallengeDetail from "./pages/challenge/ChallengeDetail";
import ChallengeDiary from "./pages/challenge/ChallengeDiary";
import Exercise from "./pages/exercise/Exercise";
import ExerciseDiary from "./pages/exercise/ExerciseDiary";
import CommunityList from "./pages/community/CommunityList";
import Community from "./pages/community/Community";
import PostDetail from "./pages/post/PostDetail";
import NewPostPage from "./pages/post/NewPostPage";

export const ChallengeDispatchContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case "INIT_CHALLENGE":
      return action.data;
    case "CREATE_CHALLENGE":
      return [...state, action.data];
    case "UPDATE_CHALLENGE":
      return state.map((it) =>
        String(it.challenge_id) === String(action.data.challenge_id)
          ? { ...action.data }
          : it,
      );
    case "DELETE_CHALLENGE":
      return state.filter(
        (it) => String(it.challenge_id) !== String(action.id),
      );
    case "JOIN_CHALLENGE":
      return state.map((it) =>
        it.challenge_id === parseInt(action.data.challenge_id, 10)
          ? {
              ...it,
              participant_count: (parseInt(it.participant_count, 10) || 0) + 1,
            }
          : it,
      );
    default:
      return state;
  }
}

const App = () => {
  const [communities, setCommunities] = useState([
    { id: 1, name: "런닝 게시판", posts: [] },
    { id: 2, name: "자전거 게시판", posts: [] },
    { id: 3, name: "헬스 게시판", posts: [] },
    { id: 4, name: "다이어트 게시판", posts: [] },
    { id: 5, name: "자유 게시판", posts: [] },
  ]);

  const addPost = (communityId, title, content) => {
    setCommunities((prev) =>
      prev.map((community) => {
        if (community.id === parseInt(communityId)) {
          const newPost = {
            id: community.posts.length + 1,
            title,
            content,
            comments: [],
          };
          return { ...community, posts: [...community.posts, newPost] };
        }
        return community;
      }),
    );
  };

  const addComment = (communityId, postId, text) => {
    setCommunities((prev) =>
      prev.map((community) => {
        if (community.id === parseInt(communityId)) {
          const updatedPosts = community.posts.map((post) => {
            if (post.id === parseInt(postId)) {
              const newComment = { id: post.comments.length + 1, text };
              return { ...post, comments: [...post.comments, newComment] };
            }
            return post;
          });
          return { ...community, posts: updatedPosts };
        }
        return community;
      }),
    );
  };

  const [, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await api.get("/challenges");
        dispatch({ type: "INIT_CHALLENGE", data: response.data });
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      }
    };
    fetchChallenge();
  }, []);

  const [goal] = useState({ height: "", weight: "", BMI: "" });

  return (
    <ThemeProvider theme={customTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthContextProvider>
          <ChallengeDispatchContext.Provider value={dispatch}>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/challenge" element={<Challenge />} />
                  <Route
                    path="/challengeDetail/:id"
                    element={<ChallengeDetail />}
                  />
                  <Route
                    path="/challengecreate"
                    element={<ChallengeCreate />}
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signUp" element={<Signup />} />
                  <Route path="/myPage/:user_id" element={<MyPage />} />
                  <Route path="/myPage/:user_id/edit" element={<Edit />} />
                  <Route
                    path="/myPosts/:user_id/:postId"
                    element={<MyPost />}
                  />
                  <Route path="/exercise" element={<Exercise goal={goal} />} />
                  <Route path="/exercisediary" element={<ExerciseDiary />} />
                  <Route path="/challengediary" element={<ChallengeDiary />} />
                  <Route
                    path="/communities"
                    element={<CommunityList communities={communities} />}
                  />
                  <Route
                    path="/community/:communityId"
                    element={<Community communities={communities} />}
                  />
                  <Route
                    path="/community/:communityId/new-post"
                    element={<NewPostPage addPost={addPost} />}
                  />
                  <Route
                    path="/community/:communityId/post/:postId"
                    element={
                      <PostDetail
                        communities={communities}
                        addComment={addComment}
                      />
                    }
                  />
                </Routes>
              </Layout>
            </BrowserRouter>
          </ChallengeDispatchContext.Provider>
        </AuthContextProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
