import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import ForumIcon from "@mui/icons-material/Forum";

const communityIcons = {
  1: <DirectionsRunIcon sx={{ fontSize: 48, color: "#FF6B6B" }} />,
  2: <DirectionsBikeIcon sx={{ fontSize: 48, color: "#4ECDC4" }} />,
  3: <FitnessCenterIcon sx={{ fontSize: 48, color: "#556270" }} />,
  4: <MonitorWeightIcon sx={{ fontSize: 48, color: "#FFD700" }} />,
  5: <ForumIcon sx={{ fontSize: 48, color: "primary.main" }} />,
};

const CommunityList = ({ communities }) => {
  return (
    <Box sx={{ mt: { xs: 3, sm: 8 }, pb: 4, px: { xs: 1, sm: 0 } }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        커뮤니티 목록
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: `repeat(${Math.min(communities.length, 5)}, 1fr)` },
          gap: 2,
        }}
      >
        {communities.map((community) => (
          <Card key={community.id}>
            <CardActionArea
              component={Link}
              to={`/community/${community.id}`}
              sx={{ textDecoration: "none", height: "100%" }}
            >
              <CardContent sx={{ textAlign: "center", py: { xs: 3, sm: 5 } }}>
                {communityIcons[community.id] || (
                  <ForumIcon sx={{ fontSize: 48, color: "primary.main" }} />
                )}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1.5 }}>
                  {community.name}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default CommunityList;
