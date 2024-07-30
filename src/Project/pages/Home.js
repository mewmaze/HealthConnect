import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import { ChallengeStateContext} from '../App';
import "./Home.css";
import BannerSlider from "../components/BannerSlider";
import ChallengeItem from "../components/ChallengeItem";
import LangkingList from "../components/LangkingList";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const data = useContext(ChallengeStateContext);

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
            <input className="HomeSearch" placeholder="검색어를 입력하세요"></input>
            <LangkingList/>
            <div className="Home-box">
                <div className="Home-title">커뮤니티</div>
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
            <div className="Home-box">
                <div className="Home-title">인기있는 챌린지</div>
                <div className="Home-challenge">
                    {data.map((it)=>(
                        <ChallengeItem key={it.challenge_id} {...it} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;