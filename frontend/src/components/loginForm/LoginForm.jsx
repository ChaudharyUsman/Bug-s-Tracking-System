import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';
import { FaBug, FaEnvelope, FaLock } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const initialValues = { email: '', password: '' };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:3500/authentication/login', {
        email: values.email,
        password: values.password,
      });

      toast.success("Login successful!");

      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userId', response.data.id);

      switch (response.data.role) {
        case 'admin':
          navigate('/dashboard');
          break;
        case 'manager':
          navigate('/dashboard');
          break;
        case 'qa':
          navigate('/dashboard');
          break;
        case 'dev':
          navigate('/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
    
        <div className="flex flex-col items-center mb-6">
          <div className="bg-red-600 text-white p-4 rounded-full shadow-lg">
            <FaBug size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mt-3">Bug Tracker Login</h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage your projects</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="pl-10 w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className="pl-10 w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-500"
              >
                {isSubmitting ? '⌛ Logging in..' : '➥  Login'}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-gray-400 text-xs text-center mt-6">
          © {new Date().getFullYear()} Bug Tracker. All rights reserved.
        </p>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Login;
