import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <div className="container mx-auto p-4 flex-grow">
              <h1 className="text-2xl font-bold mb-4">Welcome to MyApp</h1>
              <p>This is a simple authentication demo with TypeScript and Vite.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;