import React from 'react';
import './App.css';
import Header from './Header';
import Content from './Content';
import About from './About';
import Footer from './Footer';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Content />
      <About />
      <Footer />
    </>
  );
};

export default App;