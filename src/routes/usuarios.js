const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Función para leer el archivo usuarios.json
const leerUsuarios = () => {
  const data = fs.readFileSync('./data/usuarios.json', 'utf-8');
  return JSON.parse(data);
};

// Función para guardar en usuarios.json
const guardarUsuarios = (data) => {
  fs.writeFileSync('./data/usuarios.json', JSON.stringify(data, null, 2));
};

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Operaciones relacionadas con los usuarios
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   email:
 *                     type: string
 */
router.get('/', (req, res) => {
  const usuarios = leerUsuarios();
  res.json(usuarios);
});

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', (req, res) => {
  const usuarios = leerUsuarios();
  const usuario = usuarios.find(u => u.id === req.params.id);

  if (!usuario) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  res.json(usuario);
});

/**
 * @swagger
 * /usuarios/registro:
 *   post:
 *     summary: Registrar un nuevo usuario y generar token
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nuevoUsuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     email:
 *                       type: string
 *                 token:
 *                   type: string
 */
router.post('/registro', (req, res) => {
  const usuarios = leerUsuarios();
  const nuevoUsuario = { id: uuidv4(), ...req.body };
  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  // Generar token JWT
  const token = jwt.sign({ id: nuevoUsuario.id, nombre: nuevoUsuario.nombre }, 'secreto', { expiresIn: '1h' });

  res.status(201).json({ nuevoUsuario, token });
});

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Iniciar sesión y generar token
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 token:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 */
router.post('/login', (req, res) => {
  const { email } = req.body;
  const usuarios = leerUsuarios();
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  // Generar token JWT
  const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre }, 'secreto', { expiresIn: '1h' });

  res.json({ mensaje: 'Inicio de sesión exitoso', token });
});

/**
 * @swagger
 * /usuarios/crear:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 */
router.post('/crear', (req, res) => {
  const usuarios = leerUsuarios();
  const nuevoUsuario = { id: uuidv4(), ...req.body };
  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  res.status(201).json({ nuevoUsuario });
});

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id', (req, res) => {
  let usuarios = leerUsuarios();
  usuarios = usuarios.map(usuario =>
    usuario.id === req.params.id ? { ...usuario, ...req.body } : usuario
  );
  guardarUsuarios(usuarios);
  res.json({ mensaje: 'Usuario actualizado' });
});

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', (req, res) => {
  let usuarios = leerUsuarios();
  usuarios = usuarios.filter(usuario => usuario.id !== req.params.id);
  guardarUsuarios(usuarios);
  res.json({ mensaje: 'Usuario eliminado' });
});

module.exports = router;
