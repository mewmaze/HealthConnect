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
    const [category, setCategory] = useState(''); // 선택한 카테고리 상태 추가
    const [selectedCategory, setSelectedCategory] = useState(''); // 클릭된 카테고리 상태 추가

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const postsResponse = await axios.get('http://localhost:5000/posts');
                console.log('Fetched posts:', postsResponse.data); // 데이터 구조 확인
                setPosts(postsResponse.data);
            } catch (error) {
                setError('Failed to fetch challenges.');
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    const handleCategoryClick = (category) => {
        setCategory(category);
        setSelectedCategory(category); // 클릭된 카테고리 업데이트
    };


    return (
        <div className="Home">
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            <div className="Home-Langking">
                <LangkingList />
            </div>
            <div className="Home-title">커뮤니티</div>
            <div className="Home-box">
                <div className="Home-filter">
                    <button 
                        className={`category-buttons ${selectedCategory === '' ? 'active' : ''}`} 
                        onClick={() => handleCategoryClick('')}
                    >
                        전체
                    </button>
                    <button 
                        className={`category-buttons ${selectedCategory === '런닝' ? 'active' : ''}`} 
                        onClick={() => handleCategoryClick('런닝')}
                    >
                        런닝
                    </button>
                    <button 
                        className={`category-buttons ${selectedCategory === '자전거' ? 'active' : ''}`} 
                        onClick={() => handleCategoryClick('자전거')}
                    >
                        자전거
                    </button>
                    <button 
                        className={`category-buttons ${selectedCategory === '헬스' ? 'active' : ''}`} 
                        onClick={() => handleCategoryClick('헬스')}
                    >
                        헬스
                    </button>
                    <button 
                        className={`category-buttons ${selectedCategory === '다이어트' ? 'active' : ''}`} 
                        onClick={() => handleCategoryClick('다이어트')}
                    >
                        다이어트
                    </button>
                    <button 
                        className={`category-buttons ${selectedCategory === '자유' ? 'active' : ''}`} 
                        onClick={() => handleCategoryClick('자유')}
                    >
                        자유
                    </button>
                </div>
                <ul>
                    {posts.filter(post => !category || post.category === category).map(post => (
                        <li key={post.post_id}>
                            <div className="post-title">{post.title}</div>
                            <div className="post-date">{new Date(post.created_at).toLocaleDateString()}</div>
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
                <ChallengeSlider />
            </div>
        </div>
    );
}

export default Home;