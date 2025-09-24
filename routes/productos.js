// routes/productos.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const { verificarToken, verificarAdmin } = require("./auth");

// GET /productos - público
router.get("/", async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.nombre, p.precio, c.nombre AS categoria, p.categoria_id
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /productos - admin
router.post("/", verificarToken, verificarAdmin, async (req, res) => {
  let { nombre, precio, categoria_id, categoriaId } = req.body;
  categoria_id = categoria_id ?? categoriaId; // soporta ambos

  if (!nombre || precio == null || !categoria_id) {
    return res.status(400).json({ error: "nombre, precio y categoria_id son requeridos" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO productos (nombre, precio, categoria_id) VALUES (?, ?, ?)",
      [nombre, precio, categoria_id]
    );
    res.json({ id: result.insertId, nombre, precio, categoria_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /productos/:id - admin (actualización parcial)
router.put("/:id", verificarToken, verificarAdmin, async (req, res) => {
  const { id } = req.params;
  let { nombre, precio, categoria_id, categoriaId } = req.body;
  categoria_id = categoria_id ?? categoriaId; // soporta ambos

  // Construcción dinámica de SET para no pisar campos no enviados
  const sets = [];
  const vals = [];
  if (nombre !== undefined) { sets.push("nombre = ?"); vals.push(nombre); }
  if (precio !== undefined) { sets.push("precio = ?"); vals.push(precio); }
  if (categoria_id !== undefined) { sets.push("categoria_id = ?"); vals.push(categoria_id); }

  if (sets.length === 0) return res.status(400).json({ error: "Nada para actualizar" });

  try {
    vals.push(id);
    await db.query(`UPDATE productos SET ${sets.join(", ")} WHERE id = ?`, vals);
    res.json({ id: Number(id), ...(nombre !== undefined && { nombre }), ...(precio !== undefined && { precio }), ...(categoria_id !== undefined && { categoria_id }) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /productos/:id - admin
router.delete("/:id", verificarToken, verificarAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM productos WHERE id = ?", [id]);
    res.json({ mensaje: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
