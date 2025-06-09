const express = require('express');
const router = express.Router();
const { buscarCausas } = require('../services/powerJudicialScraper');
const { filtrarPorBL } = require('../utils/filterBLCapitalCases');

router.get('/', async (req, res) => {
  const { rol } = req.query;
  if (!rol) return res.status(400).json({ error: 'Se requiere el parámetro ?rol=C-12345-2023' });

  try {
    const causas = await buscarCausas({ rol });
    const filtradas = filtrarPorBL(causas);
    res.json(filtradas);
  } catch (e) {
    console.error('Error en /api/judicial:', e);
    res.status(500).json({ error: 'No se pudo obtener la información judicial' });
  }
});

module.exports = router;