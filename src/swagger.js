const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Enfermería', // Título de la documentación
    version: '1.0.0', // Versión de la API
    description: 'API para la gestión de enfermeros y ofertas en una aplicación de contratación de servicios de enfermería',
    contact: {
      name: 'Alejandro',
      email: 'aarellanomadrigal@gmail.com',
    },
  },
  servers: [
    {
      url: 'https://api-enfse-1.onrender.com', // Cambia la URL si usas otro puerto
      description: 'Servidor',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Aquí especificamos dónde están los archivos de rutas
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;