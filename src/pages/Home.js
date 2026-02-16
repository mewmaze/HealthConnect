import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import ForumIcon from "@mui/icons-material/Forum";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import api from "../api/api";
import BannerSlider from "../components/BannerSlider";
import ChallengeSlider from "../components/challenge/ChallengeSlider";
import LangkingList from "../components/LangkingList";

const categories = [
  { value: "", label: "전체" },
  { value: "1", label: "런닝" },
  { value: "2", label: "자전거" },
  { value: "3", label: "헬스" },
  { value: "4", label: "다이어트" },
  { value: "5", label: "자유" },
];

function SectionTitle({ icon, title, accent }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {icon}
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
      {accent && (
        <Typography
          component="span"
          sx={{ color: "#FF4444", fontWeight: 800, fontSize: "0.9rem" }}
        >
          {accent}
        </Typography>
      )}
    </Stack>
  );
}

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = selectedCategory
          ? { communityId: selectedCategory }
          : {};
        const postsResponse = await api.get("/posts", { params });
        setPosts(postsResponse.data);
      } catch (error) {
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Container
      maxWidth="md"
      sx={{ py: 4, display: "flex", flexDirection: "column", gap: 4 }}
    >
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <Box>
        <SectionTitle
          icon={<LeaderboardIcon sx={{ color: "primary.main" }} />}
          title="챌린지 순위"
        />
        <Paper sx={{ mt: 1.5 }}>
          <LangkingList />
        </Paper>
      </Box>

      <Box>
        <SectionTitle
          icon={<ForumIcon sx={{ color: "primary.main" }} />}
          title="커뮤니티"
        />
        <Paper sx={{ p: 3, mt: 1.5 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
          >
            {categories.map((cat) => (
              <Chip
                key={cat.value}
                label={cat.label}
                onClick={() => handleCategoryClick(cat.value)}
                variant={selectedCategory === cat.value ? "filled" : "outlined"}
                sx={{
                  fontWeight: "bold",
                  ...(selectedCategory === cat.value && {
                    bgcolor: "primary.main",
                    color: "white",
                  }),
                }}
              />
            ))}
          </Stack>
          <List disablePadding>
            {posts.slice(0, 6).map((post, idx) => (
              <ListItem
                key={post.post_id}
                disablePadding
                sx={{
                  py: 1,
                  borderBottom: idx < 5 ? "1px solid #f0f0f0" : "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ListItemText
                  primary={
                    <Link
                      to={`/community/${post.community_id}/post/${post.post_id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        fontWeight: "bold",
                      }}
                    >
                      {post.title}
                    </Link>
                  }
                  sx={{ flex: 7 }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ flex: 1 }}
                >
                  {post.user ? post.user.nickname : "Unknown"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ flex: 1, textAlign: "right" }}
                >
                  {new Date(post.created_at).toLocaleDateString()}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      <Box sx={{ maxWidth: 830, width: "100%", mx: "auto" }}>
        <BannerSlider />
      </Box>

      <Box sx={{ mt: 1 }}>
        <SectionTitle
          icon={<WhatshotIcon sx={{ color: "#FF4444" }} />}
          title="챌린지"
          accent="HOT!"
        />
        <Box sx={{ width: "100%", maxWidth: 900, mt: 1.5 }}>
          <ChallengeSlider />
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
