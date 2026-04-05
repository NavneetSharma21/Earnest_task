import { useState } from "react";

export default function TaskForm({ onAdd }: any) {
  const [title, setTitle] = useState("");

  const handleAdd = async () => {
    if (!title.trim()) return;
    await onAdd(title);
    setTitle("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      
      {/* Input */}
      <input
        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-400 outline-none"
        placeholder="Enter task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Button */}
      <button
        type="button"
        onClick={handleAdd}
        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 
            hover:scale-105 hover:shadow-lg active:scale-95 transition-all text-white font-medium whitespace-nowrap"
        >
        Add Task
      </button>

    </div>
  );
}