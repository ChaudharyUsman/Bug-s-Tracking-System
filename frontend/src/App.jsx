import { BrowserRouter as Router, Routes, Route ,Navigate} from 'react-router-dom';
import Login from './page/login/Login';
import AdminDashboard from './page/DashBoard/Dashboard';
import UserRegister from './page/userRegister/UserRegistration';
import ShowUsers from './page/showAllUsers/ShowUsers';
import AdminProject from './page/adminProjects/AdminProjects';
import CreateProject from './page/createproject/CreateProjects'
import BugProjct from './page/bugProject/BugsProject';
import ShowAllBugs from './page/showAllBugs/ShowALlbugs';
import DevelopersDashBoard from './page/developerDash/DeveloperBoard';
import ErrorPage from './components/ErrorPage/Error';
import Filtersss from './components/FillterBugs/FilterBugs';
import DeveloperBugs from './components/DeveloperAsssignedPro/ShowAllDeveloper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/" replace />;
    }
    return children;
    
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/registration_user" element={<PrivateRoute><UserRegister /></PrivateRoute>} />
        <Route path="/all_users" element={<PrivateRoute><ShowUsers /></PrivateRoute>} />
        <Route path="/Assigned" element={<PrivateRoute><AdminProject /></PrivateRoute>} />
        <Route path="/createProject" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
        <Route path="/BugProjects" element={<PrivateRoute><BugProjct /></PrivateRoute>} />
        <Route path="/All_Bugs" element={<PrivateRoute><ShowAllBugs /></PrivateRoute>} />
        <Route path="/devdashboard" element={<PrivateRoute><DevelopersDashBoard /></PrivateRoute>} />
        <Route path="/filtersss/:projectId" element={<PrivateRoute><Filtersss /></PrivateRoute>} />
        <Route path="/DeveloperBug" element={<PrivateRoute><DeveloperBugs /></PrivateRoute>} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
