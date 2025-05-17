import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import './App.css';
import Posts from './components/Posts';
import CommentForm from './components/CommentForm';
import CommentSection from './components/CommentSection';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/createpost" element={<Posts />} />
          <Route path="/posts/:postId" element={<Posts />} />
          <Route path="/comment" element={<CommentForm />} />
          <Route path="/commentsection" element={<CommentSection />} />
        </Routes>
      </div>
    </Router>
  ); 
}

export default App;