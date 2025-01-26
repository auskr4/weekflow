import React, { useState, useEffect } from 'react';

type Day = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';

interface Task {
  text: string;
  completed: boolean;
}

type TasksByDay = {
  [key in Day]: Task[];
};
type DatesByDay = {
  [key in Day]: string;
};

const WeekFlow: React.FC = () => {
  const defaultTasks: string[] = [
    "Morning workout",
    "Check emails",
    "Team standup",
    "Review PRs"
  ];

  const [expandedDays, setExpandedDays] = useState<Set<Day>>(new Set(['TUESDAY']));
  const [tasks, setTasks] = useState<TasksByDay>({
    MONDAY: [{ text: "5km run", completed: true }, { text: "Read 10 pages", completed: false }, { text: "Walk the dog", completed: false }, { text: "Get groceries", completed: false }, { text: "Design a to-do app (?)", completed: false }],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: []
  });
  const [newTask, setNewTask] = useState<string>('');

  const days: Day[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (expandedDays.size === 1) {
        const selectedDay = Array.from(expandedDays)[0];
        if (e.key === 'Enter' && newTask.trim()) {
          handleAddTask(selectedDay);
        } else if (e.key === 'Backspace') {
          setNewTask(prev => prev.slice(0, -1));
        } else if (e.key.length === 1) {
          setNewTask(prev => prev + e.key);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [expandedDays, newTask]);

  const getDayDate = (day: Day): string => {
    const dates: DatesByDay = {
      MONDAY: 'January, 20 2025',
      TUESDAY: 'January, 21 2025 - 7:57PM - 84°',
      WEDNESDAY: 'January, 22 2025',
      THURSDAY: 'January, 23 2025',
      FRIDAY: 'January, 24 2025'
    };
    return dates[day];
  };

  const handleDayClick = (day: Day): void => {
    setExpandedDays(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(day)) {
        newExpanded.delete(day);
      } else {
        newExpanded.add(day);
      }
      return newExpanded;
    });
  };

  const handleAddTask = (day: Day): void => {
    if (newTask.trim()) {
      setTasks(prev => ({
        ...prev,
        [day]: [...prev[day], { text: newTask.trim(), completed: false }]
      }));
      setNewTask('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow">
        {days.map((day) => (
          <div
            key={day}
            className="cursor-pointer transition-all duration-300 ease-in-out"
            onClick={() => handleDayClick(day)}
          >
            <div className={expandedDays.has(day) ? 'bg-gray-200' : 'bg-gray-100'}>
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center">
                  <div className="font-bold text-2xl text-gray-800">{day}</div>
                  {!expandedDays.has(day) && tasks[day].length > 0 && (
                    <div className="flex gap-1 ml-2">
                      {tasks[day].map((task, index) => (
                        <div 
                          key={index}
                          className={`w-2 h-2 ${task.completed ? 'bg-orange-500' : 'bg-gray-800'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="group relative">
                  <button 
                    className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 hover:border-gray-600 hover:text-gray-600"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setTasks(prev => ({
                        ...prev,
                        [day]: [...prev[day], ...defaultTasks.map(text => ({ text, completed: false }))]
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
              {expandedDays.has(day) && (
                <div className="px-6 pb-4 space-y-3">
                  <div className="text-gray-600">{getDayDate(day)}</div>
                  
                  {tasks[day].map((task, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setTasks(prev => ({
                          ...prev,
                          [day]: prev[day].map((t, i) => 
                            i === index ? { ...t, completed: !t.completed } : t
                          )
                        }));
                      }}
                    >
                      <div 
                        className={`w-4 h-4 border rounded cursor-pointer ${task.completed ? 'bg-orange-500 border-orange-500' : 'border-gray-400'}`}
                      />
                      <span className={`flex-grow cursor-pointer ${task.completed ? 'line-through text-orange-500' : ''}`}>
                        {task.text}
                      </span>
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setTasks(prev => ({
                            ...prev,
                            [day]: prev[day].filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  <div 
                    className="text-gray-500 cursor-text" 
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    {newTask || 'Add a task...'}
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

export default WeekFlow;