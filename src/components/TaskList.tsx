import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Task } from './PomodoroApp';

interface TaskListProps {
  onStartTask: (task: Task) => void;
  activeTask: Task | null;
  onTimerStart: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onStartTask, activeTask, onTimerStart }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);

  const addTask = () => {
    if (newTaskName.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        name: newTaskName.trim(),
        estimatedPomodoros: newTaskPomodoros,
        completedPomodoros: 0,
        completed: false
      };
      setTasks([...tasks, newTask]);
      setNewTaskName('');
      setNewTaskPomodoros(1);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const incrementPomodoro = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id 
        ? { 
            ...task, 
            completedPomodoros: Math.min(task.completedPomodoros + 1, task.estimatedPomodoros),
            completed: task.completedPomodoros + 1 >= task.estimatedPomodoros
          } 
        : task
    ));
  };

  const handleStartTask = (task: Task) => {
    onStartTask(task);
    onTimerStart();
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white p-6">
      {/* Your Tasks Section */}
      {tasks.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg bg-white/10 border border-white/20 ${
                  task.completed ? 'opacity-60' : ''
                } ${activeTask?.id === task.id ? 'ring-2 ring-white/50' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/60 flex-shrink-0" />
                    )}
                    <span className={task.completed ? 'line-through' : ''}>{task.name}</span>
                  </button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="text-white/60 hover:text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white/80">
                    {task.completedPomodoros} / {task.estimatedPomodoros} pomodoros
                  </span>
                  
                  {!task.completed && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => incrementPomodoro(task.id)}
                        className="bg-white/20 hover:bg-white/30 text-white text-xs px-2 py-1"
                        disabled={task.completedPomodoros >= task.estimatedPomodoros}
                      >
                        +1 Pomodoro
                      </Button>
                      <Button
                        onClick={() => handleStartTask(task)}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1"
                        disabled={activeTask?.id === task.id}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        {activeTask?.id === task.id ? 'Active' : 'Start'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-2 bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white/60 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(task.completedPomodoros / task.estimatedPomodoros) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Task Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <div className="space-y-3">
          <div>
            <Label htmlFor="taskName" className="text-white">Task Name</Label>
            <Input
              id="taskName"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Enter task name..."
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
          </div>
          
          <div>
            <Label htmlFor="pomodoros" className="text-white">Estimated Pomodoros</Label>
            <Input
              id="pomodoros"
              type="number"
              min="1"
              max="20"
              value={newTaskPomodoros}
              onChange={(e) => setNewTaskPomodoros(parseInt(e.target.value) || 1)}
              className="bg-white/10 border-white/30 text-white"
            />
          </div>

          <Button
            onClick={addTask}
            className="w-full bg-white/20 hover:bg-white/30 text-white"
            disabled={!newTaskName.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {tasks.length === 0 && (
        <p className="text-white/60 text-center py-8">No tasks yet. Add one to get started!</p>
      )}
    </Card>
  );
};
