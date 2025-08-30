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

test('Agregar feed y mostrar feedback y posts', async ({ page }) => {
  await page.route('**/allorigins.hexlet.app/get**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ contents: MOCK_RSS }),
    });
  });

  await page.goto('http://localhost:8080');

  await page.locator('input[name="url"]').fill(
    'https://lorem-rss.hexlet.app/feed?unit=second&interval=10&length=2',
  );

  await page.getByTestId('add').click();

  const feedback = page.getByTestId('feedback');
  await expect(feedback).toHaveText('RSS cargado con éxito');

  await expect(page.getByText('Post 1')).toBeVisible();
  await expect(page.getByText('Post 2')).toBeVisible();
});

test('Mostrar modal y verificar titulo y descripcion', async ({ page }) => {
  await page.route('**/allorigins.hexlet.app/get**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ contents: MOCK_RSS }),
    });
  });

  await page.goto('http://localhost:8080');

  await page.locator('input[name="url"]').fill(
    'https://lorem-rss.hexlet.app/feed?unit=second&interval=10&length=2',
  );

  await page.getByTestId('add').click();

  await page.getByRole('button', { name: 'Vista previa' }).first().click();

  const modalTitle = page.locator('.modal-title');
  await expect(modalTitle).toBeVisible();
  await expect(modalTitle).toHaveText('Post 1');

  const modalBody = page.locator('.modal-body');
  await expect(modalBody).toBeVisible();
  await expect(modalBody).toHaveText('Descripción 1');
});

test('URL inválida muestra mensaje de error y NO hace fetch', async ({ page }) => {
  await page.route('**/allorigins.hexlet.app/get**', () => {
    throw new Error('No debería llamar al proxy para validaciones de formulario');
  });

  await page.goto('http://localhost:8080');

  await page.fill('input[name="url"]', 'htt://lorem-rss.hexlet.app/feed?unit=second&interval=10&length=2');
  await page.getByTestId('add').click();

  const feedback = page.getByTestId('feedback');
  await expect(feedback).toHaveText('El enlace debe ser una URL válida');
});

test('URL duplicada muestra mensaje "El RSS ya existe" (no hace segundo fetch)', async ({ page }) => {
  await page.route('**/allorigins.hexlet.app/get**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ contents: MOCK_RSS }),
    });
  });

  await page.goto('http://localhost:8080');

  const feedUrl = 'https://lorem-rss.hexlet.app/feed?unit=second&interval=10&length=2';
  // Primer agregado
  await page.fill('input[name="url"]', feedUrl);
  await page.getByTestId('add').click();
  await expect(page.getByTestId('feedback')).toHaveText('RSS cargado con éxito');

  // Intento de agregar de nuevo la misma URL
  await page.fill('input[name="url"]', feedUrl);
  await page.getByTestId('add').click();
  await expect(page.getByTestId('feedback')).toHaveText('El RSS ya existe');
});

test('Muestra mensaje de error de red', async ({ page }) => {
  await page.route('**/allorigins.hexlet.app/get**', async route => {
    route.abort(); // Simula que la red falla
  });

  await page.goto('http://localhost:8080');

  // Simula escribir una URL y enviar el formulario
  await page.fill('input[name="url"]', 'https://lorem-rss.hexlet.app/feed?unit=second&interval=10&length=2');
  await page.getByTestId('add').click();

  // Verifica que aparece mensaje de error
  await expect(page.getByTestId('feedback'))
    .toHaveText('network');
});

test('Muestra mensaje de error xml', async ({ page }) => {
  const invalidXml = '<rss><channel><title>Feed</title>';

  await page.route('**/allorigins.hexlet.app/get**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ contents: invalidXml }),
    });
  });

  await page.goto('http://localhost:8080');

  const feedUrl = 'https://lorem-rss.hexlet.app/feed?unit=second&interval=10&length=2';

  await page.fill('input[name="url"]', feedUrl);
  await page.getByTestId('add').click();
  await expect(page.getByTestId('feedback')).toHaveText('invalidXml');
});
