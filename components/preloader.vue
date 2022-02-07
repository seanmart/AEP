<template lang="html">
  <section id="preloader" class="fixed inset-0 bg-red  hidden" ref="preloader">

  </section>
</template>

<script>
export default {
  mounted(){
    this.$bus.$once('PRELOADER',(cb)=>{
      gsap.timeline({onComplete:cb})
      .to(this.$refs.preloader,1,{y: '100%',ease: 'expo.out'},1)
    })
  }
}
</script>

<style lang="css">
.has-js #preloader{
  display: block;
  z-index: 100;
}

#preloader .preloader__logo{
  outline: 1px solid black;
}
</style>
