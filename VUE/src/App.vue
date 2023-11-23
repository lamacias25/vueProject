<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <button v-on:click=" page='product_list'">Lista de Contenidos</button>
  <button v-on:click=" page='admin_list'">Administracion de Productos</button>
  <FormContenido v-if="page=='admin_list'"/>
  <StoreContent v-if="page=='product_list'"/>
</template>

<script>
import FormContenido from "./components/content.vue";
import StoreContent from "./components/store.vue";

export default {
  name: "App",
  components: {
    FormContenido,
    StoreContent,
  },
  data() {
    return {
      info: null,
      page: "product_list"
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
