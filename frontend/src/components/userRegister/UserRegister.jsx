import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string()
    .oneOf(["manager", "qa", "dev"], "Invalid role")
    .required("Role is required"),
});

const CreateUser = ({ onClose }) => {
  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post(
        "http://localhost:3500/authentication/createNewUser",
        values
      );
       window.location.reload();
      toast.success("User Created Successfully!");
      resetForm();
      if (onClose) onClose();
    } catch (err) {
      toast.error("Failed to create user");
    }
  };

  return (
    <div
      className={`${
        onClose
          ? "w-full"
          : "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4"
      }`}
    >
      <div className="bg-gray-900 border border-gray-700 w-full max-w-md shadow-xl rounded-2xl p-8 text-white">
        <h2 className="text-3xl mb-6 text-center font-extrabold text-red-500">
          ➕ Create New User
        </h2>
        <Formik
          initialValues={{ name: "", email: "", password: "", role: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-5">
            
            <div>
              <label className="block font-semibold text-gray-300">Name</label>
              <Field
                name="name"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Enter full name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-300">Email</label>
              <Field
                name="email"
                type="email"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Enter email address"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-300">
                Password
              </label>
              <Field
                name="password"
                type="password"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Enter secure password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-300">Role</label>
              <Field
                as="select"
                name="role"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">Select role</option>
                <option value="manager">Manager</option>
                <option value="qa">QA</option>
                <option value="dev">Developer</option>
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg shadow-md transition duration-300"
            >
              🚀 Create User
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default CreateUser;
