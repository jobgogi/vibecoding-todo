import { test, expect, type Page } from '@playwright/test';

/** Navigate with a clean English state (addInitScript: runs on every navigation including reload) */
async function goto(page: Page) {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('lang', 'en');
  });
  await page.goto('/');
}

/**
 * Navigate once cleanly without registering a persistent initScript.
 * Safe for tests that call page.reload() and expect localStorage to persist.
 */
async function gotoOnce(page: Page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('lang', 'en');
  });
  await page.reload(); // picks up lang='en'
}

async function addTodo(page: Page, text: string) {
  await page.getByTestId('task-input').fill(text);
  await page.keyboard.press('Enter');
}

// ---------------------------------------------------------------------------
test.describe('Empty state', () => {
  test.beforeEach(async ({ page }) => { await goto(page); });

  test('shows empty state on first visit', async ({ page }) => {
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  test('shows task input', async ({ page }) => {
    await expect(page.getByTestId('task-input')).toBeVisible();
  });

  test('add button is disabled when input is empty', async ({ page }) => {
    await expect(page.getByTestId('add-button')).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
test.describe('Adding tasks', () => {
  test.beforeEach(async ({ page }) => { await goto(page); });

  test('adds a task by pressing Enter', async ({ page }) => {
    await addTodo(page, 'Buy groceries');
    await expect(page.getByText('Buy groceries')).toBeVisible();
  });

  test('adds a task by clicking the add button', async ({ page }) => {
    await page.getByTestId('task-input').fill('Walk the dog');
    await page.getByTestId('add-button').click();
    await expect(page.getByText('Walk the dog')).toBeVisible();
  });

  test('clears input after adding', async ({ page }) => {
    await addTodo(page, 'Test task');
    await expect(page.getByTestId('task-input')).toHaveValue('');
  });

  test('does not add a whitespace-only task', async ({ page }) => {
    await page.getByTestId('task-input').fill('   ');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('todo-item')).toHaveCount(0);
  });

  test('can add multiple tasks', async ({ page }) => {
    await addTodo(page, 'Task A');
    await addTodo(page, 'Task B');
    await addTodo(page, 'Task C');
    await expect(page.getByTestId('todo-item')).toHaveCount(3);
  });
});

// ---------------------------------------------------------------------------
test.describe('Completing tasks', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
    await addTodo(page, 'My task');
  });

  test('marks task as complete', async ({ page }) => {
    await page.getByTestId('todo-checkbox').click();
    await expect(page.getByTestId('todo-text')).toHaveClass(/line-through/);
  });

  test('unchecks a completed task', async ({ page }) => {
    await page.getByTestId('todo-checkbox').click();
    await page.getByTestId('todo-checkbox').click();
    await expect(page.getByTestId('todo-text')).not.toHaveClass(/line-through/);
  });

  test('checkbox turns indigo when completed', async ({ page }) => {
    await page.getByTestId('todo-checkbox').click();
    await expect(page.getByTestId('todo-checkbox')).toHaveClass(/bg-indigo-500/);
  });
});

// ---------------------------------------------------------------------------
test.describe('Editing tasks', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
    await addTodo(page, 'Original text');
  });

  test('enters edit mode on double-click', async ({ page }) => {
    await page.getByTestId('todo-text').dblclick();
    await expect(page.getByTestId('todo-edit-input')).toBeVisible();
  });

  test('enters edit mode via edit button', async ({ page }) => {
    await page.getByTestId('todo-edit-btn').click({ force: true });
    await expect(page.getByTestId('todo-edit-input')).toBeVisible();
  });

  test('saves updated text on Enter', async ({ page }) => {
    await page.getByTestId('todo-text').dblclick();
    await page.getByTestId('todo-edit-input').fill('Updated text');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Updated text')).toBeVisible();
    await expect(page.getByText('Original text')).not.toBeVisible();
  });

  test('cancels edit on Escape, restoring original text', async ({ page }) => {
    await page.getByTestId('todo-text').dblclick();
    await page.getByTestId('todo-edit-input').fill('Abandoned text');
    await page.keyboard.press('Escape');
    await expect(page.getByText('Original text')).toBeVisible();
    await expect(page.getByText('Abandoned text')).not.toBeVisible();
  });

  test('saves via save button', async ({ page }) => {
    await page.getByTestId('todo-text').dblclick();
    await page.getByTestId('todo-edit-input').fill('Saved via button');
    await page.getByTestId('todo-save').click();
    await expect(page.getByText('Saved via button')).toBeVisible();
  });

  test('cancels via cancel button', async ({ page }) => {
    await page.getByTestId('todo-text').dblclick();
    await page.getByTestId('todo-edit-input').fill('Cancelled text');
    await page.getByTestId('todo-cancel').click();
    await expect(page.getByText('Original text')).toBeVisible();
  });

  test('completed task cannot be edited by double-click', async ({ page }) => {
    await page.getByTestId('todo-checkbox').click();
    await page.getByTestId('todo-text').dblclick();
    await expect(page.getByTestId('todo-edit-input')).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
test.describe('Deleting tasks', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
    await addTodo(page, 'Delete me');
  });

  test('deletes a task', async ({ page }) => {
    await page.getByTestId('todo-delete').click({ force: true });
    await expect(page.getByText('Delete me')).not.toBeVisible();
  });

  test('shows empty state after deleting the last task', async ({ page }) => {
    await page.getByTestId('todo-delete').click({ force: true });
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  test('deletes the correct task among many', async ({ page }) => {
    await addTodo(page, 'Keep me');
    // List order newest-first: [Keep me, Delete me]
    await page.getByTestId('todo-delete').last().click({ force: true });
    await expect(page.getByText('Keep me')).toBeVisible();
    await expect(page.getByText('Delete me')).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
test.describe('Filtering', () => {
  // Adds Task 1, Task 2, Task 3 → list is [Task 3, Task 2, Task 1]
  // Completes Task 3 (first/newest)
  test.beforeEach(async ({ page }) => {
    await goto(page);
    await addTodo(page, 'Task 1');
    await addTodo(page, 'Task 2');
    await addTodo(page, 'Task 3');
    await page.getByTestId('todo-checkbox').first().click(); // complete Task 3
  });

  test('All filter shows all tasks', async ({ page }) => {
    await page.getByTestId('filter-all').click();
    await expect(page.getByTestId('todo-item')).toHaveCount(3);
  });

  test('Active filter shows only incomplete tasks', async ({ page }) => {
    await page.getByTestId('filter-active').click();
    await expect(page.getByTestId('todo-item')).toHaveCount(2);
  });

  test('Done filter shows only completed tasks', async ({ page }) => {
    await page.getByTestId('filter-completed').click();
    await expect(page.getByTestId('todo-item')).toHaveCount(1);
  });

  test('Active filter shows empty state when all tasks completed', async ({ page }) => {
    // Task 3 already completed in beforeEach; complete Task 2 (index 1) and Task 1 (index 2)
    await page.getByTestId('todo-checkbox').nth(1).click();
    await page.getByTestId('todo-checkbox').nth(2).click();
    await page.getByTestId('filter-active').click();
    await expect(page.getByTestId('todo-item')).toHaveCount(0);
    await expect(page.getByText('All tasks completed!')).toBeVisible();
  });

  test('Done filter shows empty state when no tasks completed', async ({ page }) => {
    // Uncheck Task 3
    await page.getByTestId('todo-checkbox').first().click();
    await page.getByTestId('filter-completed').click();
    await expect(page.getByText('No completed tasks yet.')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
test.describe('Clear completed', () => {
  // List newest-first: [Task B, Task A]; completes Task B (first)
  test.beforeEach(async ({ page }) => {
    await goto(page);
    await addTodo(page, 'Task A');
    await addTodo(page, 'Task B');
    await page.getByTestId('todo-checkbox').first().click(); // complete Task B
  });

  test('clear completed button is visible when there are completed tasks', async ({ page }) => {
    await expect(page.getByTestId('clear-completed')).toBeVisible();
  });

  test('clears all completed tasks and leaves incomplete ones', async ({ page }) => {
    await page.getByTestId('clear-completed').click();
    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    await expect(page.getByText('Task A')).toBeVisible();
  });

  test('clear completed button disappears after clearing', async ({ page }) => {
    await page.getByTestId('clear-completed').click();
    await expect(page.getByTestId('clear-completed')).not.toBeVisible();
  });

  test('clear completed button is not visible when no completed tasks', async ({ page }) => {
    // Uncheck Task B
    await page.getByTestId('todo-checkbox').first().click();
    await expect(page.getByTestId('clear-completed')).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
test.describe('Stats', () => {
  // Adds Task 1, Task 2, Task 3 → list is [Task 3, Task 2, Task 1]
  test.beforeEach(async ({ page }) => {
    await goto(page);
    await addTodo(page, 'Task 1');
    await addTodo(page, 'Task 2');
    await addTodo(page, 'Task 3');
  });

  test('shows correct items left count', async ({ page }) => {
    await expect(page.getByTestId('items-left')).toContainText('3 items left');
  });

  test('updates items left count after completing a task', async ({ page }) => {
    await page.getByTestId('todo-checkbox').first().click();
    await expect(page.getByTestId('items-left')).toContainText('2 items left');
  });

  test('uses singular form for 1 item left', async ({ page }) => {
    // Complete Task 3 (index 0) and Task 2 (index 1) → 1 item (Task 1) remains
    await page.getByTestId('todo-checkbox').nth(0).click();
    await page.getByTestId('todo-checkbox').nth(1).click();
    await expect(page.getByTestId('items-left')).toContainText('1 item left');
  });

  test('progress bar wrapper is visible', async ({ page }) => {
    await expect(page.getByTestId('progress-bar-wrapper')).toBeVisible();
  });

  test('progress bar width increases as tasks are completed', async ({ page }) => {
    const getWidth = () =>
      page.getByTestId('progress-bar').evaluate(el => (el as HTMLElement).style.width);

    const before = await getWidth();
    await page.getByTestId('todo-checkbox').first().click();
    const after = await getWidth();

    expect(before).toBe('0%');
    expect(after).not.toBe('0%');
  });
});

// ---------------------------------------------------------------------------
test.describe('Priority', () => {
  test.beforeEach(async ({ page }) => { await goto(page); });

  test('default priority is medium (amber dot)', async ({ page }) => {
    await addTodo(page, 'Medium task');
    await expect(page.getByTestId('todo-priority-dot').first()).toHaveClass(/bg-amber-400/);
  });

  test('can set high priority (red dot)', async ({ page }) => {
    await page.getByTitle('High priority').click();
    await addTodo(page, 'Urgent task');
    await expect(page.getByTestId('todo-priority-dot').first()).toHaveClass(/bg-red-400/);
  });

  test('can set low priority (green dot)', async ({ page }) => {
    await page.getByTitle('Low priority').click();
    await addTodo(page, 'Low priority task');
    await expect(page.getByTestId('todo-priority-dot').first()).toHaveClass(/bg-emerald-400/);
  });
});

// ---------------------------------------------------------------------------
test.describe('Persistence', () => {
  // Use gotoOnce so page.reload() does NOT re-run localStorage.clear()
  test('persists tasks across page reload', async ({ page }) => {
    await gotoOnce(page);
    await addTodo(page, 'Persistent task');
    await page.reload();
    await expect(page.getByText('Persistent task')).toBeVisible();
  });

  test('persists completed state across page reload', async ({ page }) => {
    await gotoOnce(page);
    await addTodo(page, 'Complete me');
    await page.getByTestId('todo-checkbox').click();
    await page.reload();
    await expect(page.getByTestId('todo-text')).toHaveClass(/line-through/);
  });

  test('persists multiple tasks across reload', async ({ page }) => {
    await gotoOnce(page);
    await addTodo(page, 'Alpha');
    await addTodo(page, 'Beta');
    await addTodo(page, 'Gamma');
    await page.reload();
    await expect(page.getByTestId('todo-item')).toHaveCount(3);
  });
});
