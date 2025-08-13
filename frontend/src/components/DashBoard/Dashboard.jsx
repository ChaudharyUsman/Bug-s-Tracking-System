import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaTimes, FaUsers, FaProjectDiagram,
  FaBug, FaSignOutAlt
} from 'react-icons/fa';
import { Bar, Doughnut, Scatter } from 'react-chartjs-2';

import CreateUser from '../userRegister/UserRegister';
import AdminUsersGrid from '../showAllUsers/ShowAllUser';
import CreateProjectPage from '../createProject/CreateProject';
import BugProject from '../bugProject/BugsProject';
import AdminDashboard from '../adminProject/AdminShowProjects';
import BugList from '../showAllBugs/ShowAllBugs';
import AssignedProjects from '../Assigned Project/AssignedPro';
import BugProjectqa from '../Bug Projects Qa/BugProjectsQa';
import DeveloperAssigned from '../DeveloperDashBoard/Developer';
import DevAssigned from '../AssignedProjectDev/AssignedProject';

// Chart.js imports

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalBugs, setTotalBugs] = useState(0);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);

    if (storedRole === 'manager') setActiveSection('projects');
    else if (storedRole === 'qa') setActiveSection('qa');
    else if (storedRole === 'dev') setActiveSection('devAssigned');

    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [usersRes, projectsRes, bugsRes] = await Promise.all([
        axios.get('http://localhost:3500/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:3500/project', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:3500/bugs', {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);
      setTotalUsers(usersRes.data.length);
      setTotalProjects(projectsRes.data.length);
      setTotalBugs(bugsRes.data.length);
    } catch (error) {
      console.error('Failed to fetch counts', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
    toast.success('Logout successful!');
  };

  const menuItems = [
    { label: 'Overview', section: 'overview' },
    { label: 'Create User', modal: 'user' },
    { label: 'Show All Users', section: 'users' },
    { label: 'Create Projects', modal: 'project' },
    { label: 'Show All Projects', section: 'projects' },
    { label: 'Create Bug\'s', modal: 'bug' },
    { label: 'Show All Bug\'s', section: 'bugs' },
  ];

  const managerMenuItems = [
    { label: 'Create Projects', modal: 'project' },
    { label: 'Show All Projects', section: 'projects' },
    { label: 'Create Bug\'s', modal: 'bug' },
    { label: 'Show All Bug\'s', section: 'bugs' },
  ];

  const qaMenuItems = [
    { label: 'Assigned Project', section: 'qa' },
    { label: 'Bugs', section: 'bugQa' },
  ];

  const devMenuItems = [
    { label: 'Assigned Project', section: 'devAssigned' },
    { label: 'Bugs', section: 'devBugs' },
  ];

  const displayedMenu =
    role === 'admin' ? menuItems :
      role === 'manager' ? managerMenuItems :
        role === 'qa' ? qaMenuItems :
          role === 'dev' ? devMenuItems : [];

  // Chart Data
  const barData = {
    labels: ['Users', 'Projects', 'Bugs'],
    datasets: [
      {
        label: 'Total Count',
        data: [totalUsers, totalProjects, totalBugs],
        backgroundColor: ['#60A5FA', '#34D399', '#F87171'],
      },
    ],
  };

  const doughnutData = {
    labels: ['Users', 'Projects', 'Bugs'],
    datasets: [
      {
        data: [totalUsers, totalProjects, totalBugs],
        backgroundColor: ['#60A5FA', '#34D399', '#F87171'],
        borderWidth: 1,
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: 'Users vs Projects',
        data: [{ x: totalUsers, y: totalProjects }],
        backgroundColor: '#60A5FA',
      },
      {
        label: 'Projects vs Bugs',
        data: [{ x: totalProjects, y: totalBugs }],
        backgroundColor: '#34D399',
      },
      {
        label: 'Users vs Bugs',
        data: [{ x: totalUsers, y: totalBugs }],
        backgroundColor: '#F87171',
      }
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <nav className="bg-gray-900 p-4 flex items-center shadow-lg border-b border-gray-700">
        <div className="flex items-center gap-2 text-white text-2xl font-bold tracking-wide">
          <FaBug className="text-red-500 text-3xl" />
          {role === 'admin' ? 'Admin Dashboard' :
            role === 'manager' ? 'Manager Dashboard' :
              role === 'qa' ? 'QA Dashboard' : 'Developer Dashboard'}
        </div>
        <div className="flex-grow" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-lg font-semibold transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
        <ToastContainer />
      </nav>

      <div className="flex flex-1">
        <aside className="w-64 bg-gray-900 shadow-lg p-6 space-y-4 flex-shrink-0 border-r border-gray-700">
          <h1 className="text-3xl font-bold text-red-500 mb-6 text-center">🐞 Dashboard</h1>
          <nav className="space-y-2">
            {displayedMenu.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.section) setActiveSection(item.section);
                  if (item.modal === 'user') setIsUserModalOpen(true);
                  if (item.modal === 'project') setIsProjectModalOpen(true);
                  if (item.modal === 'bug') setIsBugModalOpen(true);
                }}
                className={`block w-full text-left p-3 rounded-lg transition-colors duration-300 ${activeSection === item.section
                  ? 'bg-red-600 shadow-md'
                  : 'hover:bg-gray-700'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 p-8">
          {activeSection === 'overview' && role === 'admin' && (
            <>
              <h1 className="text-4xl font-bold text-center mb-10">📊 System Overview</h1>
              
              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-gray-800 p-6 rounded-xl text-center border border-gray-700 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 transition-all">
                  <FaUsers className="text-blue-400 text-5xl mb-2" />
                  <h2 className="text-xl font-semibold mb-2">Total Users</h2>
                  <p className="text-gray-200 text-3xl">{totalUsers}</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl text-center border border-gray-700 hover:scale-105 hover:shadow-lg hover:shadow-green-500/50 transition-all">
                  <FaProjectDiagram className="text-green-400 text-5xl mb-2" />
                  <h2 className="text-xl font-semibold mb-2">Total Projects</h2>
                  <p className="text-gray-200 text-3xl">{totalProjects}</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl text-center border border-gray-700 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 transition-all">
                  <FaBug className="text-red-400 text-5xl mb-2" />
                  <h2 className="text-xl font-semibold mb-2">Total Bugs</h2>
                  <p className="text-gray-200 text-3xl">{totalBugs}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4">Bar Chart</h2>
                  <Bar data={barData} />
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4">Pi Chart</h2>
                  <Doughnut data={doughnutData} />
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4">Scatter Plot</h2>
                  <Scatter data={scatterData} />
                </div>
              </div>
            </>
          )}

          {activeSection === 'users' && <AdminUsersGrid />}
          {activeSection === 'projects' && <AdminDashboard />}
          {activeSection === 'bugs' && <BugList />}
          {activeSection === 'qa' && <AssignedProjects />}
          {activeSection === 'bugQa' && <BugProjectqa />}
          {activeSection === 'devAssigned' && <DevAssigned />}
          {activeSection === 'devBugs' && <DeveloperAssigned />}
        </div>
      </div>

      {/* Modals */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-lg relative border border-gray-700">
            <button onClick={() => setIsUserModalOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl">
              <FaTimes />
            </button>
            <CreateUser onClose={() => setIsUserModalOpen(false)} />
          </div>
        </div>
      )}

      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-lg relative border border-gray-700">
            <button onClick={() => setIsProjectModalOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl">
              <FaTimes />
            </button>
            <CreateProjectPage onClose={() => setIsProjectModalOpen(false)} />
          </div>
        </div>
      )}

      {isBugModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-4 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative border border-gray-700">
            <button onClick={() => setIsBugModalOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl">
              <FaTimes />
            </button>
            <BugProject onClose={() => setIsBugModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
