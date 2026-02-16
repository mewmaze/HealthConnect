import { Link } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { getImageUrl } from "../../api/api";

function ChallengeItem({
  challenge_id,
  challenge_img,
  challenge_name,
  participant_count,
}) {
  return (
    <Box sx={{ px: 1 }}>
      <Card
        component={Link}
        to={`/challengeDetail/${challenge_id}`}
        sx={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <CardMedia
          component="img"
          image={getImageUrl(challenge_img)}
          alt={challenge_name}
          sx={{
            width: 240,
            height: 160,
            objectFit: "cover",
            borderRadius: 1,
            mt: 1,
          }}
        />
        <CardContent sx={{ textAlign: "center", py: 1, "&:last-child": { pb: 0 } }}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {challenge_name}
          </Typography>
        </CardContent>
        <Chip
          label={`${participant_count}명 도전중`}
          size="small"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            fontWeight: "bold",
            mb: 1,
          }}
        />
      </Card>
    </Box>
  );
}

export default ChallengeItem;
