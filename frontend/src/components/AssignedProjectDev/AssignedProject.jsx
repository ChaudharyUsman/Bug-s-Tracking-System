import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaProjectDiagram } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const AssignedProjects = () => {
  const [projects, setProjects] = useState([]);  
  const [filteredProjects, setFilteredProjects] = useState([]); 
  const [selectedProject, setSelectedProject] = useState(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [keyword, setKeyword] = useState("");

  const statusOptions = ["new", "started", "resolve"];
  const typeOptions = ["bug", "feature"]; 

  useEffect(() => {
    if (token && userId) {
      fetchProjects();
    } else {
      toast.error("Missing authentication token or user ID");
    }
  }, []);

  useEffect(() => {
    if (keyword.trim() === "") {
      setFilteredProjects(projects); 
    } else {
      const filtered = projects.filter((p) =>
        p.title.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredProjects(filtered); 
    }
  }, [keyword, projects]);

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
      console.error("Fetch error:", error.response?.data || error.message);
      toast.error("Failed to fetch assigned projects");
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3500/project/${projectId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Project status updated");
      fetchProjects();  
      setSelectedProject((prev) =>
        prev && prev._id === projectId
          ? { ...prev, status: newStatus }
          : prev
      );
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      toast.error("Failed to update project status");
    }
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
        <h1 className="text-2xl text-white font-semibold">
          Assigned Projects
        </h1>
      </div>

      {filteredProjects.length === 0 ? (
        <p className="text-gray-400 text-center">No assigned projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj._id}
              onClick={() => setSelectedProject(proj)}
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

      {/* Selected Project */}
      {selectedProject && (
        <div className="mt-8 bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
            Project Details
          </h2>
          <p className="mb-2">
            <strong>Title:</strong> {selectedProject.title}
          </p>
          <p className="mb-2">
            <strong>Description:</strong> {selectedProject.description}
          </p>

          <div className="mb-4">
            <label className="block mb-1">Type</label>
            <select
              value={selectedProject.type || ""}
              disabled
              className="bg-gray-700 p-2 rounded w-full text-white cursor-not-allowed"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Status</label>
            <select
              value={selectedProject.status}
              onChange={(e) =>
                handleStatusChange(selectedProject._id, e.target.value)
              }
              className="bg-gray-700 p-2 rounded w-full text-white"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <button
            className="mt-4 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            onClick={() => setSelectedProject(null)}
          >
            Close
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AssignedProjects;
