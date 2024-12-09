import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import QuizApp from "./QuizApp";
import Cnpm from "./CNPM";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuizApp />} />
        <Route path="/cnpm" element={<Cnpm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
