<template>
  <div class="traffic-index">
    <index></index>
  </div>
</template>

<script>
import index from "./city_index";
export default {
  name: "TCruise",
  data() {
    return {
    };
  },
  components:{
index
  },
  mounted() {
    
  },
  destroyed() {
  },
  methods: {
  }
};
</script>
<style>
.traffic-index{
  position:fixed;
}
</style>