import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useNavigate();

  const goHome = () => navigate("/");
  const goChallenge = () => navigate("/challenge");
  const goCommunity = () => navigate("/communities");
  const goExercise = () => navigate("/exercise");
  const goLogin = () => navigate("/login");
  const goSignup = () => navigate("/signup");
  const goMyPage = (user_id) => navigate(`/myPage/${user_id}`);
  return {
    goHome,
    goChallenge,
    goCommunity,
    goExercise,
    goLogin,
    goSignup,
    goMyPage,
  };
};
