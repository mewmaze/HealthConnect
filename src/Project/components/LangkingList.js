// import { Link } from 'react-router-dom';
// import "./LangkingList.css";

// function LangkingList ({username,profile_picture}){

//     return(
//         <div className="LangkingList">
//             {/* <Link to={} className="LangkingItem"> */}
//                 <div className="Langking-img">
//                     {/* <img src={`http://localhost:5000/${profile_pictureg}`} alt="프로필사진"/> */}
//                     {data.map((it)=>(
//                         key={it.user_id} {username}
//                     ))}                    

//                 </div>                
//             {/* </Link> */}
//         </div>
//     )
// }
// export default LangkingList;

// {data.map((it)=>(
//     <ChallengeItem key={it.challenge_id} {...it} />
// ))}

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LangkingList.css';

function LangkingList (){
    const [profiles, setProfiles] = useState([]);

    useEffect(()=>{
        const fetchProfiles = async ()=>{
            try {
                const response = await axios.get('http://localhost:5000/api');
                console.log("Fetched 프로필들",response.data);
                setProfiles(response.data.slice(0, 5));
            } catch(error) {
                console.error("Failed to fetch Profiles:",error);// 상위 5개의 프로필만 설정
            }
        };
        fetchProfiles();
        },[]);

    

        return(
            <div className="LangkingList">
                <h2>챌린지 랭킹</h2>
                <ul className='LangkingList-lank' >
                    {profiles.map((profile, index) => (
                        <li key={profile.id} className='LangkingList-box'>
                            <img src={`http://localhost:5000/uploads/${profile.User.profile_picture}`} alt={`${profile.User.nickname}'s profile`} width="50" height="50" />
                            <div>{profile.User.nickname}</div>
                            <div>뱃지: {profile.achievement_count}</div>
                            <div>랭킹: {index +1}위</div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
    export default LangkingList;