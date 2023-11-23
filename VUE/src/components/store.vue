<template>
  <div class="card col-md-10 mx-auto mt-3">
    <div class="carrito"><p>{{ carrito }}</p></div>
    <div class="listProducts">

        <div v-for="(ele, i) in listaUsuarios" v-bind:key="i" class="product">
          <img src="../assets/producto.jpg">
          <h1>{{listaUsuarios[i].nombre}}</h1>
          <p>{{listaUsuarios[i].paterno}}</p>
          <div v-bind:id="i" class="control">
            <button
              v-bind:id="i"
              class="btn btn-danger"
              @click="eliminarCarrito(ele.id_users)"
            >
              -
            </button>
            <p>
              {{listaUsuarios[i].stock}}
            </p>
            <button
              v-bind:id="i"
              class="btn btn-success"
              @click="agregarCarrito(ele.id_users )"
            >
              +
            </button>
          </div>
            
        </div>
      </div>
  </div>
</template>

<script>
import axios from "axios";
import { toRaw } from "vue";

export default {
  name: "StoreContent",
  props: { datos: [] },
  data() {
    return {
      info: this.datos,
      listaUsuarios: [],
      carrito:0
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
    validaNumber: function (value) {
      return {
        "is-valid": /^([0-9])*$/.test(
          value
        ),
        "is-invalid": !/^([0-9])*$/.test(
          value
        ),
      };
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
      for (let i in data){
        console.log(data[i]);
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
            case "number":
              if (this.validaNumber(data[i]["value"])["is-invalid"]){
                datosForm.push(data[i]["value"]);
              }
              break;
            default:
              break;
          }
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
        datos[i] = { value: data[i], type: i == "correo" ? "mail": (i == "stock")?"number":"text" };
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
    eliminar: function (id) {
      console.log(id);
    },
    eliminarCarrito(){
      this.carrito--;
    },
    agregarCarrito(){
      this.carrito++;
    },
    send: function (idForm) {
      let datosForm = toRaw(this.info)[idForm][0];
      let errores = this.check(datosForm);
      errores.length == 0
        ? axios.get("http://127.0.0.1:8800/login", {}).then((response) => {
          console.log(response);
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
      label: "Producto",
    });
    inputs.push({
      name: "materno",
      type: "text",
      label: "Descripcion",
    });
    inputs.push({
      name: "stock",
      type: "number",
      label: "Stock",
    });
    let formulario = {
      0: inputs,
    };
    this.info = [];
    this.info.push(formulario);
  },
};
</script>
<style>
.product {
    width: 350px;
    height: 250px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    margin: 5px;
    border: solid 1px #0000006e;
    box-shadow: inset 0px 0px 16px black;
}
.product > img {
    width: 98px;
    height: 100px;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
}
.listProducts {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
}
.control {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: baseline;
}
.carrito {
    position: fixed;
    top: 0px;
    right: 0px;
    width: 50px;
    height: 50px;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: baseline;
}
</style>