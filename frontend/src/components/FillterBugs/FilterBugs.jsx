import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaBug } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";

const BugList = () => {
  const { projectId } = useParams();
  const token = localStorage.getItem("token");

  const [bugs, setBugs] = useState([]);
  const [allBugs, setAllBugs] = useState([]);
  const [editBug, setEditBug] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    types: "",
    status: "",
    project: projectId || "",
    screenshot: null,
    existingScreenshot: "",
  });
  const [bugToDelete, setBugToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();

  const fetchBugs = async () => {
    try {
      const url = projectId
        ? `http://localhost:3500/bugs?projectId=${projectId}`
        : "http://localhost:3500/bugs";
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBugs(res.data);
      setAllBugs(res.data);
    } catch {
      toast.error("Failed to fetch bugs");
    }
  };

  useEffect(() => {
    fetchBugs();
  }, [projectId]);

  useEffect(() => {
    if (keyword.trim() === '') {
      setBugs(allBugs);
    } else {
      const filtered = allBugs.filter((p) =>
        p.title.toLowerCase().includes(keyword.toLowerCase())
      );
      setBugs(filtered);
    }
  }, [keyword, allBugs]);

 

  const confirmDelete = (id) => {
    setBugToDelete(id);
    setShowDeleteConfirm(true);
  };

  const deleteBug = async () => {
    if (!bugToDelete) return;
    try {
      await axios.delete(`http://localhost:3500/bugs/${bugToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Bug deleted successfully");
      setShowDeleteConfirm(false);
      setBugToDelete(null);
      fetchBugs();
    } catch {
      toast.error("Failed to delete bug");
    }
  };

  const startEdit = (bug) => {
    setEditBug(bug._id);
    setFormData({
      title: bug.title,
      description: bug.description,
      deadline: bug.deadline ? bug.deadline.split("T")[0] : "",
      types: bug.types,
      status: bug.status,
      project: bug.project?._id || bug.project || projectId || "",
      screenshot: null,
      existingScreenshot: bug.screenshot || "",
    });
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    deadline: Yup.date().required("Deadline is required"),
    types: Yup.string().oneOf(["feature", "bug"], "Invalid type").required(),
    status: Yup.string().required("Status is required"),
  });

  const handleUpdate = async (values) => {
    try {
      const fd = new FormData();
      fd.append("title", values.title);
      fd.append("description", values.description);
      fd.append("deadline", values.deadline);
      fd.append("types", values.types);
      fd.append("status", values.status);
      fd.append("project", values.project);

      if (values.screenshot) {
        fd.append("screenshot", values.screenshot);
      }

      await axios.put(`http://localhost:3500/bugs/${editBug}`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Bug updated successfully");
      setEditBug(null);
      fetchBugs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update bug");
    }
  };
  const handleBackDashBoard = async () => {
    navigate('/dashboard')
  };
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <ToastContainer />
      <div className="mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by bug title..."
          className="p-2 rounded bg-gray-700 border border-gray-600 text-white w-full"
        />
      </div>
      <form className="flex gap-2 mb-6">

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
          onClick={handleBackDashBoard}
        >
          Back To Dashboard
        </button>
      </form>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-full border border-gray-700 text-center">
            <h3 className="text-lg font-bold text-red-400 mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this bug? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setBugToDelete(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={deleteBug}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center mb-6 gap-2">
        <FaBug className="text-red-500 text-3xl" />
        <h1 className="text-3xl font-bold">Bugs for Project</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bugs.length === 0 && (
          <p className="col-span-full text-center text-gray-400">No bugs found.</p>
        )}

        {bugs.map((bug) => (
          <div
            key={bug._id}
            className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700 hover:border-red-500 transition"
          >
            <h2 className="text-xl font-semibold text-red-400">{bug.title}</h2>
            <p className="text-gray-300 mt-1">{bug.description}</p>
            <p className="text-sm text-gray-400 mt-2">Status: {bug.status}</p>
            <p className="text-sm text-gray-400">Type: {bug.types}</p>

            {bug.screenshot && (
              <img
                src={`http://localhost:3500/public/${bug.screenshot}`}
                alt="Screenshot"
                className="mt-3 w-full h-32 object-cover rounded border border-gray-700"
              />
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => startEdit(bug)}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-500"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => confirmDelete(bug._id)}
                className="flex items-center gap-2 text-red-500 hover:text-red-600"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editBug && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <Formik
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={handleUpdate}
            enableReinitialize
          >
            {({ setFieldValue, values }) => (
              <Form className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl text-white border border-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-center text-red-400">Edit Bug</h2>

                <Field
                  name="title"
                  placeholder="Title"
                  className="border border-gray-600 bg-gray-900 p-3 w-full mb-3 rounded text-white"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-400 text-sm"
                />

                <Field
                  as="textarea"
                  name="description"
                  placeholder="Description"
                  className="border border-gray-600 bg-gray-900 p-3 w-full mb-3 rounded text-white"
                  maxLength={50}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-400 text-sm"
                />

                <Field
                  type="date"
                  name="deadline"
                  className="border border-gray-600 bg-gray-900 p-3 w-full mb-3 rounded text-white"
                />
                <ErrorMessage
                  name="deadline"
                  component="div"
                  className="text-red-400 text-sm"
                />

                <Field
                  as="select"
                  name="types"
                  className="border border-gray-600 bg-gray-900 p-3 w-full mb-3 rounded text-white"
                  onChange={(e) => {
                    setFieldValue("types", e.target.value);
                    setFieldValue("status", "");
                  }}
                >
                  <option value="">Select Type</option>
                  <option value="feature">Feature</option>
                  <option value="bug">Bug</option>
                </Field>
                <ErrorMessage
                  name="types"
                  component="div"
                  className="text-red-400 text-sm"
                />

                <Field
                  as="select"
                  name="status"
                  className="border border-gray-600 bg-gray-900 p-3 w-full mb-3 rounded text-white"
                  disabled={!values.types}
                >
                  <option value="">Select Status</option>
                  {values.types === "feature" && (
                    <>
                      <option value="new">New</option>
                      <option value="started">Started</option>
                      <option value="completed">Completed</option>
                    </>
                  )}
                  {values.types === "bug" && (
                    <>
                      <option value="new">New</option>
                      <option value="started">Started</option>
                      <option value="resolved">Resolved</option>
                    </>
                  )}
                </Field>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="text-red-400 text-sm"
                />

                {formData.existingScreenshot && !formData.screenshot && (
                  <div className="mb-3">
                    <p className="text-gray-400 text-sm mb-2">Current screenshot:</p>
                    <img
                      src={`http://localhost:3500/public/${formData.existingScreenshot}`}
                      alt="Current Screenshot"
                      className="w-full h-24 object-cover rounded border border-gray-700"
                    />
                  </div>
                )}

                <input
                  type="file"
                  name="screenshot"
                  onChange={(e) => setFieldValue("screenshot", e.target.files[0])}
                  className="border border-gray-600 bg-gray-900 p-3 w-full mb-3 rounded text-white"
                />

                <div className="flex justify-between mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditBug(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default BugList;
