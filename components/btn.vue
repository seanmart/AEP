<template lang="html">
  <component :is="to ? 'nuxt-link' : 'button'" :to="to" class="button rounded-md font-semibold py-2 px-4" :class="classes">
    <slot>{{value}}</slot>
  </component>
</template>

<script>
export default {
  props:{
    red:Boolean,
    white: Boolean,
    blue: Boolean,
    green: Boolean,
    black: Boolean,
    to: String,
    value: String
  },
  computed:{
    classes(){
      return{
        'text-white': !this.white,
        'bg-red': this.red,
        'bg-white': this.white,
        'bg-blue': this.blue,
        'bg-green': this.green,
        'bg-black': this.black,
      }
    }
  }
}
</script>

<style lang="css">

</style>
