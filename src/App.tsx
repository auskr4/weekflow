import React, { useState, useEffect } from "react";

const App = () => {
  const defaultTasks = [
    "Morning workout",
    "Check emails",
    "Team standup",
    "Review PRs",
  ];

  const [selectedDay, setSelectedDay] = useState("TUESDAY");
  const [tasks, setTasks] = useState({
    MONDAY: [
      { text: "5km run", completed: true },
      { text: "Read 10 pages", completed: false },
      { text: "Walk the dog", completed: false },
      { text: "Get groceries", completed: false },
      { text: "Design a to-do app (?)", completed: false },
    ],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
  });
  const [newTask, setNewTask] = useState("");
  const TASK_CHAR_LIMIT = 30;

  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

  const getDayDate = (day) => {
    const dates = {
      MONDAY: "January, 20 2025",
      TUESDAY: "January, 21 2025 - 7:57PM - 84°",
      WEDNESDAY: "January, 22 2025",
      THURSDAY: "January, 23 2025",
      FRIDAY: "January, 24 2025",
    };
    return dates[day];
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleAddTask = (day) => {
    if (newTask.trim()) {
      setTasks((prev) => ({
        ...prev,
        [day]: [...prev[day], { text: newTask.trim(), completed: false }],
      }));
      setNewTask("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= TASK_CHAR_LIMIT) {
      setNewTask(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTask.trim()) {
      handleAddTask(selectedDay);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-sm mx-auto bg-white rounded-lg shadow">
        {days.map((day) => (
          <div
            key={day}
            className="cursor-pointer transition-all duration-300 ease-in-out"
            onClick={() => handleDayClick(day)}
          >
            <div
              className={selectedDay === day ? "bg-gray-200" : "bg-gray-100"}
            >
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center">
                  <div className="font-bold text-2xl text-gray-800">{day}</div>
                  {selectedDay !== day && tasks[day].length > 0 && (
                    <div className="flex gap-1 ml-2">
                      {tasks[day].map((task, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 ${
                            task.completed ? "bg-emerald-500" : "bg-orange-500"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="group relative">
                  <button
                    className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 hover:border-gray-600 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTasks((prev) => ({
                        ...prev,
                        [day]: [
                          ...prev[day],
                          ...defaultTasks.map((text) => ({
                            text,
                            completed: false,
                          })),
                        ],
                      }));
                    }}
                  >
                    +
                  </button>
                  <div className="absolute hidden group-hover:block right-0 -top-8 bg-gray-800 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
                    Add Default Tasks
                  </div>
                </div>
              </div>
              {selectedDay === day && (
                <div className="px-6 pb-4 space-y-3">
                  <div className="text-gray-600">{getDayDate(day)}</div>
                  <div className="flex flex-col gap-2">
                    {tasks[day].map((task, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 border rounded cursor-pointer ${
                            task.completed
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-gray-400"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setTasks((prev) => ({
                              ...prev,
                              [day]: prev[day].map((t, i) =>
                                i === index
                                  ? { ...t, completed: !t.completed }
                                  : t
                              ),
                            }));
                          }}
                        />
                        <span
                          className={`flex-grow ${
                            task.completed
                              ? "line-through text-emerald-500"
                              : ""
                          }`}
                        >
                          {task.text}
                        </span>
                        <button
                          className="text-orange-500 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTasks((prev) => ({
                              ...prev,
                              [day]: prev[day].filter((_, i) => i !== index),
                            }));
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={newTask}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Add a task..."
                      className={`w-full bg-transparent outline-none ${
                        newTask.length >= TASK_CHAR_LIMIT ? "text-orange-500" : "text-gray-500"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {newTask.length > 0 && (
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        ({newTask.length}/{TASK_CHAR_LIMIT})
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
