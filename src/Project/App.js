import React, { useReducer, useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import api from "./api/api";
import { AuthContextProvider } from "./hooks/AuthContext";

import "./App.css";

import Layout from "./components/Layout"; // Import Layout

import MyPage from "./pages/MyPage";
import Edit from "./pages/ProfileEdit";
import MyPost from "./pages/MyPost";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Challenge from "./pages/Challenge";
import Home from "./pages/Home";
import ChallengeCreate from "./pages/ChallengeCreate";
import ChallengeDetail from "./pages/ChallengeDetail";
import Exercise from "./pages/Exercise";
import ExerciseDiary from "./pages/ExerciseDiary";
import ChallengeDiary from "./pages/ChallengeDiary";

import CommunityList from "./pages/CommunityList";
import Community from "./pages/Community";
import PostDetail from "./pages/PostDetail";
import NewPostPage from "./pages/NewPostPage";

// 챌린지 Context 생성
export const ChallengeStateContext = React.createContext();
export const ChallengeDispatchContext = React.createContext();

// 리듀서 함수 정의
function reducer(state, action) {
  switch (action.type) {
    case "INIT_CHALLENGE": {
      return action.data;
    }
    case "CREATE_CHALLENGE": {
      return [...state, action.data];
    }
    case "UPDATE_CHALLENGE": {
      return state.map((it) =>
        String(it.challenge_id) === String(action.data.challenge_id)
          ? { ...action.data }
          : it
      );
    }
    case "DELETE_CHALLENGE": {
      return state.filter((it) => String(it.id) !== String(action.id));
    }
    case "JOIN_CHALLENGE": {
      return state.map((it) =>
        it.challenge_id === parseInt(action.data.challenge_id, 10)
          ? {
              ...it,
              participant_count: (parseInt(it.participant_count, 10) || 0) + 1, // 참가자 수 증가
            }
          : it
      );
    }
    default: {
      return state;
    }
  }
}

const App = () => {
  const [communities, setCommunities] = useState([
    {
      id: 1,
      name: "런닝 게시판",
      posts: [],
    },
    {
      id: 2,
      name: "자전거 게시판",
      posts: [],
    },
    {
      id: 3,
      name: "헬스 게시판",
      posts: [],
    },
    {
      id: 4,
      name: "다이어트 게시판",
      posts: [],
    },
    {
      id: 5,
      name: "자유 게시판",
      posts: [],
    },
  ]);

  const addPost = (communityId, title, content) => {
    setCommunities((prevCommunities) => {
      return prevCommunities.map((community) => {
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
      });
    });
  };

  const addComment = (communityId, postId, text) => {
    setCommunities((prevCommunities) => {
      return prevCommunities.map((community) => {
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
      });
    });
  }; // 게시판 부분 끝

  //챌린지
  const [challenges, dispatch] = useReducer(reducer, []);

  //서버에서 초기 데이터 가져오기
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await api.get("/challenges");
        console.log("Fetched Data: ", response.data);
        dispatch({ type: "INIT_CHALLENGE", data: response.data });
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      }
    };

    fetchChallenge();
  }, []);

  //goal은 props로 전달
  const [goal, setGoal] = useState({
    height: "",
    weight: "",
    BMI: "",
  }); // 챌린지, 나의 운동 기록 부분 끝

  return (
    <AuthContextProvider>
      <ChallengeStateContext.Provider value={challenges}>
        <ChallengeDispatchContext.Provider value={dispatch}>
          <BrowserRouter>
            <div className="App">
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
                  <Route path="/myPage/:user_id" element={<MyPage />} />{" "}
                  {/*  ... */}
                  <Route path="/myPage/:user_id/edit" element={<Edit />} />{" "}
                  {/*  ... */}
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
            </div>
          </BrowserRouter>
        </ChallengeDispatchContext.Provider>
      </ChallengeStateContext.Provider>
    </AuthContextProvider>
  );
};
export default App;
