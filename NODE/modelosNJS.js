import fetch from "node-fetch";
import mysql from "mysql";
import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import methodOverride from "method-override";
import cors from "cors";
import jwt from "jsonwebtoken";
import Sequelize from "sequelize";
import Persona from "./manejador.js"; // Ruta correcta al archivo Js

let per= new Persona("127.0.0.1", "node", "node", "exampleDB");
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
  per.alta(datos, "users", res);
});
app.post("/modificar", per.verifyToken, (req, res) => {
  let id = req.body.data.data["id_producto"].value;
  delete req.body.data.data.id_producto;
  let datos = per.sanitizar(req.body.data.data);
  per.modificar(datos, id, "users", res);
});
app.post("/eliminar", per.verifyToken, (req, res) => {
  per.eliminar(req.body.data.ele.id, "users", res);
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
