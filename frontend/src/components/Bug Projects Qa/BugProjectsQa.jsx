import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  types: Yup.string().oneOf(["bug", "feature"]).required("Type is required"),
  status: Yup.string().required("Status is required"),
  assignedDeveloper: Yup.string().required("Please assign a developer"),
  project: Yup.string().required("Project is required"),
});

const BugProjects = ({ token, userId }) => {
  const [projects, setProjects] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [editBug, setEditBug] = useState(null);
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bugToDelete, setBugToDelete] = useState(null);

  token = localStorage.getItem("token");
  userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchProjects();
    fetchDevelopers();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:3500/project", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const assigned = res.data.filter((project) =>
        project.qas?.some((qa) => qa._id === userId)
      );
      setProjects(assigned);
      fetchBugs(assigned);
    } catch {
      toast.error("Failed to fetch projects");
    }
  };

  const fetchBugs = async (assignedProjects = projects) => {
    try {
      const res = await axios.get("http://localhost:3500/bugs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const assignedBugs = res.data.filter((bug) =>
        assignedProjects.some((proj) => proj._id === bug.project?._id)
      );
      setBugs(assignedBugs);
    } catch {
      toast.error("Failed to fetch bugs");
    }
  };

  const fetchDevelopers = async () => {
    try {
      const res = await axios.get("http://localhost:3500/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const devs = res.data.filter((user) => user.role === "dev");
      setDevelopers(devs);
    } catch {
      toast.error("Failed to fetch developers");
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("deadline", values.deadline);
      formData.append("types", values.types);
      formData.append("status", values.status);
      formData.append("project", values.project);
      formData.append("assignedDeveloper", values.assignedDeveloper);
      if (file) formData.append("screenshot", file);

      if (editBug) {
        await axios.put(`http://localhost:3500/bugs/${editBug._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Bug updated successfully");
      } else {
        await axios.post("http://localhost:3500/bugs", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Bug created successfully");
      }

      fetchBugs();
      resetForm();
      setEditBug(null);
      setFile(null);
      setShowForm(false);
    } catch (err) {
      console.error("Bug creation error:", err.response || err);
      toast.error(err.response?.data?.message || "Error saving bug");
    }
  };

  const confirmDelete = (id) => {
    setBugToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3500/bugs/${bugToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Bug deleted successfully");
      fetchBugs();
      setShowDeleteConfirm(false);
      setBugToDelete(null);
    } catch {
      toast.error("Error deleting bug");
    }
  };

  const handleEdit = (bug) => {
    setEditBug(bug);
    setShowForm(true);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <button
        onClick={() => {
          setEditBug(null);
          setShowForm(true);
        }}
        disabled={projects.length === 0}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:bg-gray-500 mb-4 flex items-center gap-2"
      >
        <FaPlus /> Create Bug
      </button>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this bug?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editBug ? "Edit Bug" : "Create Bug"}</h2>
              <button onClick={() => setShowForm(false)}><FaTimes /></button>
            </div>
            <Formik
              initialValues={{
                title: editBug?.title || "",
                description: editBug?.description || "",
                deadline: editBug?.deadline?.split("T")[0] || "",
                types: editBug?.types || "bug",
                status: editBug?.status || "new",
                project: editBug?.project?._id || (projects.length === 1 ? projects[0]._id : ""),
                assignedDeveloper: editBug?.assignedDeveloper?._id || "",
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => {
                const statusOptions =
                  values.types === "bug"
                    ? ["new", "started", "resolved"]
                    : ["new", "started", "completed"];

                return (
                  <Form className="space-y-2">
                    <Field name="title" placeholder="Title" className="border p-2 w-full bg-gray-700" />
                    <ErrorMessage name="title" component="div" className="text-red-400" />

                    <Field as="textarea" name="description" placeholder="Description" className="border p-2 w-full bg-gray-700" maxLength={50} />
                    <Field type="date" name="deadline" className="border p-2 w-full bg-gray-700" />

                    <Field as="select" name="types" className="border p-2 w-full bg-gray-700"
                      onChange={(e) => {
                        setFieldValue("types", e.target.value);
                        setFieldValue("status", "new");
                      }}>
                      <option value="bug">Bug</option>
                      <option value="feature">Feature</option>
                    </Field>

                    <Field as="select" name="status" className="border p-2 w-full bg-gray-700">
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Field>

                 
                    {projects.length > 1 && (
                      <>
                        <Field as="select" name="project" className="border p-2 w-full bg-gray-700">
                          <option value="">Select Project</option>
                          {projects.map((project) => (
                            <option key={project._id} value={project._id}>{project.title}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="project" component="div" className="text-red-400" />
                      </>
                    )}

                    <Field as="select" name="assignedDeveloper" className="border p-2 w-full bg-gray-700">
                      <option value="">Select Developer</option>
                      {developers.map((dev) => (
                        <option key={dev._id} value={dev._id}>{dev.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="assignedDeveloper" component="div" className="text-red-400" />

                    <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border p-2 w-full bg-gray-700" />

                    <div className="flex justify-end gap-2">
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        {editBug ? "Update" : "Create"}
                      </button>
                      <button
                        type="button"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                        onClick={() => {
                          setShowForm(false);
                          setEditBug(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      )}

      {/* Bugs Table */}
      <table className="w-full border mt-6 text-sm">
        <thead>
          <tr className="bg-gray-700">
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Status</th>
            {projects.length > 1 && <th className="border px-2 py-1">Project</th>}
            <th className="border px-2 py-1">Developer</th>
            <th className="border px-2 py-1">Screenshot</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bugs.map((bug) => (
            <tr key={bug._id} className="bg-gray-800 hover:bg-gray-700">
              <td className="border px-2 py-1">{bug.title}</td>
              <td className="border px-2 py-1 break-words max-w-xs">{bug.description}</td>
              <td className="border px-2 py-1">{bug.types}</td>
              <td className="border px-2 py-1">{bug.status}</td>
              {projects.length > 1 && (
                <td className="border px-2 py-1">{bug.project?.title}</td>
              )}
              <td className="border px-2 py-1">{bug.assignedDeveloper?.name}</td>
              <td className="border px-2 py-1">
                {bug.screenshot && (
                  <img
                    src={`http://localhost:3500/public/${bug.screenshot}`}
                    alt="screenshot"
                    className="h-10 rounded"
                  />
                )}
              </td>
              <td className="border px-2 py-1 flex gap-2 justify-center">
                <button onClick={() => handleEdit(bug)} className="text-yellow-400"><FaEdit /></button>
                <button onClick={() => confirmDelete(bug._id)} className="text-red-500"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BugProjects;
