import fetch from "node-fetch";
import mysql from "mysql";
import sql from "mssql";
import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import methodOverride from "method-override";
import cors from "cors";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Sequelize from "sequelize";

var adressServer = "127.0.0.1";
var user = "node";
var passwordMYSQL = "node";
var basedeDatos = "exampleDB";
var port = process.env.PORT || 8800;
var sequelize = new Sequelize(basedeDatos, user, passwordMYSQL, {
  host: adressServer,
  dialect: "mysql",
});
sequelize
  .authenticate()
  .then(() => {
    console.log("listo");
  })
  .catch(() => {
    console.log("Error");
  });
var app = express();
app.use(logger("dev"));
app.use(express.json({ limit: "25mb" }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

function conexion() {
  var con = mysql.createConnection({
    host: adressServer,
    user: user,
    password: passwordMYSQL,
    database: basedeDatos,
  });
  return con;
}
function consulta(column, tabla, r) {
  try {
    var con = conexion();
    con.connect();
    console.log(tabla);
    con.query(
      "SELECT " + column.join() + " from " + tabla + "",
      (err, result, fields) => {
        var res = new Array();
        console.log(result);
        if (result != null)
          result.forEach(function (value) {
            if (column.indexOf("*") != -1) res.push(value);
            else {
              res.push(value);
            }
          });
        if (r != null) {
          r.send({
            datos: true,
            message: res,
          });
        }
      }
    );
  } catch (e) {
    r.send({
      datos: false,
      message: e,
    });
  }
  con.end();
}

function alta(data, tabla, r) {
  var column = Object.keys(data);
  var estructura = [];
  estructura["id_users"] = { type: Sequelize.INTEGER, primaryKey: true };
  column.forEach(function (value) {
    estructura[value] = Sequelize.STRING;
  });
  var dataSequileze = {};
  column.forEach(function (value) {
    dataSequileze[value] = data[value];
  });
  const users = sequelize.define("users", estructura);
  const fun = async () => {
    const user = await sequelize.models.users.create(dataSequileze);
    r.send({
      datos: true,
    });
  };
  fun();
}
async function modificar(data, id, tabla, r) {
  var estructura = [];
  estructura["id_users"] = { type: Sequelize.INTEGER, primaryKey: true };
  var column = Object.keys(data);
  column.forEach(function (value) {
    estructura[value] = Sequelize.STRING;
  });
  var dataSequileze = {};
  column.forEach(function (value) {
    dataSequileze[value] = data[value].value.toString();
  });
  try {
    const users = sequelize.define("users", estructura, { timestamps: false });
    await users.update(dataSequileze, {
      where: { id_users: id },
    });
    r.send({
      datos: true,
    });
  } catch (error) {
    console.log(error);
  }
}
function eliminar(id, tabla, r) {
  var estructura = [];
  estructura["id_users"] = { type: Sequelize.INTEGER, primaryKey: true };
  try {
    const users = sequelize.define("users", estructura, { timestamps: false });
    users.destroy({ where: { id_users: id } });
    r.send({
      datos: true,
    });
  } catch (error) {
    console.log(error);
  }
}

app.get("/login", function (req, res) {
  const user = { id: 1, username: "usuario" };
  const token = jwt.sign(user, "password"); // Replace 'your-secret-key' with a secure secret key
  res.json({ token });
});

app.post("/consulta", verifyToken, (req, res) => {
  var result = consulta(req.body.data.columnas, req.body.data.tabla, res);
});
app.post("/insert", verifyToken, (req, res) => {
  req.body.data = sanitizar(req.body.data);
  let datos = {};
  let correcto = true;
  for (let i in req.body.data)
    datos[req.body.data[i].name] = req.body.data[i].value;
  alta(datos, "users", res);
});
app.post("/modificar", verifyToken, (req, res) => {
  let id = req.body.data.data["id_users"].value;
  delete req.body.data.data.id_users;
  let datos = sanitizar(req.body.data.data);
  modificar(datos, id, "users", res);
});
app.post("/eliminar", verifyToken, (req, res) => {
  eliminar(req.body.data.ele.id, "users", res);
});
function verifyToken(req, res, next) {
  const token = req.body.data.Authentication; // Typically, you'd send the token in the Authorization header
  console.log(token);
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, "password", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    next();
  });
}
function sanitizar(data) {
  for (let ele in data) {
    let simbolos = ['"', "'", "'", '"'];
    for (let i in simbolos)
      data[ele].value = data[ele].value.replace(simbolos[i], "");
  }
  return data;
}
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
