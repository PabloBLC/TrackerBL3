const puppeteer = require('puppeteer');

async function buscarCausas({ rol }) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  try {
    await page.goto('https://civil.pjud.cl/CIVILPORWEB/', { waitUntil: 'domcontentloaded' });
    await page.click('#formConsulta\\:cbRol');

    const match = rol.match(/^([A-Z])-(\d+)-(\d{4})$/i);
    if (!match) return [];

    const [, tipo, numero, anio] = match;

    await page.type('#formConsulta\\:cbCausa', tipo);
    await page.type('#formConsulta\\:txtRit', numero);
    await page.type('#formConsulta\\:txtAno', anio);
    await page.click('#formConsulta\\:j_id61');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const causas = await page.evaluate(() => {
      const filas = Array.from(document.querySelectorAll('.iceDatTbl tr.iceDatTblRow1, .iceDatTbl tr.iceDatTblRow2'));
      return filas.map(fila => {
        const celdas = fila.querySelectorAll('td');
        return {
          tribunal: celdas[0]?.innerText.trim(),
          estado: celdas[6]?.innerText.trim(),
          demandado: celdas[5]?.innerText.trim(),
          fallo: 'Pendiente',
          instancia: '1ª instancia',
          fechas: `Ingreso: ${celdas[2]?.innerText.trim()}`,
          monto: 25000000,
          recupero: 80,
          estrategia: 'Embargo de subvenciones',
        };
      });
    });

    return causas;
  } catch (error) {
    console.error('Error en scraping judicial:', error);
    return [];
  } finally {
    await browser.close();
  }
}

module.exports = { buscarCausas };