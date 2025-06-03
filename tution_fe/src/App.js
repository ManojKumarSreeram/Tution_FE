
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthRoleCards from './Components/AuthRoleCards/AuthRoleCards'
import TeacherSignUp from './Components/TeacherSignUp/TeacherSignUp'
import StudentSignUp from './Components/StudentSignUp/StudentSignUp'
import ParentSignUp from './Components/ParentSignUp/ParentSignUp'
import TeacherDashboard from './Components/TeacherDashboard/TeacherDashboard'
import ParentDashboard from './Components/ParentDashboard/ParentDashboard'
import StudentDashboard from './Components/StudentDashboard/StudentDashboard'
import StudentDetails from './Components/StudentDetails/StudentDetails';
import UserDashboards from './Components/UserDashboards/UserDashboards';
import Login from './Components/Login/Login'


const App = () => {
  return (
    <BrowserRouter>
    <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<UserDashboards />} />
        <Route path="/auth-roles" element={<AuthRoleCards />} />
        <Route path="/signup/teacher" element={<TeacherSignUp />} />
        <Route path="/signup/student" element={<StudentSignUp />} />
        <Route path="/signup/parent" element={<ParentSignUp />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-details" element={<StudentDetails />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
