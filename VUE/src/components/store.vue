<template>
  <div class="card col-md-10 mx-auto mt-3">
    <div class="listProducts">
      <div v-for="(ele, i) in productsList" v-bind:key="i" class="product">
        <img src="../assets/producto.png">
        <h3>{{ productsList[i].nombre }}</h3>
        <p>{{ productsList[i].descripcion }}</p>
        <div v-bind:id="i" class="control card">
          <button v-bind:id="i" class="btn btn-danger" @click="deleteItem(ele.id_producto)"
            :disabled="cart[ele.id_producto] == undefined">
            -
          </button>
          <p v-if="cart[ele.id_producto] != undefined">
            {{ cart[ele.id_producto].qty }}
          </p>
          <button v-bind:id="i" class="btn btn-success" @click="addItem(ele.id_producto, productsList[i].stock)"
            :disabled="cart[ele.id_producto]?.qty == productsList[i].stock || productsList[i].stock == 0">
            +
          </button>
        </div>
      </div>
      <EjemploDos/>
    </div>
    <div class="carrito"><button class="car btn btn-primary" v-on:click="showCar = !showCar"
        v-if="Object.keys(cart).length > 0"><i class='fa fa-shopping-cart'></i>
        <p>{{ Object.keys(cart).length }}</p>
      </button>
      <div class="lista_carrito" v-if="showCar && Object.keys(cart).length > 0">
        <div v-for="(ele, i) in cart" v-bind:key="i" class="miniProduct">
          <img src="../assets/producto.png">
          <div class="data">
            <p>Producto: {{ cart[i].name }}</p>
            <p>Cantidad: {{ cart[i].qty }}</p>
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
      productsList: [],
      cart: {},
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
            this.productsList = response2.data.message;
          });
      });
    },
    deleteItem(id) {
      (this.cart[id] != undefined) ? (
        this.cart[id].qty == 1 ? delete this.cart[id] : this.cart[id].qty--) : alert("No hay mas en el Carrito");
    },
    addItem(id, max) {
      (this.cart[id] != undefined) ? (
        this.cart[id].qty == max ? alert("No hay mas en Stock") : this.cart[id].qty++) : this.cart[id] = { name: this.find(id).nombre, qty: 1 };

    },
    find(id) {
      for (let ele of this.productsList)
        if (ele.id_producto == id)
          return ele;
      return null;
    },
    send: function (idForm) {
      let dataForm = toRaw(this.info)[idForm][0];
      let errores = this.check(dataForm);
      errores.length == 0
        ? axios.get("http://127.0.0.1:8800/login", {}).then((response) => {
          axios
            .post("http://127.0.0.1:8800/insert", {
              data: dataForm,
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
  },
};
</script>
<style>
@import "../assets/main.css";
</style>