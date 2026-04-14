import { useTranslation } from 'react-i18next';
import type { Todo, Filter } from '../types/todo';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  filter: Filter;
  onToggle: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

const EMPTY_KEY: Record<Filter, string> = {
  all: 'emptyAll',
  active: 'emptyActive',
  completed: 'emptyCompleted',
};

export default function TodoList({ todos, filter, onToggle, onUpdate, onDelete }: Props) {
  const { t } = useTranslation();

  if (todos.length === 0) {
    return (
      <div data-testid="empty-state" className="py-8 text-center">
        <svg className="w-10 h-10 text-gray-100 mx-auto mb-3" viewBox="0 0 40 40" fill="none">
          <rect x="6" y="6" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
          <path d="M13 18h14M13 24h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="text-gray-300 text-sm">{t(EMPTY_KEY[filter])}</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
