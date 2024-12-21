import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import QuizApp from "./QuizApp";
import Cnpm from "./CNPM";
import QuestionList from "./QuestionList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuizApp />} />
        <Route path="/cnpm" element={<Cnpm />} />
        <Route path="ttlist" element={<QuestionList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
