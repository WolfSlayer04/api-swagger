const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Función para leer el archivo ofertas.json
const leerOfertas = () => {
  const data = fs.readFileSync('./data/ofertas.json', 'utf-8');
  return JSON.parse(data);
};

// Función para guardar en ofertas.json
const guardarOfertas = (data) => {
  fs.writeFileSync('./data/ofertas.json', JSON.stringify(data, null, 2));
};

// Obtener todas las ofertas
router.get('/', (req, res) => {
  const ofertas = leerOfertas();
  res.json(ofertas);
});

// Crear una nueva oferta
router.post('/', (req, res) => {
  const ofertas = leerOfertas();
  const nuevaOferta = { id: uuidv4(), ...req.body };
  ofertas.push(nuevaOferta);
  guardarOfertas(ofertas);
  res.status(201).json(nuevaOferta);
});

// Actualizar una oferta
router.put('/:id', (req, res) => {
  let ofertas = leerOfertas();
  ofertas = ofertas.map(oferta =>
    oferta.id === req.params.id ? { ...oferta, ...req.body } : oferta
  );
  guardarOfertas(ofertas);
  res.json({ mensaje: 'Oferta actualizada' });
});

// Eliminar una oferta
router.delete('/:id', (req, res) => {
  let ofertas = leerOfertas();
  ofertas = ofertas.filter(oferta => oferta.id !== req.params.id);
  guardarOfertas(ofertas);
  res.json({ mensaje: 'Oferta eliminada' });
});

module.exports = router;
