//나의 운동기록 메인페이지
import { useNavigate } from "react-router-dom";
import MyTabs from "../components/myTabs";

function isEmptyGoal(goal) {
    return !goal || !goal.height || !goal.weight || !goal.BMI;
}

function Exercise({goal}){

    const navigate = useNavigate();

    const goSet=()=>{
        navigate('/exerciseset',{replace:true});
    }
    const goChallengeDiary=()=>{
        navigate('/challengeDiary',{replace:true});
    }

    const goHome = () => {
        navigate(`/`);
    }
    
    return(
        <div>
            <nav className="topNav">
                <li className="Logo" onClick={goHome}>
                    <img className="imgLogo" src={require('../img/MainLogo.png')} alt="Logo" />
                </li>
                <li>
                    <MyTabs />
                </li>
            </nav>
            <div>나의 운동기록 메인</div>
            {isEmptyGoal(goal) ? ( //조건부 렌더링
                <div>목표를 설정하여 주세요</div>
            ) : (
                <div>
                    <div>목표</div>
                    <div>키: {goal.height}</div>
                    <div>몸무게: {goal.weight}</div>
                    <div>BMI: {goal.BMI}</div>
                </div>
            )}
            <button onClick={goSet}>목표설정하기</button>
            <button onClick={goChallengeDiary}>챌린지기록하기</button>
        </div>
    )
}
export default Exercise;

