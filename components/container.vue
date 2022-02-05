<template lang="html">
  <div :class="classes">
    <slot/>
  </div>
</template>

<script>
export default {
  props:{
    padX:Boolean,
    padY:Boolean,
    padT:Boolean,
    padL:Boolean,
    padR:Boolean,
    padB:Boolean,
    margY:Boolean,
    margB:Boolean,
    margT:Boolean,
    navX:Boolean,
    navXAll:Boolean,
    navY:Boolean,
    navYAll:Boolean
  },
  computed:{
    classes(){

      let noProps = true
      Object.keys(this.$props).forEach(p => p && (noProps = false))

      return{
        'mt-16': noProps || this.margT,
        'mb-16': noProps || this.margB,
        'pt-16': (this.navY || this.padT || this.padY) && !this.navYAll,
        'pb-16': this.padB || this.padY,
        'pl-6 sm:pr-12': (noProps || this.padL || this.padX) && !this.navXAll,
        'pr-6 sm:pl-12': noProps || this.padR || this.padX,
        'lg:pl-56': (noProps || this.navX) && !this.navXAll,
        'lg:pt-32': this.navY || this.navYAll,
        'pt-28 xs:pt-16': this.navYAll,
        'pl-38 sm:pl-56': this.navXAll
      }
    }
  }
}
</script>
