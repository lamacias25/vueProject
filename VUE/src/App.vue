<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <FormContenido />
</template>

<script>
import FormContenido from "./components/content.vue";

export default {
  name: "App",
  components: {
    FormContenido,
  },
  data() {
    return {
      info: null,
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
