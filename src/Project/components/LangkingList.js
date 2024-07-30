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
                <ul className='LangkingList-lank' >
                    {profiles.map((profile, index) => (
                        <li key={profile.id} className='LangkingList-box'>
                            <div>{index +1}</div>
                            <div className='LangkingList-content'>
                                <img src={`http://localhost:5000/uploads/${profile.User.profile_picture}`} alt={`${profile.User.nickname}'s profile`} width="50" height="50" />
                                <div>{profile.User.nickname}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
    export default LangkingList;