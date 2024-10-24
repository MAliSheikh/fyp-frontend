import './App.css';
import LoginSignup from './components/LoginSignup/LoginSignup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './prodcuts/products_page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/products" element={<Products />} />
        <Route path="/" element={<LoginSignup />} />
      </Routes>
    </Router>
  );
}

export default App;