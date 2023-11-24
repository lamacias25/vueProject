<template>
  <div v-for="(elex, index) in info" v-bind:key="index" class="card col-md-5 mx-auto mt-2">
    <div v-for="(y, indexY) in elex" v-bind:key="indexY" class="card-body">
      <div v-for="(x, indexX) in y" v-bind:key="indexX" class="row">
        <label v-if="x.type != 'button'">{{ x.label }}</label>
        <input type="text" v-if="x.type == 'text'" class="form-control"
          v-bind:class="checkText(info[index][indexY][indexX].value)" v-model="info[index][indexY][indexX].value" />
        <input type="text" v-if="x.type == 'mail'" class="form-control"
          v-bind:class="checkText(info[index][indexY][indexX].value)" v-model="info[index][indexY][indexX].value" />
        <input type="number" v-if="x.type == 'number'" class="form-control"
          v-bind:class="checkNumber(info[index][indexY][indexX].value)" v-model="info[index][indexY][indexX].value" />
        <button v-if="x.type == 'button'" class="btn btn-primary mx-auto">
          {{ x.label }}
        </button>
        <textarea v-if="x.type == 'area'" class="form-control"></textarea>
      </div>
      <button @click="send(indexY)" class="btn btn-primary mt-2">
        Save Data
      </button>
    </div>
  </div>
  <div class="card col-md-10 mx-auto mt-3">
    <table class="table">
      <thead>
        <h1>Usuarios</h1>
      </thead>
      <tbody>
        <tr class="">
          <td>Producto</td>
          <td>Descripcion</td>
          <td>Existencia</td>
        </tr>
        <tr class="" v-for="(ele, i) in listaUsuarios" v-bind:key="i">
          <td v-bind:id="i" class="col-md-2">
            <input type="text" class="form-control" v-bind:class="checkText(listaUsuarios[i].nombre)"
              v-model="listaUsuarios[i].nombre" />
          </td>
          <td v-bind:id="i" class="col-md-2">
            <input type="text" class="form-control" v-bind:class="checkText(listaUsuarios[i].descripcion)"
              v-model="listaUsuarios[i].descripcion" />
          </td>
          <td v-bind:id="i" class="col-md-2">
            <input type="number" class="form-control" v-bind:class="checkNumber(listaUsuarios[i].stock)"
              v-model="listaUsuarios[i].stock" />
          </td>
          <td class="col-md-2">
            <button v-bind:id="i" class="btn btn-danger" @click="removeItem({ correo: ele.correo, id: ele.id_producto })">
              Eliminar
            </button>
            <button v-bind:id="i" class="btn btn-success" @click="updateItem(listaUsuarios[i])">
              Actualizar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import { toRaw } from "vue";

export default {
  name: "FormContenido",
  props: { datos: [] },
  data() {
    return {
      info: this.datos,
      listaUsuarios: [],
    };
  },
  methods: {
    add: function (id, y, x, values) {
      this.info[id][y][x]["nlist"].push({
        label: values.label,
        type: values.type,
        value: "",
      });
    },
    checkNumber: function (value) {
      return {
        "is-valid": /^([0-9])*$/.test(
          value
        ),
        "is-invalid": !/^([0-9])*$/.test(
          value
        ),
      };
    },
    checkText: function (value) {
      return {
        "is-valid":
          /^[0-9a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+(?:\s+[0-9a-zA-ZáéíóúÁÉÍÓÚüÜñÑ,.:]+){0,300}(?<!\s)$/.test(
            value
          ),
        "is-invalid":
          !/^[0-9a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+(?:\s+[0-9a-zA-ZáéíóúÁÉÍÓÚüÜñÑ,.:]+){0,300}(?<!\s)$/.test(
            value
          ),
      };
    },
    check: function (data) {
      let datosForm = [];
      for (let i in data) {
        if (i != "id_producto")
          switch (data[i]["type"]) {
            case "text":
              if (this.checkText(data[i]["value"])["is-invalid"])
                datosForm.push(data[i]["value"]);
              break;
            case "number":
              if (this.checkNumber(data[i]["value"])["is-invalid"]) {
                datosForm.push(data[i]["value"]);
              }
              break;
            default:
              break;
          }
      }
      return datosForm;
    },
    reload: function () {
      axios.get("http://127.0.0.1:8800/login").then((response) => {
        axios
          .post("http://127.0.0.1:8800/consulta", {
            data: {
              tabla: "products",
              columnas: ["*"],
              Authentication: response.data.token,
            },
          })
          .then((response2) => {
            this.listaUsuarios = response2.data.message;
          });
      });
    },
    converteFormat: function (data) {
      let datos = {};
      for (let i in data)
        datos[i] = { value: data[i], type: i == "correo" ? "mail" : (i == "stock") ? "number" : "text" };
      delete datos["updatedAt"];
      delete datos["createdAt"];
      return datos;
    },
    updateItem: function (data) {
      let datosForm = this.converteFormat(data);
      let errores = this.check(datosForm);
      errores.length == 0
        ? axios.get("http://127.0.0.1:8800/login").then((response) => {
          axios
            .post("http://127.0.0.1:8800/modificar", {
              data: {
                tabla: "products",
                data: datosForm,
                Authentication: response.data.token,
              },
            })
            .then(() => {
              this.reload();
            });
        })
        : alert("Existen errores en: " + errores);
    },
    removeItem: function (data) {
      axios.get("http://127.0.0.1:8800/login").then((response) => {
        axios
          .post("http://127.0.0.1:8800/eliminar", {
            data: {
              tabla: "products",
              ele: data,
              Authentication: response.data.token,
            },
          })
          .then(() => {
            this.reload();
          });
      });
    },
    send: function (idForm) {
      let datosForm = toRaw(this.info)[idForm][0];
      let errores = this.check(datosForm);
      errores.length == 0
        ? axios.get("http://127.0.0.1:8800/login", {}).then((response) => {
          axios
            .post("http://127.0.0.1:8800/insert", {
              data: datosForm,
              Authentication: response.data.token,
            })
            .then(() => {
              this.reload();
            });
        })
        : alert("Existen errores en: " + errores);
    },
  },
  mounted() {
    this.reload();
    let inputs = [];
    inputs.push({
      name: "nombre",
      type: "text",
      label: "Producto",
    });
    inputs.push({
      name: "descripcion",
      type: "text",
      label: "Descripcion",
    });
    inputs.push({
      name: "stock",
      type: "number",
      label: "Stock",
    });
    let form = {
      0: inputs,
    };
    this.info = [];
    this.info.push(form);
  },
};
</script>
