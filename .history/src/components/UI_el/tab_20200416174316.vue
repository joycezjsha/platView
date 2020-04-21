<template>
  <div class='tab'>
    <div class='img'><img :src='icon' /></div>
    <div class='label'>{{label}}</div>
    <div class='value'>{{value}}}</div>
  </div>
</template>
<script>

export default {
  data() {
    return {

    };
  },
  props:{
    icon: {
        type: String,
        default: './static/images/default/device.png'
      },
      label: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
  },
  components: {
    
  },
  created() {
  },
  methods: {

</script>
<style scoped lang="scss">
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
</style>