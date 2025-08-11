import { test, expect } from '@playwright/test';

const MOCK_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Canal de prueba</title>
    <description>Descripción de prueba</description>
    <item>
      <title>Post 1</title>
      <link>https://example.com/post1</link>
      <description>Descripción 1</description>
    </item>
    <item>
      <title>Post 2</title>
      <link>https://example.com/post2</link>
      <description>Descripción 2</description>
    </item>
  </channel>
</rss>`;

test('agregar feed -> muestra éxito y posts', async ({ page }) => {
    
    await page.route('**/allorigins.hexlet.app/get**', async (route) => {
        await route.fulfill({
            status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ contents: MOCK_RSS }),
        });
    });

    await page.goto('http://localhost:8080');

    await page.locator('input[name="url"]').fill(
        'https://lorem-rss.hexlet.app/feed?unit=second&interval=10&length=2'
    ); 

    await page.getByTestId('add').click();

    // 7) Verificamos el mensaje de éxito (usa tu selector real)
    const feedback = page.getByTestId('feedback');
    await expect(feedback).toHaveText('RSS cargado con éxito');

    // 8) Verificamos que los posts del MOCK_RSS aparezcan en la UI
    await expect(page.getByText('Post 1')).toBeVisible();
    await expect(page.getByText('Post 2')).toBeVisible();
});