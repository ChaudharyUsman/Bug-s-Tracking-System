import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const STATUS_OPTIONS = {
  bug: ["new", "started", "resolved"],
  feature: ["new", "started", "completed"],
};

const BugList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { projectId, projectTitle } = location.state || {};
  const [bugs, setBugs] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadBugs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3500/bugs?projectId=${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBugs(response.data);
      } catch (error) {
        toast.error("Failed to load bugs");
        console.error(error);
      }
    };

    if (projectId) loadBugs();
  }, [projectId, token]);

  useEffect(() => {
    if (!projectId) {
      toast.error("No project selected.");
      navigate(-1);
    }
  }, [projectId, navigate]);

  const handleStatusChange = async (bugId, newStatus) => {
    const bug = bugs.find((b) => b._id === bugId);
    const oldStatus = bug.status;

    setUpdatingId(bugId);
    setBugs((prev) =>
      prev.map((b) => (b._id === bugId ? { ...b, status: newStatus } : b))
    );

    try {
      await axios.put(
        `http://localhost:3500/bugs/${bugId}`,
        {
          title: bug.title,
          description: bug.description,
          deadline: bug.deadline,
          types: bug.types,
          status: newStatus,
          project: bug.project?._id,
          assignedDeveloper: bug.assignedDeveloper?._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Status updated");
    } catch (err) {
      setBugs((prev) =>
        prev.map((b) => (b._id === bugId ? { ...b, status: oldStatus } : b))
      );
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">
          Bugs for Project: {projectTitle || "Unknown"}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white text-sm"
        >
          Back
        </button>
      </div>

      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
        {bugs.length === 0 ? (
          <p className="text-gray-400">No bugs reported for this project.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {bugs.map((bug) => {
              const statusOptions = STATUS_OPTIONS[bug.types] || [];

              return (
                <div key={bug._id} className="bg-gray-700 p-4 rounded shadow space-y-2">
                  <h3 className="font-bold text-lg">{bug.title}</h3>
                  <p className="text-gray-300">{bug.description}</p>

                  <p className="text-sm text-gray-400">
                    <strong>Project:</strong> {bug.project?.title || "Unknown"}
                  </p>

                  <p className="text-sm text-gray-400 capitalize">
                    <strong>Type:</strong> {bug.types}
                  </p>

                  <p className="text-sm text-gray-400">
                    <strong>Status:</strong> {bug.status}
                  </p>

                  <div className="flex items-center gap-2">
                    <label htmlFor={`status-${bug._id}`} className="text-sm">
                      <strong>Change Status:</strong>
                    </label>
                    <select
                      id={`status-${bug._id}`}
                      value={bug.status}
                      onChange={(e) => handleStatusChange(bug._id, e.target.value)}
                      disabled={updatingId === bug._id}
                      className="bg-gray-600 text-white p-1 rounded"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {bug.screenshot && (
                    <div>
                      <p className="text-sm text-gray-400"><strong>Screenshot:</strong></p>
                      <img
                        src={`http://localhost:3500/public/${bug.screenshot}`}
                        alt="Bug Screenshot"
                        className="mt-1 max-h-40 rounded border border-gray-500"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BugList;
