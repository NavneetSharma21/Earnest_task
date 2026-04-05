"use client";
import api from "@/lib/axios";
import TaskCard from "../components/taskCard";
import TaskForm from "../components/taskForm";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { codeMessages } from "@/lib/responseHandler";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Pagination state
  const [pageNo, setPageNo] = useState(1);
  // const [limit] = useState(6);

  const router = useRouter();

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    }
  }, []);

  // Fetch Tasks with pagination + filter + search
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks", {
        params: {
          pageNo,
          // limit,
          search,
          status: filter !== "all" ? filter : undefined,
        },
      });

      setTasks(res.data.response || []);
    } catch (err) {
      toast.error("Failed to fetch tasks");
    }
  };

  // Refetch when page/filter/search changes
  useEffect(() => {
    fetchTasks();
  }, [pageNo, filter, search]);

  // Reset page when filter/search changes
  useEffect(() => {
    setPageNo(1);
  }, [search, filter]);

  // Logout
  const handleLogout = async () => {

    await api.post(
      "/auth/logout", 
      {}, 
      { withCredentials: true } // important to send cookies
    );

    localStorage.removeItem("accessToken");

    toast.success("Logged out successfully 👋", {
      duration: 3000,
    });

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Task Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-500 text-white 
            hover:bg-red-600 active:scale-95 transition"
          >
            Logout
          </button>
        </div>

        {/* Add Task */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <TaskForm
            onAdd={async (title: string) => {
              try {
                await api.post("/tasks", { title });
                toast.success("Task added Successfully ✅");
                fetchTasks();
              } catch (error: any) {
                const message =
                  codeMessages?.[error?.response?.data?.message] ||
                  error?.response?.data?.message ||
                  "Task add failed ❌";

                toast.error(message);
              }
            }}
          />
        </div>

        {/* Search */}
        <input
          className="w-full mt-4 px-4 py-3 rounded-xl border border-gray-300 
          focus:ring-2 focus:ring-gray-400 outline-none bg-white"
          placeholder="Search tasks..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter Buttons */}
        <div className="flex gap-3 mt-4">
          {["all", "completed", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl border transition ${
                filter === f
                  ? "bg-black text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Tasks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                refresh={fetchTasks}
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center">
              No tasks found
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-8">

          <button
            onClick={() => setPageNo((prev) => Math.max(prev - 1, 1))}
            disabled={pageNo === 1}
            className={`px-4 py-2 rounded-lg ${
              pageNo === 1
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Prev
          </button>

          <span className="font-medium">
            Page {pageNo}
          </span>

          <button
            onClick={() => setPageNo((prev) => prev + 1)}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
}