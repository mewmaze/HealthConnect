import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import { ChallengeStateContext } from "../App";
import LangkingList from "../components/LangkingList";
import ChallengeItem from "../components/ChallengeItem";
import MyTabs from '../components/myTabs';
import "./Challenge.css";

function Challenge(){
    const data = useContext(ChallengeStateContext);
    const navigate = useNavigate();
    const goChallengeCreate=()=>{
        navigate('/challengecreate',{replace:true});
    }
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
                        <input className="ChallengeSearch"></input>
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