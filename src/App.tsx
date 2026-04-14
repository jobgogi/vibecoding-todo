import { useTranslation } from 'react-i18next';
import { useTodos } from './hooks/useTodos';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import FilterTabs from './components/FilterTabs';
import LanguageSelector from './components/LanguageSelector';

export default function App() {
  const { t } = useTranslation();
  const {
    todos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
    activeCount,
    completedCount,
    totalCount,
  } = useTodos();

  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Language selector */}
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>

        {/* Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('appTitle')}</h1>
            {totalCount > 0 && (
              <p className="text-sm text-gray-400 mt-0.5">
                {t('completedOf', { completed: completedCount, total: totalCount })}
              </p>
            )}
          </div>
          {totalCount > 0 && (
            <div className="text-right">
              <span className="text-3xl font-bold text-indigo-500">{activeCount}</span>
              <p className="text-xs text-gray-400 mt-0.5">{t('remaining')}</p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {totalCount > 0 && (
          <div data-testid="progress-bar-wrapper" className="mb-5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              data-testid="progress-bar"
              className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Input */}
          <div className="p-4 border-b border-gray-50">
            <TodoInput onAdd={addTodo} />
          </div>

          {totalCount > 0 ? (
            <>
              {/* Filter tabs */}
              <div className="px-4 pt-3 pb-1">
                <FilterTabs filter={filter} onChange={setFilter} />
              </div>

              {/* List */}
              <div className="px-2 pb-2">
                <TodoList
                  todos={todos}
                  filter={filter}
                  onToggle={toggleTodo}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                />
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
                <span data-testid="items-left" className="text-xs text-gray-400">
                  {t('itemsLeft', { count: activeCount })}
                </span>
                {completedCount > 0 && (
                  <button
                    data-testid="clear-completed"
                    onClick={clearCompleted}
                    className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                  >
                    {t('clearCompleted')}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div data-testid="empty-state" className="px-4 py-10 text-center">
              <svg className="w-10 h-10 text-gray-100 mx-auto mb-3" viewBox="0 0 40 40" fill="none">
                <rect x="6" y="6" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
                <path d="M13 18h14M13 24h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-gray-300 text-sm">{t('emptyAll')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
