const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Función para leer el archivo enfermeros.json
const leerEnfermeros = () => {
  const data = fs.readFileSync('./data/enfermeros.json', 'utf-8');
  return JSON.parse(data);
};

// Función para guardar en enfermeros.json
const guardarEnfermeros = (data) => {
  fs.writeFileSync('./data/enfermeros.json', JSON.stringify(data, null, 2));
};

// Obtener todos los enfermeros
router.get('/', (req, res) => {
  const enfermeros = leerEnfermeros();
  res.json(enfermeros);
});

// Crear un nuevo enfermero
router.post('/', (req, res) => {
  const enfermeros = leerEnfermeros();
  const nuevoEnfermero = { id: uuidv4(), ...req.body };
  enfermeros.push(nuevoEnfermero);
  guardarEnfermeros(enfermeros);
  res.status(201).json(nuevoEnfermero);
});

// Actualizar un enfermero
router.put('/:id', (req, res) => {
  let enfermeros = leerEnfermeros();
  enfermeros = enfermeros.map(enfermero =>
    enfermero.id === req.params.id ? { ...enfermero, ...req.body } : enfermero
  );
  guardarEnfermeros(enfermeros);
  res.json({ mensaje: 'Enfermero actualizado' });
});

// Eliminar un enfermero
router.delete('/:id', (req, res) => {
  let enfermeros = leerEnfermeros();
  enfermeros = enfermeros.filter(enfermero => enfermero.id !== req.params.id);
  guardarEnfermeros(enfermeros);
  res.json({ mensaje: 'Enfermero eliminado' });
});

module.exports = router;
