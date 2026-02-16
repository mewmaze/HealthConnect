import { useNavigate } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import ChallengeEditor from "../../components/challenge/ChallengeEditor";
import useChallengeActions from "../../hooks/useChallengeActions";

function ChallengeCreate() {
  const { addChallenge } = useChallengeActions();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      await addChallenge(formData);
      console.log("챌린지 생성 성공");
      navigate("/challenge", { replace: true });
    } catch (error) {
      console.error("챌린지 생성 실패:", error);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: { xs: 2, sm: 8 },
        px: { xs: 1, sm: 3 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ alignSelf: "flex-start", mb: 2 }}
      >
        챌린지 만들기
      </Typography>
      <ChallengeEditor onSubmit={onSubmit} text={"등록"} />
    </Container>
  );
}

export default ChallengeCreate;
