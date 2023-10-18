import fetch from "node-fetch";
import mysql from "mysql";
import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import methodOverride from "method-override";
import cors from "cors";
import jwt from "jsonwebtoken";
import Sequelize from "sequelize";




export default class  Persona {
  constructor(a,u,p,b) {
this.adressServer = a;
this.user = u;
this.passwordMYSQL = p;
this.basedeDatos = b;
this.sequelize = new Sequelize(this.basedeDatos, this.user, this.passwordMYSQL, {
  host: this.adressServer,
  dialect: "mysql",
});
this.sequelize
  .authenticate()
  .then(() => {
    console.log("listo");
  })
  .catch(() => {
    console.log("Error");
  });
this.app = express();
this.app.use(logger("dev"));
this.app.use(express.json({ limit: "25mb" }));
this.app.use(bodyParser.json());
this.app.use(methodOverride());
this.app.use(cors());  
}

  conexion() {
  var con = mysql.createConnection({
    host: this.adressServer,
    user: this.user,
    password: this.passwordMYSQL,
    database: this.basedeDatos,
  });
  return con;
}
getApp(){
    return this.app;
}
getSequelize(){
    return this.sequelize;
}
consulta(column, tabla, r) {
  try {
    var con = this.conexion();
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

alta(data, tabla, r) {
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
  const users = this.sequelize.define("users", estructura);
  const fun = async () => {
    const user = await this.sequelize.models.users.create(dataSequileze);
    r.send({
      datos: true,
    });
  };
  fun();
}
async modificar(data, id, tabla, r) {
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
    const users = this.sequelize.define("users", estructura, { timestamps: false });
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
eliminar(id, tabla, r) {
  var estructura = [];
  estructura["id_users"] = { type: Sequelize.INTEGER, primaryKey: true };
  try {
    const users = this.sequelize.define("users", estructura, { timestamps: false });
    users.destroy({ where: { id_users: id } });
    r.send({
      datos: true,
    });
  } catch (error) {
    console.log(error);
  }
}
verifyToken(req, res, next) {
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
sanitizar(data) {
  for (let ele in data) {
    let simbolos = ['"', "'", "'", '"'];
    for (let i in simbolos)
      data[ele].value = data[ele].value.replace(simbolos[i], "");
  }
  return data;
}
}