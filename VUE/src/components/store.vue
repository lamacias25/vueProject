<template>
  <div class="card col-md-10 mx-auto mt-3">
    <div class="listProducts">
        <div v-for="(ele, i) in listaUsuarios" v-bind:key="i" class="product">
          <img src="../assets/producto.jpg">
          <h3>{{listaUsuarios[i].nombre}}</h3>
          <p>{{listaUsuarios[i].descripcion}}</p>
          <div v-bind:id="i" class="control card">
            <button
              v-bind:id="i"
              class="btn btn-danger"
              @click="eliminarCarrito(ele.id_producto)"
              :disabled="carrito[ele.id_producto]==undefined"
            >
              -
            </button>
            <p v-if="carrito[ele.id_producto]!=undefined">
              {{carrito[ele.id_producto]}}
            </p>
            <button
              v-bind:id="i"
              class="btn btn-success"
              @click="agregarCarrito(ele.id_producto, listaUsuarios[i].stock )"
              :disabled="carrito[ele.id_producto]==listaUsuarios[i].stock || listaUsuarios[i].stock==0"
            >
              +
            </button>
          </div>
        </div>
    </div>
    <div class="carrito"><button class="car" v-on:click=" showCar=!showCar" v-if="Object.keys(carrito).length>0"><i class='fa fa-shopping-cart'></i><p>{{ Object.keys(carrito).length }}</p></button>
      
      <div class="lista_carrito" v-if="showCar && Object.keys(carrito).length>0">
      <div v-for="(ele, i) in carrito" v-bind:key="i" class="miniProduct">
          <img src="../assets/producto.jpg">
          <p>{{carrito[i]}}</p>
        </div>
        </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { toRaw } from "vue";
import ListContents from "./lista.vue";

export default {
  name: "StoreContent",
  component:{
    ListContents
  },
  props: { datos: [] },
  data() {
    return {
      info: this.datos,
      listaUsuarios: [],
      carrito:{},
      showCar:false
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
        if (i != "id_producto")
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
    eliminarCarrito(id){
      (this.carrito[id]!=undefined)?(
        this.carrito[id]==1?delete this.carrito[id]:this.carrito[id]--):alert("No hay mas en el Carrito");
    },
    agregarCarrito(id, max){
      console.log(this.carrito);
      (this.carrito[id]!=undefined)?(
        this.carrito[id]==max?alert("No hay mas en Stock"):this.carrito[id]=this.carrito[id]+1):this.carrito[id]=1;
      
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
  width: 250px;
    height: 350px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    margin: 5px;
    border: solid 1px #0000006e;
    box-shadow: inset 0px 0px 16px #00000085;
}
.product > img {
    width: 98px;
    height: 100px;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
}
.product p {
    max-height: 90px;
    overflow: hidden;
    text-align: justify;
    margin: 10px;
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
    width: fit-content;
    margin: auto;
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
.control > button {
    width: 30px;
    height: 30px;
    line-height: 10px;
    font-size: 25px;
    text-align: center;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
}
.control > *:disabled {
  background-color: dimgrey;
    color: linen;
    opacity: 0.4;
    border: none;

}
.lista_carrito {
    position: fixed;
    right: 0px;
    top: 0px;
    width: 40%;
    height: -webkit-fill-available;
    border: solid 1px grey;
    overflow: auto;
    backdrop-filter: blur(17px);
}
.miniProduct {
    padding: 5px;
    width: -webkit-fill-available;
    height: 80px;
    display: flex;
}
.miniProduct > img {
    width: 80px;
}
.car {
  z-index: 1;
    width: 49px;
    height: 40px;
    font-size: 24px;
    line-height: 39px;
    background: wheat;
}
.car > p {
    position: absolute;
    top: 20px;
    right: 2px;
    color: black;
    backdrop-filter: blur(4px);
    width: fit-content;
    height: 20px;
    font-size: 21px;
    line-height: 18px;
    padding: 3px;
}
</style>