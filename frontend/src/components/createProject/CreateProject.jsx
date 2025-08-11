import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast ,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaProjectDiagram } from "react-icons/fa";

const CreateProject = ({ onClose }) => {
  const token = localStorage.getItem("token");

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Project title is required"),
    description: Yup.string().max(500, "Description is too long"),
  });

  const initialFormValues = {
    title: "",
    description: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post("http://localhost:3500/project", values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Project created successfully!");
      resetForm();
      if (onClose) onClose();
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl shadow-lg w-full max-w-md">
    
      <div className="flex items-center justify-center gap-3 mb-6">
        <FaProjectDiagram className="text-red-500 text-3xl" />
        <h2 className="text-3xl font-bold text-white">Create Project</h2>
      </div>

      <Formik
        initialValues={initialFormValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            
            <div>
              <label className="block text-gray-300 mb-1 font-semibold">Project Title</label>
              <Field
                name="title"
                placeholder="Enter project title"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-semibold">Description</label>
              <Field
                as="textarea"
                name="description"
                placeholder="Project description (optional)"
                rows="4"
                maxLength={50}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none resize-none"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>

            <div className="flex justify-end gap-4 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-5 rounded-lg shadow transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg shadow transition"
              >
                {isSubmitting ? "⌛ Creating..." : "Create Project"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <ToastContainer/>
    </div>
  );
};

export default CreateProject;
