<template>
  <div class="card col-md-10 mx-auto mt-3">
    <div class="listProducts">

        <div v-for="(ele, i) in info" v-bind:key="i+'edfsw'" class="product">
          <img src="../assets/producto.jpg">
        </div>
      </div>
  </div>
</template>
<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'/>            

<script>

export default {
  name: "ListContents",
  props: { datos: {} },
  data() {
    return {
      info: this.datos
    };
  },
}
</script>