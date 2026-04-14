import { useState, useEffect } from 'react';
import type { Todo, Priority, Filter } from '../types/todo';

const STORAGE_KEY = 'my-tasks';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function useTodos() {
  const [allTodos, setAllTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Todo[]) : [];
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTodos));
  }, [allTodos]);

  const addTodo = (text: string, priority: Priority) => {
    if (!text.trim()) return;
    setAllTodos(prev => [
      {
        id: generateId(),
        text: text.trim(),
        completed: false,
        priority,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  };

  const toggleTodo = (id: string) => {
    setAllTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const updateTodo = (id: string, text: string) => {
    if (!text.trim()) return;
    setAllTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, text: text.trim() } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setAllTodos(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setAllTodos(prev => prev.filter(t => !t.completed));
  };

  const filteredTodos = allTodos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = allTodos.filter(t => !t.completed).length;
  const completedCount = allTodos.filter(t => t.completed).length;

  return {
    todos: filteredTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
    activeCount,
    completedCount,
    totalCount: allTodos.length,
  };
}
