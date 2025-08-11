import { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaTimes, FaBug, FaProjectDiagram } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]); 
  const [users, setUsers] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [projectBugs, setProjectBugs] = useState([]);
  const [showBugsModal, setShowBugsModal] = useState(false);

  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:3500/project', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
      setAllProjects(res.data);
    } catch {
      toast.error('Failed to fetch projects');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3500/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      toast.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, [token]);


  useEffect(() => {
    if (keyword.trim() === "") {
      setProjects(allProjects);
    } else {
      const filtered = allProjects.filter((user) =>
        user.title.toLowerCase().includes(keyword.toLowerCase())
      );
      setProjects(filtered);
    }
  }, [keyword, allProjects]);

  const initialFormValues = editingProject
    ? {
        title: editingProject.title,
        description: editingProject.description || '',
        managers: editingProject.managers.map((u) => u._id),
        developers: editingProject.developers.map((u) => u._id),
        qas: editingProject.qas.map((u) => u._id),
      }
    : {
        title: '',
        description: '',
        managers: [],
        developers: [],
        qas: [],
      };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
    managers: Yup.array(),
    developers: Yup.array(),
    qas: Yup.array(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.put(
        `http://localhost:3500/project/${editingProject._id}`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Project updated successfully');
      setShowForm(false);
      setEditingProject(null);
      resetForm();
      fetchProjects();
    } catch {
      toast.error('Failed to update project');
    }
  };
  
  const clickShowBug = (projectId) => {
  navigate(`/filtersss/${projectId}`);
};

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim() === '') {
      setProjects(allProjects);
      return;
    }
    const filtered = allProjects.filter((p) =>
      p.title.toLowerCase().includes(keyword.toLowerCase())
    );
    setProjects(filtered);
  };

  const confirmDelete = (id) => {
    setProjectToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    try {
      await axios.delete(`http://localhost:3500/project/${projectToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Project deleted');
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 text-white bg-gray-900 min-h-screen">
      <ToastContainer />

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="🔎 Search by bug title..."
          className="p-2 rounded bg-gray-700 border border-gray-600 text-white w-full"
        />
      </div>


      {/* Delete Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-full border border-gray-700 text-center">
            <h3 className="text-lg font-bold text-red-400 mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setProjectToDelete(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bugs Modal */}
      {showBugsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-lg w-full border border-gray-700 text-white">
            <h3 className="text-lg font-bold text-red-400 mb-4">Project Bugs</h3>
            {projectBugs.length === 0 ? (
              <p className="text-gray-400">No bugs found for this project.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {projectBugs.map((bug) => (
                  <li key={bug._id}>
                    <span className="text-red-300 font-semibold">{bug.title}</span> – {bug.status}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowBugsModal(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Form */}
      {showForm && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative border border-gray-700">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProject(null);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl p-2 rounded-full hover:bg-gray-700"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-red-400">Edit Project</h2>
            <Formik
              initialValues={initialFormValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-gray-300 font-semibold">Title</label>
                    <Field
                      name="title"
                      placeholder="Project Title"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold">Description</label>
                    <Field
                      as="textarea"
                      name="description"
                      placeholder="Description"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none resize-none"
                      maxLength={50}
                    />
                  </div>

                  {[
                    { key: 'managers', role: 'manager' },
                    { key: 'developers', role: 'dev' },
                    { key: 'qas', role: 'qa' },
                  ].map(({ key, role }) => (
                    <div key={key}>
                      <label className="block text-gray-300 font-semibold capitalize">
                        {key}
                      </label>
                      <Select
                        name={key}
                        options={users
                          .filter((user) => user.role === role)
                          .map((user) => ({
                            value: user._id,
                            label: user.email,
                          }))}
                        isMulti
                        className="text-black"
                        value={values[key]
                          .map((id) => {
                            const user = users.find((u) => u._id === id);
                            return user
                              ? { value: user._id, label: user.email }
                              : null;
                          })
                          .filter(Boolean)}
                        onChange={(selected) => {
                          setFieldValue(
                            key,
                            selected.map((option) => option.value)
                          );
                        }}
                      />
                    </div>
                  ))}

                  <div className="flex justify-end space-x-4 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingProject(null);
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
                    >
                      Update Project
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <FaProjectDiagram className="text-red-500 text-3xl" />
        <h2 className="text-3xl font-bold text-center text-red-500">All Projects</h2>
      </div>

      {projects.length === 0 ? (
        <p className="text-center text-gray-400">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg relative hover:shadow-red-500/20 transition"
            >
              <h3 className="text-xl font-bold text-red-400 mb-2">{project.title}</h3>
              <p className="text-gray-300 mb-3">{project.description || 'No description'}</p>

              <div className="mb-2 text-sm">
                <strong className="text-gray-400">Managers:</strong>{' '}
                {(project.managers || []).map((u) => u.email).join(', ') || 'N/A'}
              </div>
              <div className="mb-2 text-sm">
                <strong className="text-gray-400">Developers:</strong>{' '}
                {(project.developers || []).map((u) => u.email).join(', ') || 'N/A'}
              </div>
              <div className="mb-2 text-sm">
                <strong className="text-gray-400">QAs:</strong>{' '}
                {(project.qas || []).map((u) => u.email).join(', ') || 'N/A'}
              </div>

              <div className="absolute top-3 right-3 flex space-x-3">
                <button
                  onClick={() => {
                    setEditingProject(project);
                    setShowForm(true);
                  }}
                  className="text-blue-400 hover:text-blue-500 text-lg"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => confirmDelete(project._id)}
                  className="text-red-500 hover:text-red-600 text-lg"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => clickShowBug(project._id)}
                  className="text-red-500 hover:text-red-600 text-lg"
                >
                  <FaBug />

                </button>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

