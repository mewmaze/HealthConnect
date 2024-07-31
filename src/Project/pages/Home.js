import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import { ChallengeStateContext } from "../App";
import "./Home.css";
import BannerSlider from "../components/BannerSlider";
import ChallengeSlider from "../components/ChallengeSlider";
import LangkingList from "../components/LangkingList";

function Home() {
    const data = useContext(ChallengeStateContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const [ postsResponse] = await Promise.all([
                    axios.get('http://localhost:5000/posts') // 게시글 데이터 불러오기
                ]);
                setPosts(postsResponse.data);
            } catch (error) {
                setError('Failed to fetch challenges.');
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, []);


    return (
        <div className="Home">
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            <div className="Home-Langking">
                <LangkingList/>
            </div>
            <div className="Home-title">커뮤니티</div>
            <div className="Home-box">
                <ul>
                    {posts.map(post => (
                        <li key={post.post_id}>
                            <div>{post.title}</div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="Home-banner">
                <BannerSlider />
            </div>
            <div className="Home-challenge-title">
                    챌린지
                <span className="hot-label">HOT!</span>
            </div>
            <div className="Home-challenge">
                <ChallengeSlider/>
            </div>
        </div>
    );
}

export default Home;