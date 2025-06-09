function filtrarPorBL(causas) {
  return causas.filter(c => {
    const texto = JSON.stringify(c).toLowerCase();
    return texto.includes('bl capital') || texto.includes('subvención') || texto.includes('municipal');
  });
}

module.exports = { filtrarPorBL };