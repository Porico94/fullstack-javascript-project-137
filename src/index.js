import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import initApp from './controller.js';
import initI18n from './locales/index.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Inicializar i18n
    await initI18n();

    // Verificar que los elementos necesarios existan en el DOM
    const requiredElements = [
      '.rss-form',
      '#url-input',
      '.feedback',
      '.feeds',
      '.posts',
      '#modal',
    ];

    const missingElements = requiredElements.filter(selector => !document.querySelector(selector));

    if (missingElements.length > 0) {
      console.error('❌ Faltan elementos en el DOM:', missingElements);
      return;
    }

    // Inicializar la aplicación
    initApp();

    console.log('✅ Aplicación RSS Reader inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la aplicación:', error);
  }
});
