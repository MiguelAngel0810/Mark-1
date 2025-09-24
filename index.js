require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Servir archivos estáticos desde la carpeta actual
app.use(express.static(__dirname));

// Rutas API
app.use("/login", require("./routes/login"));
app.use("/categorias", require("./routes/categorias"));
app.use("/productos", require("./routes/productos"));
app.use("/imagenes", require("./routes/imagenes"));

// Ruta raíz que sirve el index.html
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
