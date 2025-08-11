import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { FaBug } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const BugProject = ({ onClose }) => {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:3500/project", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const validationSchema = Yup.object().shape({
    project: Yup.string().required("Project is required"),
    title: Yup.string().required("Title is required"),
    description: Yup.string(),
    deadline: Yup.date(),
    types: Yup.string().oneOf(["feature", "bug"]).required("Type is required"),
    status: Yup.string().required("Status is required"),
  });

  const statusOptions = {
    feature: ["new", "started", "completed"],
    bug: ["new", "started", "resolved"],
  };

  const initialValues = {
    project: "",
    title: "",
    description: "",
    deadline: "",
    types: "",
    status: "",
    screenshot: null,
  };

  const submitBug = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.post("http://localhost:3500/bugs", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Bug created successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to create bug");
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg w-full max-w-lg text-white border border-gray-700">
      <div className="flex items-center justify-center gap-2 mb-4">
        <FaBug className="text-red-500 text-2xl" />
        <h2 className="text-2xl font-bold">Create Bug</h2>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          submitBug(values);
          resetForm();
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-4">

            <div>
              <label className="block font-semibold text-gray-300">Select Project</label>
              <Field
                as="select"
                name="project"
                className="w-full border border-gray-600 bg-gray-800 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                onChange={(e) => {
                  const selectedProjectId = e.target.value;
                  setFieldValue("project", selectedProjectId);

                  const selectedProject = projects.find(
                    (p) => p._id === selectedProjectId
                  );
                  if (selectedProject) {
                    setFieldValue("title", selectedProject.title);
                  }
                }}
              >
                <option value="">-- Select Project --</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="project" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block font-semibold text-gray-300">Title</label>
              <Field
                type="text"
                name="title"
                className="w-full border border-gray-600 bg-gray-800 rounded-lg p-3 text-gray-400"
                readOnly
              />
              <ErrorMessage name="title" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block font-semibold text-gray-300">Description</label>
              <Field
                as="textarea"
                name="description"
                className="w-full border border-gray-600 bg-gray-800 rounded-lg p-3 text-white resize-none"
                maxLength={50}
              />
              <ErrorMessage name="description" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block font-semibold text-gray-300">Deadline</label>
              <Field
                type="date"
                name="deadline"
                className="w-full border border-gray-600 bg-gray-800 rounded-lg p-3 text-white"
              />
              <ErrorMessage name="deadline" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block font-semibold text-gray-300">Type</label>
              <Field
                as="select"
                name="types"
                className="w-full border border-gray-600 bg-gray-800 rounded-lg p-3 text-white"
              >
                <option value="">-- Select Type --</option>
                <option value="feature">Feature</option>
                <option value="bug">Bug</option>
              </Field>
              <ErrorMessage name="types" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block font-semibold text-gray-300">Status</label>
              <Field
                as="select"
                name="status"
                className="w-full border border-gray-600 bg-gray-800 rounded-lg p-3 text-white"
              >
                <option value="">-- Select Status --</option>
                {values.types &&
                  statusOptions[values.types].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
              </Field>
              <ErrorMessage name="status" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label className="block font-semibold text-gray-300">Screenshot</label>
              <input
                type="file"
                name="screenshot"
                className="w-full border border-gray-600 bg-gray-800 rounded-lg p-3 text-white"
                onChange={(e) => setFieldValue("screenshot", e.currentTarget.files[0])}
              />
            </div>

            <div className="flex justify-end gap-4 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
              >
                {isSubmitting ? "Creating..." : "Create Bug"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <ToastContainer />
    </div>
  );
};

export default BugProject;
