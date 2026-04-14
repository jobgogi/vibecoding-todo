import { test, expect, type Page } from '@playwright/test';

async function gotoWithLang(page: Page, lang: string) {
  await page.addInitScript((l: string) => {
    localStorage.clear();
    localStorage.setItem('lang', l);
  }, lang);
  await page.goto('/');
}

async function addTodo(page: Page, text: string) {
  await page.getByTestId('task-input').fill(text);
  await page.keyboard.press('Enter');
}

test.describe('Language switching', () => {
  test('defaults to English when lang=en', async ({ page }) => {
    await gotoWithLang(page, 'en');
    await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible();
  });

  test('shows Korean title when lang=ko', async ({ page }) => {
    await gotoWithLang(page, 'ko');
    await expect(page.getByRole('heading', { name: '내 할 일' })).toBeVisible();
  });

  test('shows Japanese title when lang=ja', async ({ page }) => {
    await gotoWithLang(page, 'ja');
    await expect(page.getByRole('heading', { name: 'タスク一覧' })).toBeVisible();
  });

  test('shows Chinese title when lang=zh', async ({ page }) => {
    await gotoWithLang(page, 'zh');
    await expect(page.getByRole('heading', { name: '我的任务' })).toBeVisible();
  });

  test('switches language on button click', async ({ page }) => {
    await gotoWithLang(page, 'en');
    await page.getByTestId('lang-ko').click();
    await expect(page.getByRole('heading', { name: '내 할 일' })).toBeVisible();
  });

  test('language selection persists across reload', async ({ page }) => {
    // Use evaluate (not addInitScript) so reload does not re-clear localStorage
    await page.goto('/');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('lang', 'en'); });
    await page.reload();
    await page.getByTestId('lang-ko').click();
    await page.reload();
    await expect(page.getByRole('heading', { name: '내 할 일' })).toBeVisible();
  });
});

test.describe('Korean UI text', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithLang(page, 'ko');
    // Add a task so filter tabs appear
    await addTodo(page, '테스트 할 일');
  });

  test('placeholder is in Korean', async ({ page }) => {
    await expect(page.getByTestId('task-input')).toHaveAttribute(
      'placeholder',
      '새로운 할 일을 추가하세요...'
    );
  });

  test('filter labels are in Korean', async ({ page }) => {
    await expect(page.getByTestId('filter-all')).toHaveText('전체');
    await expect(page.getByTestId('filter-active')).toHaveText('진행 중');
    await expect(page.getByTestId('filter-completed')).toHaveText('완료');
  });

  test('items left is in Korean', async ({ page }) => {
    await expect(page.getByTestId('items-left')).toContainText('남음');
  });
});

test.describe('Japanese UI text', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithLang(page, 'ja');
    await addTodo(page, 'テストタスク');
  });

  test('placeholder is in Japanese', async ({ page }) => {
    await expect(page.getByTestId('task-input')).toHaveAttribute(
      'placeholder',
      '新しいタスクを追加...'
    );
  });

  test('filter labels are in Japanese', async ({ page }) => {
    await expect(page.getByTestId('filter-all')).toHaveText('すべて');
    await expect(page.getByTestId('filter-active')).toHaveText('進行中');
    await expect(page.getByTestId('filter-completed')).toHaveText('完了');
  });
});

test.describe('Chinese UI text', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithLang(page, 'zh');
    await addTodo(page, '测试任务');
  });

  test('placeholder is in Chinese', async ({ page }) => {
    await expect(page.getByTestId('task-input')).toHaveAttribute(
      'placeholder',
      '添加新任务...'
    );
  });

  test('filter labels are in Chinese', async ({ page }) => {
    await expect(page.getByTestId('filter-all')).toHaveText('全部');
    await expect(page.getByTestId('filter-active')).toHaveText('进行中');
    await expect(page.getByTestId('filter-completed')).toHaveText('已完成');
  });

  test('clear completed is in Chinese after completing a task', async ({ page }) => {
    await page.getByTestId('todo-checkbox').click();
    await expect(page.getByTestId('clear-completed')).toHaveText('清除已完成');
  });
});

test.describe('Language button highlight', () => {
  test('highlights the active language button', async ({ page }) => {
    await gotoWithLang(page, 'en');
    await expect(page.getByTestId('lang-en')).toHaveClass(/text-indigo-600/);
    await expect(page.getByTestId('lang-ko')).not.toHaveClass(/text-indigo-600/);
  });

  test('updates highlight after switching language', async ({ page }) => {
    await gotoWithLang(page, 'en');
    await page.getByTestId('lang-ja').click();
    await expect(page.getByTestId('lang-ja')).toHaveClass(/text-indigo-600/);
    await expect(page.getByTestId('lang-en')).not.toHaveClass(/text-indigo-600/);
  });
});
