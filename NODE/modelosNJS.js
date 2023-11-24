import jwt from "jsonwebtoken";
import Persona from "./manejador.js"; // Ruta correcta al archivo Js

let per = new Persona("156.67.74.51", "u365242883_prueba", "Prueba2023", "u365242883_prueba");
var port = process.env.PORT || 8800;
var sequelize = per.getSequelize();
var app = per.getApp();

app.get("/login", function (req, res) {
  const user = { id: 1, username: "usuario" };
  const token = jwt.sign(user, "password"); // Replace 'your-secret-key' with a secure secret key
  res.json({ token });
});

app.post("/consulta", per.verifyToken, (req, res) => {
  var result = per.consulta(req.body.data.columnas, req.body.data.tabla, res);
});
app.post("/insert", per.verifyToken, (req, res) => {
  req.body.data = per.sanitizar(req.body.data);
  let datos = {};
  let correcto = true;
  for (let i in req.body.data)
    datos[req.body.data[i].name] = req.body.data[i].value;
  per.alta(datos, "products", res);
});
app.post("/modificar", per.verifyToken, (req, res) => {
  let id = req.body.data.data["id_producto"].value;
  delete req.body.data.data.id_producto;
  let datos = per.sanitizar(req.body.data.data);
  per.modificar(datos, id, "products", res);
});
app.post("/eliminar", per.verifyToken, (req, res) => {
  per.eliminar(req.body.data.ele.id, "products", res);
});

function correr() {
  try {
    console.log("Server Listen in: " + port);
    app.listen(port);
  } catch (e) {
    app.close();
    correr();
  }
}

correr();
