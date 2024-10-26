import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './prodcuts/products_page';
import SignUp from './components/LoginSignup/signup';
import Login from './components/LoginSignup/login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/products" element={<Products />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;