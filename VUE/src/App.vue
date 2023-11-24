<template>
  <div class="header">
    <img alt="Vue logo" src="./assets/logo.png" />
    <button v-on:click="page = 'product_list'">Lista de Contenidos</button>
    <button v-on:click="page = 'admin_list'">Administracion de Productos</button>
  </div>
  <FormContenido v-if="page == 'admin_list'" />
  <StoreContent v-if="page == 'product_list'" />
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

.header {
  height: 50px;
  width: -webkit-fill-available;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  top: 0px;
  position: fixed;
  box-shadow: inset 0px -7px 13px #00000070;
  z-index: 1;
  backdrop-filter: blur(5px);
  border: none;
  padding-right: 60px;
}

.header button {
  font-size: 14px;
  border: none;
  box-shadow: inset 0px 0px 5px #090909;
  margin: 2px;
}
</style>
