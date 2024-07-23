import React from 'react';
import { Link } from 'react-router-dom';
import './CommunityList.css';

const CommunityList = ({ communities }) => {
  
  return (
    <div>
      <h2>커뮤니티 목록</h2>
      <ul className="community-list">
        {communities.map(community => (
          <li key={community.id}>
            <Link to={`/community/${community.id}`}>{community.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityList;