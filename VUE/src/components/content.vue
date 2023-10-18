<template>
  <div
    v-for="(elex, index) in info"
    v-bind:key="index"
    class="card col-md-5 mx-auto mt-2"
  >
    <div v-for="(y, indexY) in elex" v-bind:key="indexY" class="card-body">
      <div v-for="(x, indexX) in y" v-bind:key="indexX" class="row">
        <label v-if="x.type != 'button'">{{ x.label }}</label>
        <input
          type="text"
          v-if="x.type == 'text'"
          class="form-control"
          v-bind:class="validaText(info[index][indexY][indexX].value)"
          v-model="info[index][indexY][indexX].value"
        />
        <input
          type="text"
          v-if="x.type == 'mail'"
          class="form-control"
          v-bind:class="validaEmail(info[index][indexY][indexX].value)"
          v-model="info[index][indexY][indexX].value"
        />
        <button v-if="x.type == 'button'" class="btn btn-primary mx-auto">
          {{ x.label }}
        </button>
        <textarea v-if="x.type == 'area'" class="form-control"></textarea>
      </div>
      <button @click="send(indexY)" class="btn btn-primary mt-2">
        Send Data
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
          <td>Nombre</td>
          <td>Paterno</td>
          <td>Materno</td>
          <td>Domicilio</td>
          <td>Correo</td>
          <td>Acciones</td>
        </tr>
        <tr class="" v-for="(ele, i) in listaUsuarios" v-bind:key="i">
          <td v-bind:id="i" class="col-md-2">
            <input
              type="text"
              class="form-control"
              v-bind:class="validaText(listaUsuarios[i].nombre)"
              v-model="listaUsuarios[i].nombre"
            />
          </td>
          <td v-bind:id="i" class="col-md-2">
            <input
              type="text"
              class="form-control"
              v-bind:class="validaText(listaUsuarios[i].paterno)"
              v-model="listaUsuarios[i].paterno"
            />
          </td>
          <td v-bind:id="i" class="col-md-2">
            <input
              type="text"
              class="form-control"
              v-bind:class="validaText(listaUsuarios[i].materno)"
              v-model="listaUsuarios[i].materno"
            />
          </td>
          <td v-bind:id="i" class="col-md-2">
            <input
              type="text"
              class="form-control"
              v-bind:class="validaText(listaUsuarios[i].domicilio)"
              v-model="listaUsuarios[i].domicilio"
            />
          </td>
          <td v-bind:id="i" class="col-md-2">
            <input
              type="text"
              class="form-control"
              v-bind:class="validaEmail(listaUsuarios[i].correo)"
              v-model="listaUsuarios[i].correo"
            />
          </td>
          <td class="col-md-2">
            <button
              v-bind:id="i"
              class="btn btn-danger"
              @click="eliminar({ correo: ele.correo, id: ele.id_users })"
            >
              Eliminar
            </button>
            <button
              v-bind:id="i"
              class="btn btn-success"
              @click="modificar(listaUsuarios[i])"
            >
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

    validaEmail: function (value) {
      return {
        "is-valid": /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(
          value
        ),
        "is-invalid": !/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(
          value
        ),
      };
    },
    validaText: function (value) {
      return {
        "is-valid":
          /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+(?:\s+[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+){0,5}(?<!\s)$/.test(
            value
          ),
        "is-invalid":
          !/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+(?:\s+[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+){0,5}(?<!\s)$/.test(
            value
          ),
      };
    },
    check: function (data) {
      let datosForm = [];
      for (let i in data)
        if (i != "id_users")
          switch (data[i]["type"]) {
            case "mail":
              if (this.validaEmail(data[i]["value"])["is-invalid"])
                datosForm.push(data[i]["value"]);
              break;
            case "text":
              if (this.validaText(data[i]["value"])["is-invalid"])
                datosForm.push(data[i]["value"]);
              break;
            default:
              break;
          }
      return datosForm;
    },
    actualizar: function () {
      axios.get("http://127.0.0.1:8800/login").then((response) => {
        axios
          .post("http://127.0.0.1:8800/consulta", {
            data: {
              tabla: "users",
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
        datos[i] = { value: data[i], type: i == "correo" ? "mail" : "text" };
      delete datos["updatedAt"];
      delete datos["createdAt"];
      return datos;
    },
    modificar: function (data) {
      let datosForm = this.converteFormat(data);
      let errores = this.check(datosForm);
      errores.length == 0
        ? axios.get("http://127.0.0.1:8800/login").then((response) => {
            axios
              .post("http://127.0.0.1:8800/modificar", {
                data: {
                  tabla: "users",
                  data: datosForm,
                  Authentication: response.data.token,
                },
              })
              .then((response2) => {
                console.log(response2);
                this.actualizar();
              });
          })
        : alert("Existen errores en: " + errores);
    },
    eliminar: function (data) {
      axios.get("http://127.0.0.1:8800/login").then((response) => {
        axios
          .post("http://127.0.0.1:8800/eliminar", {
            data: {
              tabla: "users",
              ele: data,
              Authentication: response.data.token,
            },
          })
          .then((response2) => {
            console.log(response2.data.message);
            this.actualizar();
          });
      });
    },
    send: function (idForm) {
      let datosForm = toRaw(this.info)[idForm][0];
      let errores = this.check(datosForm);
      errores.length == 0
        ? axios.post("http://127.0.0.1:8800/login", {}).then((response) => {
            axios
              .post("http://127.0.0.1:8800/insert", {
                data: datosForm,
                Authentication: response.data.token,
              })
              .then((response2) => {
                console.log(response2);
                this.actualizar();
              });
          })
        : alert("Existen errores en: " + errores);
    },
  },
  mounted() {
    this.actualizar();
    let inputs = [];
    inputs.push({
      name: "nombre",
      type: "text",
      label: "Nombre",
    });
    inputs.push({
      name: "paterno",
      type: "text",
      label: "Apellido Paterno",
    });
    inputs.push({
      name: "materno",
      type: "text",
      label: "Apellido Materno",
    });
    inputs.push({
      name: "domicilio",
      type: "text",
      label: "Domicilio",
    });
    inputs.push({
      name: "correo",
      type: "mail",
      label: "Correo",
    });
    let formulario = {
      0: inputs,
    };
    this.info = [];
    this.info.push(formulario);
  },
};
</script>
