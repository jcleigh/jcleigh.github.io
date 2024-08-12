import React from 'react';
import './Content.css';
//import ABriefHistoryOfMyComputingJourney from './posts/A Brief History of My Computing Journey';

//TODO: figure out / implement routing
//TODO: import blog articles from markdown files?

const Content: React.FC = () => {
  return (
    <main className="content-section">
      <article>
        <h2>Blog Posts</h2>
        <p>Coming soon...</p>
        {/* <ABriefHistoryOfMyComputingJourney /> */}
      </article>
    </main>
  );
};

export default Content;