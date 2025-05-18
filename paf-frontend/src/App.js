import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import './App.css';
import Posts from './components/Posts';
import CommentForm from './components/CommentForm';
import CommentSection from './components/CommentSection';
import Create_A_Learning_Plan from './components/Create_A_Learning_Plan';
import Test from './components/Test';
import ViewPlans from './components/ViewPlans';
import AddTopics from './components/AddTopics';
import UpdateTopic from './components/UpdateTopic';
import SearchaUser from './components/SearchaUser';
import Home from './components/Home';
import QuestionList from './components/QuestionList';
import QuestionDetail from './components//QuestionDetail';
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

          //Panduka
          <Route path="/create_a_learning_plan" element={<Create_A_Learning_Plan/>}/>
          <Route path="/test" element={<Test/>}/>
           <Route path="/viewPlans" element={<ViewPlans/>}/>
           <Route path="/addTopics/:planId" element={<AddTopics/>}/>
           <Route path="/updateLecture/:topicId" element={<UpdateTopic/>}/>

           //Follow
            <Route path="/searchauser/:userId" element={<SearchaUser/>}/>
            <Route path="/home" element={<Home/>}/>

            //question
            <Route path="/questions" element={<QuestionList/>} />
          <Route path="/questions/:id" element={<QuestionDetail/>} />
          <Route path="/ask-question" element={<AskQuestion/>} />
          <Route path="/edit-question/:id" element={<EditQuestion />} />
          <Route path="/edit-answer/:id" element={<EditAnswer />} />
        </Routes>
      </div>
    </Router>
  ); 
}

export default App;