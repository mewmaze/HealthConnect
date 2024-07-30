import { useNavigate, Link } from "react-router-dom"
import { useContext, useEffect, useState } from "react";
import { ChallengeStateContext, ChallengeDispatchContext } from '../App';
import LangkingList from "../components/LangkingList";
import ChallengeItem from "../components/ChallengeItem";
import "./Challenge.css";

function Challenge(){
    const data = useContext(ChallengeStateContext);
    const [search,setSearch] = useState('');
  
    const navigate = useNavigate();
    const goChallengeCreate=()=>{
        navigate('/challengecreate',{replace:true});
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    // 검색어에 따라 데이터를 필터링
    const filteredChallenges = data.filter(challenge =>
        challenge.challenge_name.toLowerCase().includes(search.toLowerCase())
    );

    console.log("Challenges data:", data); // 데이터 출력
    return(
        <div>
            <div className="Challenge">
                <div className="Challenge-Langking">
                    <h2>챌린지 랭킹</h2>
                    <LangkingList/>
                </div>
                <div className="Challenge-List">
                    <div className="ChallengeSearchContainer">
                        <input className="ChallengeSearch" placeholder="챌린지를 찾아보세요" value={search} onChange={handleSearchChange}/>
                        {search && ( //검색결과가 있을시에만 렌더링
                            <ul className="ChallengeSearchResults">
                                {filteredChallenges.map((it) => (
                                    <li key={it.challenge_id}>
                                        <Link to={`/challengeDetail/${it.challenge_id}`}>{it.challenge_name}</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="challenge-items-list">
                    {data.map((it)=>(
                        <ChallengeItem key={it.challenge_id} {...it} />
                    ))}
                </div>
                <button type="button" className="goChallengeCreate" onClick={goChallengeCreate}>챌린지 만들러가기</button>
            </div>
        </div>
    )
}
export default Challenge;