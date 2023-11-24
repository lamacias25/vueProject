<template>
  <div class="card col-md-10 mx-auto mt-3">
    <div class="listProducts">
      <div v-for="(ele, i) in listaUsuarios" v-bind:key="i" class="product">
        <img src="../assets/producto.png">
        <h3>{{ listaUsuarios[i].nombre }}</h3>
        <p>{{ listaUsuarios[i].descripcion }}</p>
        <div v-bind:id="i" class="control card">
          <button v-bind:id="i" class="btn btn-danger" @click="eliminarCarrito(ele.id_producto)"
            :disabled="carrito[ele.id_producto] == undefined">
            -
          </button>
          <p v-if="carrito[ele.id_producto] != undefined">
            {{ carrito[ele.id_producto].qty }}
          </p>
          <button v-bind:id="i" class="btn btn-success" @click="agregarCarrito(ele.id_producto, listaUsuarios[i].stock)"
            :disabled="carrito[ele.id_producto]?.qty == listaUsuarios[i].stock || listaUsuarios[i].stock == 0">
            +
          </button>
        </div>
      </div>
      <EjemploDos/>
    </div>
    <div class="carrito"><button class="car btn btn-primary" v-on:click="showCar = !showCar"
        v-if="Object.keys(carrito).length > 0"><i class='fa fa-shopping-cart'></i>
        <p>{{ Object.keys(carrito).length }}</p>
      </button>
      <div class="lista_carrito" v-if="showCar && Object.keys(carrito).length > 0">
        <div v-for="(ele, i) in carrito" v-bind:key="i" class="miniProduct">
          <img src="../assets/producto.png">
          <div class="data">
            <p>Producto: {{ carrito[i].name }}</p>
            <p>Cantidad: {{ carrito[i].qty }}</p>
          </div>
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
      carrito: {},
      showCar: false
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
    actualizar: function () {
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
    eliminarCarrito(id) {
      (this.carrito[id] != undefined) ? (
        this.carrito[id].qty == 1 ? delete this.carrito[id] : this.carrito[id].qty--) : alert("No hay mas en el Carrito");
    },
    agregarCarrito(id, max) {
      (this.carrito[id] != undefined) ? (
        this.carrito[id].qty == max ? alert("No hay mas en Stock") : this.carrito[id].qty++) : this.carrito[id] = { name: this.find(id).nombre, qty: 1 };

    },
    find(id) {
      for (let ele of this.listaUsuarios)
        if (ele.id_producto == id)
          return ele;
      return null;
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
              this.actualizar();
            });
        })
        : alert("Existen errores en: " + errores);
    },
  },
  mounted() {
    this.actualizar();
  },
};
</script>
<style>
@import "../assets/main.css";
</style>