import { FC } from "react";
import "./App.css";
import Header from "./Header";
import Content from "./Content";

const App: FC = () => {
  return (
    <div className="App">
      <Header />
      <Content />
    </div>
  );
};

export default App;