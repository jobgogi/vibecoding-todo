import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Todo } from '../types/todo';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_DOT: Record<string, string> = {
  low: 'bg-emerald-400',
  medium: 'bg-amber-400',
  high: 'bg-red-400',
};

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }: Props) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText);
    } else {
      setEditText(todo.text);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <div
      data-testid="todo-item"
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
        editing ? 'bg-indigo-50/70' : 'hover:bg-gray-50'
      }`}
    >
      {/* Checkbox */}
      <button
        data-testid="todo-checkbox"
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          todo.completed
            ? 'bg-indigo-500 border-indigo-500'
            : 'border-gray-200 hover:border-indigo-400'
        }`}
      >
        {todo.completed && (
          <svg
            className="w-3 h-3 text-white"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 6l3.5 3.5 4.5-5" />
          </svg>
        )}
      </button>

      {/* Priority dot */}
      <span
        data-testid="todo-priority-dot"
        className={`flex-shrink-0 w-2 h-2 rounded-full ${PRIORITY_DOT[todo.priority]}`}
      />

      {/* Text / Edit input */}
      {editing ? (
        <input
          data-testid="todo-edit-input"
          ref={inputRef}
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm text-gray-700 bg-transparent outline-none"
        />
      ) : (
        <span
          data-testid="todo-text"
          onDoubleClick={() => !todo.completed && setEditing(true)}
          className={`flex-1 text-sm select-none ${
            todo.completed ? 'line-through text-gray-300' : 'text-gray-700'
          }`}
        >
          {todo.text}
        </span>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {editing ? (
          <>
            <button
              data-testid="todo-save"
              onClick={handleSave}
              title={t('save')}
              className="w-7 h-7 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8l3.5 3.5 6.5-6.5" />
              </svg>
            </button>
            <button
              data-testid="todo-cancel"
              onClick={handleCancel}
              title={t('cancel')}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </>
        ) : (
          <>
            {!todo.completed && (
              <button
                data-testid="todo-edit-btn"
                onClick={() => setEditing(true)}
                title={t('edit')}
                className="w-7 h-7 flex items-center justify-center text-transparent group-hover:text-gray-300 hover:!text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
              >
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11.5 2.5l2 2-8 8-2.5.5.5-2.5 8-8z" />
                </svg>
              </button>
            )}
            <button
              data-testid="todo-delete"
              onClick={() => onDelete(todo.id)}
              title={t('delete')}
              className="w-7 h-7 flex items-center justify-center text-transparent group-hover:text-gray-300 hover:!text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3.5 4l.5 9h8l.5-9" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
