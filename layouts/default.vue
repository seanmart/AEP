<template lang="html">
  <main id="site" class="text-black">
    <the-navigation/>
    <div id="scroller">
      <nuxt v-if="renderContent"/>
      <the-footer/>
    </div>
  </main>
</template>

<script>
export default {
  data:()=>({
    renderContent: false
  }),
  created(){
    if(process.server) return
    this.initCreated()
  },
  mounted(){
    !isMobile && this.initSmoothScroll()
    setTimeout(this.refresh,250)
    this.renderContent = true
  },
  methods:{
    initCreated(){
      let timeout = null
      let { userAgent, maxTouchPoints, platform } = navigator
      let conditional = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      let html = document.documentElement

      window.isMobile = conditional.test(userAgent) || (platform === "MacIntel" && maxTouchPoints > 1);
      html.classList.add('has-js')
      html.classList.add(window.isMobile ? 'is-mobile' : 'is-desktop')

      window.addEventListener('resize',()=>{
        timeout && clearTimeout(timeout)
        timeout = setTimeout(()=> {html.classList.remove('is-resizing')},100)
        html.classList.add('is-resizing')
      })
    },
    initSmoothScroll(){
      gsap.registerPlugin(ScrollTrigger);
      ScrollBuddy.init({
        el: "#scroller",
        event: ScrollTrigger.update,
        inertia: 0.11,
      });
      ScrollTrigger.defaults({scroller: "#scroller"});
      ScrollTrigger.scrollerProxy("#scroller", {
        scrollTop: (value) => ScrollBuddy.top,
        getBoundingClientRect: () => ({top: 0,left: 0,width: window.innerWidth,height: window.innerHeight}),
      });
    },
    refresh(){
      ScrollTrigger.getAll().length > 0 && ScrollTrigger.refresh(true)
      !isMobile && ScrollBuddy.update()
    }
  }
}
</script>

<style lang="css">
html{
  font-size: 16px;
}

@media screen and (min-width:550px){
  html{
    font-size: calc(16px + (100vw - 550px)/160);
  }
}
</style>
