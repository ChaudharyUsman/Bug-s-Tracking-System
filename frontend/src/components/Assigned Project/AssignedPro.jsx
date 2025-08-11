import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaProjectDiagram } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const AssignedProjects = ({ token, userId, onProjectClick }) => {
  const [projects, setProjects] = useState([]);
  token = localStorage.getItem("token");
  userId = localStorage.getItem("userId");

  useEffect(() => {
    if (token && userId) {
      fetchProjects();
    } else {
      toast.error("Missing authentication token or user ID");
    }
  }, [token, userId]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:3500/project", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const assigned = response.data.filter((project) =>
        project.qas?.some((qa) => qa._id === userId)
      );

      setProjects(assigned);
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      toast.error("Failed to fetch assigned projects");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center gap-2 mb-6">
        <FaProjectDiagram className="text-white text-2xl" />
        <h1 className="text-2xl text-white font-semibold">
          Assigned Projects
        </h1>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-400 text-center">No assigned projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj._id}
              onClick={() => onProjectClick?.(proj)}
              className="bg-gray-800 text-white rounded-lg p-4 shadow-md hover:shadow-lg hover:bg-gray-700 transition duration-200 cursor-pointer"
            >
              <h2 className="text-xl font-bold mb-2 border-b border-gray-600 pb-1">
                {proj.title}
              </h2>
              <p className="text-gray-300">{proj.description}</p>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AssignedProjects;
