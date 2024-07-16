import { useNavigate } from "react-router-dom"
import { useContext, useEffect } from "react";
import axios from 'axios';
import { ChallengeStateContext, ChallengeDispatchContext } from '../App';
import LangkingList from "../components/LangkingList";
import ChallengeItem from "../components/ChallengeItem";
import MyTabs from '../components/myTabs';
import "./Challenge.css";

function Challenge(){
    const data = useContext(ChallengeStateContext);
    const dispatch = useContext(ChallengeDispatchContext);
  
    // 페이지 진입 시 챌린지 데이터 요청
    useEffect(() => {
      const fetchChallenges = async () => {
        try {
          const response = await axios.get('http://localhost:5000/challenges');
          dispatch({ type: 'INIT_CHALLENGE', data: response.data });
        } catch (error) {
          console.error('Failed to fetch challenges:', error);
        }
      };
  
      fetchChallenges();
    }, [dispatch]);
    
    const navigate = useNavigate();
    const goChallengeCreate=()=>{
        navigate('/challengecreate',{replace:true});
    }
    console.log("Challenges data:", data); // 데이터 출력
    return(
        <div>
            <nav className="topNav">
                <li className="Logo">
                    <img className="imgLogo" src={require('../img/MainLogo.png')} alt="Logo" />
                </li>
                <li>
                    <MyTabs />
                </li>
            </nav>
            <div className="Challenge">
                <div className="Challenge-Langking">
                    <div>챌린지 랭킹</div>
                    <LangkingList/>
                </div>
                <div className="Challenge-List">
                    <div>챌린지</div>
                    <div className="Challenge-List-Right">
                        <input className="ChallengeSearch" placeholder="챌린지를 찾아보세요"></input>
                        <button type="button" className="goChallengeCreate" onClick={goChallengeCreate}>챌린지 만들러가기</button>
                    </div>
                    <div className="challenge-items-list">
                        {data.map((it)=>(
                            <ChallengeItem key={it.challenge_id} {...it} />
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}
export default Challenge;