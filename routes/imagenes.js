// routes/imagenes.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const { verificarToken, verificarAdmin } = require("./auth");

// GET /imagenes/:producto_id - público
router.get("/:producto_id", async (req, res) => {
  const { producto_id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM imagenes_productos WHERE producto_id = ?",
      [producto_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /imagenes - admin
router.post("/", verificarToken, verificarAdmin, async (req, res) => {
  const { url, producto_id, productoId } = req.body;
  const pid = producto_id ?? productoId; // acepta ambos nombres

  if (!url || !pid) {
    return res.status(400).json({ error: "url y producto_id son requeridos" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO imagenes_productos (url, producto_id) VALUES (?, ?)",
      [url, pid]
    );
    res.json({ id: result.insertId, url, producto_id: pid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /imagenes/:id - admin
router.delete("/:id", verificarToken, verificarAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM imagenes_productos WHERE id = ?", [id]);
    res.json({ mensaje: "Imagen eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
