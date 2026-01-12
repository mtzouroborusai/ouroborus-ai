import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DrivingTest from './pages/DrivingTest';
import LostAnimals from './pages/LostAnimals';
import Services from './pages/Services';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/driving-test" element={<DrivingTest />} />
        <Route path="/lost-animals" element={<LostAnimals />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </Router>
  );
}

export default App;
