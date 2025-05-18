import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import './App.css';
import Posts from './components/Posts';
import CommentForm from './components/CommentForm';
import CommentSection from './components/CommentSection';
import QuestionList from './components/QuestionList';
import QuestionDetail from './components/QuestionDetail';
import AskQuestion from './components/AskQuestion';
import EditQuestion from './components/EditQuestion';
import EditAnswer from './components/EditAnswer';
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
           <Route path="/questions/:id" element={<QuestionDetail/>} />
          <Route path="/ask-question" element={<AskQuestion/>} />
          <Route path="/edit-question/:id" element={<EditQuestion />} />
          <Route path="/edit-answer/:id" element={<EditAnswer />} />
          <Route path="/listA" element={< QuestionList/>} />
        </Routes>
      </div>
    </Router>
  ); 
}

export default App;