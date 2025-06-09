const express = require('express');
const cors = require('cors');
const judicialRouter = require('./routes/judicial');

const app = express();
app.use(cors());
app.use('/api/judicial', judicialRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});