import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Priority } from '../types/todo';

interface Props {
  onAdd: (text: string, priority: Priority) => void;
}

const PRIORITY_CLASSES: Record<Priority, string> = {
  low: 'bg-emerald-400',
  medium: 'bg-amber-400',
  high: 'bg-red-400',
};

export default function TodoInput({ onAdd }: Props) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const priorities: { value: Priority; titleKey: string }[] = [
    { value: 'low', titleKey: 'priorityLow' },
    { value: 'medium', titleKey: 'priorityMedium' },
    { value: 'high', titleKey: 'priorityHigh' },
  ];

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text, priority);
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="flex items-center gap-3">
      <input
        data-testid="task-input"
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('addPlaceholder')}
        className="flex-1 text-sm text-gray-700 placeholder-gray-300 outline-none"
      />
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {priorities.map(p => (
          <button
            key={p.value}
            onClick={() => setPriority(p.value)}
            title={t(p.titleKey)}
            className={`w-3 h-3 rounded-full transition-all ${PRIORITY_CLASSES[p.value]} ${
              priority === p.value
                ? 'ring-2 ring-offset-1 ring-gray-400 scale-125'
                : 'opacity-30 hover:opacity-60'
            }`}
          />
        ))}
      </div>
      <button
        data-testid="add-button"
        onClick={handleAdd}
        disabled={!text.trim()}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-xl leading-none font-light"
      >
        +
      </button>
    </div>
  );
}
