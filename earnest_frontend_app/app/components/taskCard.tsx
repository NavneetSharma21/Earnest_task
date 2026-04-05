"use client";
import { useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { codeMessages } from "@/lib/responseHandler";

export default function TaskCard({ task, refresh }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const handleUpdate = async () => {
    try {  
        const res = await api.patch(`/tasks/${task.id}`, { title });
        toast.success(res.data.message || "Task Updated successful", {
            duration: 5000, 
        });          
        setIsEditing(false);    
        refresh();
    } catch (err: any) {
        toast.error( codeMessages[err?.response?.data?.code] || "Task update failed ",
            { duration: 5000 }
        );
    }  
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">

      {/* Title */}
      {isEditing ? (
        <input
          className="w-full border px-2 py-1 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : (
        <h2 className="font-semibold text-gray-800 text-lg break-words">
          {task.title}
        </h2>
      )}

      {/* Status */}
      <p className={`text-sm mt-1 ${
        task.completed ? "text-green-600" : "text-gray-500"
      }`}>
        {task.completed ? "Completed" : "Pending"}
      </p>

      {/* Actions */}
      <div className="flex justify-between mt-4 flex-wrap gap-2">

        <button
          onClick={async () => {
            try {  
                const res = await api.patch(`/tasks/${task.id}/toggle`);
                toast.success(res.data.message || "Task status changed successful", {
                    duration: 5000, 
                });              
                refresh();
            } catch (err: any) {
                toast.error( codeMessages[err?.response?.data?.code] || "Task status change failed ",
                    { duration: 5000 }
                );
            }   
          }}
          className="text-sm px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-200"
        >
          Toggle
        </button>

        {isEditing ? (
          <button
            onClick={handleUpdate}
            className="text-sm px-3 py-1 rounded-lg bg-blue-200 text-blue-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm px-3 py-1 rounded-lg bg-yellow-200 text-yellow-600"
          >
            Edit
          </button>
        )}

        <button
          onClick={async () => {
            try {  
                const res = await api.delete(`/tasks/${task.id}`);
                toast.success(res.data.message || "Task deleted successful", {
                    duration: 5000, //5 seconds
                });              
                refresh();
            } catch (err: any) {
                toast.error( codeMessages[err?.response?.data?.code] || "Task deletion failed ",
                    { duration: 5000 }
                );
            }       
          }}
          className="text-sm px-3 py-1 rounded-lg bg-red-100 text-red-500"
        >
          Delete
        </button>

      </div>
    </div>
  );
}