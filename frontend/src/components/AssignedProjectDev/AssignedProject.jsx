import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaProjectDiagram } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AssignedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [keyword, setKeyword] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  useEffect(() => {
    if (token && userId) {
      fetchProjects();
    } else {
      toast.error("Missing authentication token or user ID");
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:3500/project", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const assigned = response.data.filter((project) =>
        project.developers?.some((dev) => dev._id === userId)
      );
      setProjects(assigned);
      setFilteredProjects(assigned);
    } catch (error) {
      toast.error("Failed to fetch assigned projects");
    }
  };

  useEffect(() => {
    if (keyword.trim() === "") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((p) =>
          p.title.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }
  }, [keyword, projects]);

  
  const handleViewBugs = (projectId, projectTitle) => {
    navigate("/DeveloperBug", { state: { projectId, projectTitle } });
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="🔍︎ Search Project by Title..."
          className="p-2 rounded bg-gray-700 border border-gray-600 text-white w-full"
        />
      </div>

      <div className="flex items-center gap-2 mb-6">
        <FaProjectDiagram className="text-white text-2xl" />
        <h1 className="text-2xl text-white font-semibold">Assigned Projects</h1>
      </div>

      {filteredProjects.length === 0 ? (
        <p className="text-gray-400 text-center">No assigned projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj._id}
              className="bg-gray-800 text-white rounded-lg p-4 shadow-md hover:shadow-lg transition duration-200"
            >
              <h2 className="text-xl font-bold mb-2 border-b border-gray-600 pb-1">
                {proj.title}
              </h2>
              <p className="text-gray-300">{proj.description}</p>

              <button
                type="button"
                onClick={() => handleViewBugs(proj._id, proj.title)}
                className="mt-4 bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-sm"
              >
                View Bugs
              </button>
            </div>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AssignedProjects;
