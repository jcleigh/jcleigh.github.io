import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header-bar">
      <div className="left">
        <img src="/picard-circle.png" alt="picard" className="header-image" />
        <h2>jcleigh</h2>
      </div>
      <div className="right">
        <a href="https://github.com/jcleigh" target="_blank" rel="noopener noreferrer" data-testid="githubLink" title="GitHub">
          <FontAwesomeIcon icon={faGithub} />
        </a>
      </div>
    </header>
  );
};

export default Header;