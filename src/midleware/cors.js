const cors = require('cors');

const corsOptions = {
  origin: '*',  // Permitir cualquier origen
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);
