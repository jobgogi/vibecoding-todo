import { useTranslation } from 'react-i18next';
import type { Filter } from '../types/todo';

interface Props {
  filter: Filter;
  onChange: (filter: Filter) => void;
}

export default function FilterTabs({ filter, onChange }: Props) {
  const { t } = useTranslation();

  const TABS: { value: Filter; label: string }[] = [
    { value: 'all', label: t('filterAll') },
    { value: 'active', label: t('filterActive') },
    { value: 'completed', label: t('filterDone') },
  ];

  return (
    <div className="flex p-1 bg-gray-100 rounded-xl gap-1">
      {TABS.map(tab => (
        <button
          key={tab.value}
          data-testid={`filter-${tab.value}`}
          onClick={() => onChange(tab.value)}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
            filter === tab.value
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
