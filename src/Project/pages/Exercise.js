//나의 운동기록 메인페이지
import LeftNav from '../components/leftNav';
import { useNavigate } from "react-router-dom";
import './Exercise.css'

function isEmptyGoal(goal) {
    return !goal || !goal.height || !goal.weight || !goal.BMI;
}

function Exercise({goal}){

    const navigate = useNavigate();

    const exerciseNavItems = [
        { name: "운동 기록", path: "/exercise" },
        { name: "챌린지 기록", path: "/challengeDiary" },
        { name: "목표 설정", path: "/exerciseset" }
    ];


    const handleNavItemClick = (itemName) => {
        const item = exerciseNavItems.find(navItem => navItem.name === itemName);
        if (item) {
            navigate(item.path, { replace: true });
        }
    };

    return (
        <div className="exerciseContainer">
            <LeftNav items={exerciseNavItems.map(item => item.name)} onNavItemClick={handleNavItemClick} />
            <div className="exerciseContent">
                <div>나의 운동기록 메인</div>
                {isEmptyGoal(goal) ? (
                    <div>목표를 설정하여 주세요</div>
                ) : (
                    <div>
                        <div>목표</div>
                        <div>키: {goal.height}</div>
                        <div>몸무게: {goal.weight}</div>
                        <div>BMI: {goal.BMI}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Exercise;

