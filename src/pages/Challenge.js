import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { ChallengeStateContext } from "../App";
import api from "../api/api";
import ChallengeItem from "../components/ChallengeItem";
import "./Challenge.css";

function Challenge() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterTargetDays, setFilterTargetDays] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [sortOption, setSortOption] = useState("latest");
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
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

    if (filterTargetDays !== "all") {
      filtered = filtered.filter(
        (challenge) => challenge.target_days === parseInt(filterTargetDays)
      );
    }

    if (filterPeriod !== "all") {
      filtered = filtered.filter(
        (challenge) => challenge.target_period === parseInt(filterPeriod)
      );
    }

    if (sortOption === "latest") {
      filtered = filtered.sort(
        (a, b) => new Date(b.start_date) - new Date(a.start_date)
      );
    } else if (sortOption === "popular") {
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

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(searchResults.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  console.log("Challenges data:", data);

  return (
    <div>
      <div className="Challenge">
        <div className="ChallengeSearchContainer">
          <span>챌린지</span>
          <div className="search-container">
            <input
              className="ChallengeSearch"
              placeholder="챌린지를 찾아보세요!"
              value={search}
              onChange={handleSearchChange}
            />
            {search && (
              <ul className="ChallengeSearchResults">
                {searchResults.map((it) => (
                  <li key={it.challenge_id}>
                    <Link to={`/challengeDetail/${it.challenge_id}`}>
                      {it.challenge_name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="Challenge-List">
          <div className="FilterContainer">
            <select
              value={filterTargetDays}
              onChange={handleFilterTargetDaysChange}
            >
              <option value="all">달성 조건</option>
              {[...Array(7).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  주 {i + 1}회
                </option>
              ))}
            </select>
            <select value={filterPeriod} onChange={handleFilterPeriodChange}>
              <option value="all">기간</option>
              {[...Array(8).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}주
                </option>
              ))}
            </select>
            <select value={sortOption} onChange={handleSortOptionChange}>
              <option value="">정렬 옵션</option>
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
            <button
              type="button"
              className="goChallengeCreate"
              onClick={goChallengeCreate}
            >
              챌린지 만들러가기
            </button>
          </div>
        </div>
        <div className="challenge-items-list">
          {currentItems.map((it) => (
            <ChallengeItem key={it.challenge_id} {...it} />
          ))}
        </div>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li
              key={number}
              id={number}
              onClick={handleClick}
              className={currentPage === number ? "active" : ""}
            >
              {number}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Challenge;
