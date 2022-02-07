<template lang="html">
  <div class="c-container" :class="classes">
    <slot/>
  </div>
</template>

<script>
export default {
  props:{
    nav: {type:Boolean,default:false},
    navLarge:{type:Boolean,default:false},
    logo: {type:Boolean,default:false},
    spaceTop: {type:Boolean,default:false},
    spaceBottom: {type:Boolean,default:false},
    padTop: {type:Boolean,default:false},
    padBottom: {type:Boolean,default:false},
    fullWidth: {type:Boolean,default:false}
  },
  computed:{
    classes(){
      return{
        'mt-16': this.spaceTop,
        'mb-16': this.spaceBottom,
        'pt-16': (this.padTop || this.navLarge) && !this.nav,
        'pb-16': this.padBottom,
        'pl-5 sm:pl-16 lg:pl-38':!this.fullWidth && !this.logo,
        'pr-5 sm:pr-16': !this.fullWidth,
        'pl-38 sm:pl-60': this.logo,
        'lg:pt-32': this.nav || this.navLarge,
        'pt-28 xs:pt-16': this.nav
      }
    }
  }
}
</script>
