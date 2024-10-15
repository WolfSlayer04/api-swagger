const express = require('express');
const cors = require('cors');
const verificarToken = require('./src/midleware/autenticacion.js'); // Asegúrate de que la ruta sea correcta
const manejoErrores = require('./src/midleware/manejoErrores.js'); // Asegúrate de que la ruta sea correcta
const usuariosRouter = require('./src/routes/usuarios'); // Asegúrate de que la ruta sea correcta
const enfermerosRouter = require('./src/routes/enfermeros'); // Asegúrate de que la ruta sea correcta
const ofertasRouter = require('./src/routes/ofertas'); // Asegúrate de que la ruta sea correcta

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/swagger'); // El archivo swagger.js que configuramos antes

const app = express();

app.use(cors());
app.use(express.json());

// Rutas de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API
app.use('/usuarios', usuariosRouter);
app.use('/enfermeros', verificarToken, enfermerosRouter);
app.use('/ofertas', verificarToken, ofertasRouter);

// Manejo de errores
app.use(manejoErrores);

// Configuración del puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});
