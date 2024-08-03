import React from 'react';
import './App.css';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Content />
      <Footer />
    </>
  );
};

export default App;