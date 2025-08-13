import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaBug, FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
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

      navigate('/dashboard');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      
      {/* Floating Bug Icon */}
      <motion.div
        className="absolute top-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="bg-red-600 text-white p-4 rounded-full shadow-lg">
          <FaBug size={32} />
        </div>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 relative overflow-hidden"
      >
        {/* Glow Background */}
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 bg-red-700 rounded-full blur-3xl opacity-20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        ></motion.div>

        <div className="flex flex-col items-center mb-6 relative z-10">
          <h2 className="text-3xl font-bold text-white mt-3">Bug Tracker Login</h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage your projects</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="relative z-10">
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="pl-10 w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 group-hover:border-red-400"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative group">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className="pl-10 w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 group-hover:border-red-400"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-500"
              >
                {isSubmitting ? '⌛ Logging in..' : '➥ Login'}
              </motion.button>
            </Form>
          )}
        </Formik>

        <p className="text-gray-400 text-xs text-center mt-6 relative z-10">
          © {new Date().getFullYear()} Bug Tracker. All rights reserved.
        </p>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default Login;
