// routes/categorias.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const { verificarToken, verificarAdmin } = require("./auth");

// GET /categorias - público
router.get("/", async (_req, res) => {
  try {
    const result = await db.query("SELECT * FROM categorias");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /categorias - admin
router.post("/", verificarToken, verificarAdmin, async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: "nombre es requerido" });

  try {
    const result = await db.query(
      "INSERT INTO categorias (nombre) VALUES ($1) RETURNING id, nombre",
      [nombre]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /categorias/:id - admin
router.put("/:id", verificarToken, verificarAdmin, async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: "nombre es requerido" });

  try {
    const result = await db.query(
      "UPDATE categorias SET nombre = $1 WHERE id = $2 RETURNING id, nombre",
      [nombre, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /categorias/:id - admin
router.delete("/:id", verificarToken, verificarAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM categorias WHERE id = $1", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json({ mensaje: "Categoría eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
