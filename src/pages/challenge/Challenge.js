import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../api/api";
import ChallengeItem from "../../components/challenge/ChallengeItem";
import {
  Pagination,
  Container,
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";

function Challenge() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterTargetDays, setFilterTargetDays] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/challenges");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      }
    };
    fetchData();
  }, []);

  const goChallengeCreate = () => {
    navigate("/challengecreate", { replace: true });
  };

  const handleFilterTargetDaysChange = (e) => {
    setFilterTargetDays(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterPeriodChange = (e) => {
    setFilterPeriod(e.target.value);
    setCurrentPage(1);
  };

  const handleSortOptionChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const filterChallenges = (challenges) => {
    let filtered = challenges;

    if (filterTargetDays && filterTargetDays !== "all") {
      filtered = filtered.filter(
        (challenge) => challenge.target_days === parseInt(filterTargetDays)
      );
    }

    if (filterPeriod && filterPeriod !== "all") {
      filtered = filtered.filter(
        (challenge) => challenge.target_period === parseInt(filterPeriod)
      );
    }

    if (sortOption && sortOption === "latest") {
      filtered = filtered.sort(
        (a, b) => new Date(b.start_date) - new Date(a.start_date)
      );
    } else if (sortOption && sortOption === "popular") {
      filtered = filtered.sort(
        (a, b) => b.participant_count - a.participant_count
      );
    }
    return filtered;
  };

  const filteredChallenges = filterChallenges(data);

  const searchResults = filteredChallenges.filter((challenge) =>
    challenge.challenge_name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(Number(value));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            mb: 3,
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Typography variant="h4">챌린지</Typography>
          <Box sx={{ flex: 1 }}>
            <Autocomplete
              freeSolo
              options={data}
              inputValue={search} // ✅ 입력값과 상태 연결
              onInputChange={(event, newInputValue) => {
                setSearch(newInputValue); // ✅ 입력할 때 search 업데이트
                setCurrentPage(1);
              }}
              getOptionLabel={(option) => option.challenge_name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="outlined"
                  slotProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;
                return (
                  <Box
                    key={key}
                    {...otherProps}
                    component="li"
                    onClick={() => {
                      navigate(`/challengeDetail/${option.challenge_id}`);
                    }}
                  >
                    {option.challenge_name}
                  </Box>
                );
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            width: "100%",
            mb: 3,
          }}
        >
          <Box sx={{ minWidth: 120, flex: "1 1 120px" }}>
            <FormControl fullWidth>
              <InputLabel id="target-days-label">달성 조건</InputLabel>
              <Select
                labelId="target-days-label"
                label="달성 조건"
                value={filterTargetDays}
                onChange={handleFilterTargetDaysChange}
              >
                <MenuItem value="">전체</MenuItem>
                {[...Array(7).keys()].map((i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    주 {i + 1}회
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: 120, flex: "1 1 120px" }}>
            <FormControl fullWidth>
              <InputLabel id="period-label">기간</InputLabel>
              <Select
                labelId="period-label"
                label="기간"
                value={filterPeriod}
                onChange={handleFilterPeriodChange}
              >
                <MenuItem value="">전체</MenuItem>
                {[...Array(8).keys()].map((i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}주
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: 120, flex: "1 1 120px" }}>
            <FormControl fullWidth>
              <InputLabel id="sort-option-label">정렬</InputLabel>
              <Select
                labelId="sort-option-label"
                label="정렬 옵션"
                value={sortOption}
                onChange={handleSortOptionChange}
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value="latest">최신순</MenuItem>
                <MenuItem value="popular">인기순</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button variant="contained" onClick={goChallengeCreate}>
            챌린지 만들러가기
          </Button>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,1fr)",
              md: "repeat(3,1fr)",
            },
            gap: 2,
            width: "100%",
          }}
        >
          {currentItems.map((it) => (
            <ChallengeItem key={it.challenge_id} {...it} />
          ))}
        </Box>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </Paper>
    </Container>
  );
}

export default Challenge;
