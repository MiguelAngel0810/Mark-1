// routes/login.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_cambialo";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

// POST /login
router.post("/", async (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) {
    return res.status(400).json({ error: "Faltan credenciales" });
  }

  try {
    
    const [rows] = await db.query(
      "SELECT id, usuario, rol FROM usuarios WHERE usuario = ? AND password = ?",
      [usuario, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, rol: user.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({ token, rol: user.rol });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
module.exports = router;
