import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


const DeveloperDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectsAndBugs();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:3500/project", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const assignedProjects = res.data.filter((project) =>
        project.developers?.some((dev) => dev._id === userId)
      );
      setProjects(assignedProjects);
      return assignedProjects;
    } catch {
      toast.error("Failed to fetch projects", { toastId: "fetchProjectsError" });
      return [];
    }
  };

  const fetchBugs = async (assignedProjects) => {
    try {
      const res = await axios.get("http://localhost:3500/bugs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const assignedBugs = res.data.filter(
        (bug) =>
          bug.assignedDeveloper?._id === userId &&
          assignedProjects.some((proj) => proj._id === bug.project?._id)
      );
      setBugs(assignedBugs);
    } catch {
      toast.error("Failed to fetch bugs", { toastId: "fetchBugsError" });
    }
  };

  const fetchProjectsAndBugs = async () => {
    setLoading(true);
    const assignedProjects = await fetchProjects();
    await fetchBugs(assignedProjects);
    setLoading(false);
  };

  const handleStatusChange = async (bug, newStatus) => {
    try {
      const formData = new FormData();
      formData.append("title", bug.title);
      formData.append("description", bug.description);
      formData.append("deadline", bug.deadline);
      formData.append("types", bug.types);
      formData.append("status", newStatus);
      formData.append("project", bug.project?._id);
      formData.append("assignedDeveloper", bug.assignedDeveloper?._id);

      if (bug.screenshot) {
        formData.append("screenshot", bug.screenshot);
      }

      await axios.put(`http://localhost:3500/bugs/${bug._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Status updated");
      fetchProjectsAndBugs();
    } catch {
      toast.error("Failed to update status");
    }
  };

  

  return (
    <div>
      

      <div className="p-6">
        {!loading ? (
          bugs.length === 0 ? (
            <p>No bugs assigned to you.</p>
          ) : (
            <table className="w-full border mt-6">
              <thead>
                <tr className="bg-gray-500">
                  <th className="border px-2 py-1">Title</th>
                  <th className="border px-2 py-1">Type</th>
                  <th className="border px-2 py-1">Description</th>
                  <th className="border px-2 py-1">Project</th>
                  <th className="border px-2 py-1">Current Status</th>
                  <th className="border px-2 py-1 ">Change Status</th>
                  <th className="border px-2 py-1">Screen Shot</th>
                </tr>
              </thead>
              <tbody>
                {bugs.map((bug) => {
                  const statusOptions =
                    bug.types === "bug"
                      ? ["new", "started", "resolved"]
                      : ["new", "started", "completed"];

                  return (
                    <tr key={bug._id}>
                      <td className="border px-2 py-1">{bug.title}</td>
                      <td className="border px-2 py-1 capitalize">{bug.types}</td>
                      <td className="border px-2 py-1">{bug.description}</td>
                      <td className="border px-2 py-1">{bug.project?.title || "N/A"}</td>
                      <td className="border px-2 py-1">{bug.status}</td>
                      <td className="border px-2 py-1">
                        <select
                          value={bug.status}
                          onChange={(e) => handleStatusChange(bug, e.target.value)}
                          className="border bg-slate-500 p-1"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border px-2 py-1"><img
                      src={`http://localhost:3500/public/${bug.screenshot}`}
                      alt="No Screenshot"
                      className="mt-2 max-h-8 "
                    /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default DeveloperDashboard;
