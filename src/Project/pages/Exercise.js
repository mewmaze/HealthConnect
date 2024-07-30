import LeftNav from '../components/leftNav';
import { useNavigate } from "react-router-dom";
import './Exercise.css';
import '../components/ExerciseSet';
import ExerciseSet from '../components/ExerciseSet';

function Exercise() {

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
        <div className="exercise">
            <div className="exercise-nav">
                <LeftNav items={exerciseNavItems.map(item => item.name)} onNavItemClick={handleNavItemClick} />
            </div>
            <div className="exercise-content">
                <ExerciseSet />
            </div>
        </div>
    );
}


export default Exercise;
