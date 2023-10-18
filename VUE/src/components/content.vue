<template>
  <div
    v-for="(elex, index) in info"
    v-bind:key="index"
    class="card col-5 mx-auto mt-2"
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
        <div v-if="x.type == 'lista'" class="container">
          <div class="d-flex">
            <div
              v-for="(name, indexZ) in x.list"
              v-bind:key="indexZ"
              class="mx-auto"
            >
              <button
                @click="add(index, indexY, indexX, name)"
                class="btn btn-primary"
              >
                {{ name.label }}
              </button>
            </div>
          </div>
          <div
            v-for="(name, indexZ) in x.nlist"
            v-bind:key="indexZ"
            class="mx-auto"
          >
            <label>{{ name.label }}</label>
            <input
              type="text"
              v-if="name.type == 'titulo'"
              class="form-control"
              v-bind:class="valida(name.text)"
              v-model="info[index][indexY][indexX].nlist[indexZ].value"
            />
            <input
              type="button"
              v-if="name.type == 'button'"
              class="form-control"
            />
            <textarea
              v-if="name.type == 'text'"
              class="form-control"
            ></textarea>
          </div>
        </div>
      </div>
      <button @click="send(indexY)" class="btn btn-primary mt-2">
        Send Data
      </button>
    </div>
  </div>
  <div class="card col-10 mx-auto md-3">
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
          <td v-bind:id="i">
            <input
              type="text"
              class="form-control col-2"
              v-model="listaUsuarios[i].nombre"
            />
          </td>
          <td v-bind:id="i">
            <input
              type="text"
              class="form-control col-2"
              v-model="listaUsuarios[i].paterno"
            />
          </td>
          <td v-bind:id="i">
            <input
              type="text"
              class="form-control col-2"
              v-model="listaUsuarios[i].materno"
            />
          </td>
          <td v-bind:id="i">
            <input
              type="text"
              class="form-control col-2"
              v-model="listaUsuarios[i].domicilio"
            />
          </td>
          <td v-bind:id="i">
            <input
              type="text"
              class="form-control col-2"
              v-model="listaUsuarios[i].correo"
            />
          </td>
          <td>
            <button
              v-bind:id="i"
              @click="eliminar({ correo: ele.correo, id: ele.id_users })"
            >
              Eliminar
            </button>
            <button v-bind:id="i" @click="modificar(listaUsuarios[i])">
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
    actualizar: function () {
      axios
        .post("http://127.0.0.1:8800/consulta", {
          data: {
            tabla: "users",
            columnas: ["*"],
          },
        })
        .then((response) => {
          console.log(response.data.message);
          this.listaUsuarios = response.data.message;
        });
    },
    converteFormat: function (data) {
      let datos = {};
      for (let i in data) datos[i] = { value: data[i] };
      return datos;
    },
    modificar: function (data) {
      console.log(this.converteFormat(data));
      axios
        .post("http://127.0.0.1:8800/modificar", {
          data: {
            tabla: "users",
            data: this.converteFormat(data),
          },
        })
        .then((response) => {
          console.log(response);
          this.actualizar();
        });
    },
    eliminar: function (data) {
      axios
        .post("http://127.0.0.1:8800/eliminar", {
          data: {
            tabla: "users",
            ele: data,
          },
        })
        .then((response) => {
          console.log(response.data.message);
          this.actualizar();
        });
    },
    send: function (idForm) {
      let datosForm = toRaw(this.info)[idForm][0];
      let datosCorrectos = true;
      for (let i in datosForm)
        switch (datosForm[i]["type"]) {
          case "mail":
            if (this.validaEmail(datosForm[i]["value"])["is-invalid"]) {
              datosCorrectos = false;
            }
            break;
          case "text":
            if (this.validaText(datosForm[i]["value"])["is-invalid"]) {
              datosCorrectos = false;
            }
            break;
          default:
            break;
        }
      datosCorrectos
        ? axios
            .post("http://127.0.0.1:8800/insert", {
              data: datosForm,
            })
            .then((response) => {
              console.log(response);
              this.actualizar();
            })
        : alert("Algo Salio Mal");
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
