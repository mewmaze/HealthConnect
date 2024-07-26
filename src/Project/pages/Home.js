//챌린지랑 운동기록페이지로 이동하는 임시 페이지
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "./Home.css";

function Home(){
    const [challenges, setChallenges] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const [challengesResponse, postsResponse] = await Promise.all([
                    axios.get('http://localhost:5000/challenges'), // 챌린지 데이터 불러오기
                    axios.get('http://localhost:5000/posts') // 게시글 데이터 불러오기
                ]);
                setChallenges(challengesResponse.data);
                setPosts(postsResponse.data);
            } catch (error) {
                setError('Failed to fetch challenges.');
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, []);
    return(
        <div className="Home">
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            <input className="HomeSearch" placeholder="검색어를 입력하세요"></input>
            <div className="Home-box">
                <div className="Home-title">인기있는 챌린지</div>
                <ul>
                    {challenges.map(challenge => (
                        <li key={challenge.challenge_id}>
                        <Link to={`/challengeDetail/${challenge.challenge_id}`}>
                            <div>{challenge.challenge_name}</div>
                        </Link>
                    </li>
                    ))}
                </ul>                
            </div>
            <div className="Home-box">
            <div className="Home-title">커뮤니티</div>
                <ul>
                    {posts.map(post => (
                        <li key={post.id}>
                            <div>{post.title}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>


    )
}
export default Home;