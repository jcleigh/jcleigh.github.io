import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header-bar">
      <div className="left">
        <a href="/" title="Home">
          <img src="/picard-circle.png" alt="picard" className="header-image" />
        </a>
        <a href="/" title="Home">
          <h2>jcleigh</h2>
        </a>
      </div>
      <div className="right">
        <a href="https://github.com/jcleigh" target="_blank" rel="noopener noreferrer" title="GitHub">
          <FontAwesomeIcon icon={faGithub} className='icon' />
        </a>
      </div>
    </header >
  );
};

export default Header;