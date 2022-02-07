<template lang="html">
  <main id="site" class="text-black">
    <the-navigation/>
    <div id="scroller">
      <div id="content">
        <nuxt/>
      </div>
      <the-footer/>
    </div>
    <preloader v-if="renderPreloader"/>
  </main>
</template>

<script>
export default {
  data:()=>({
    renderPreloader: true
  }),
  created(){
    if(process.server) return
    this.initCreated()
  },
  mounted(){
    gsap.set('#scroller',{opacity:0})
    this.$bus.$emit('PRELOADER',()=>{
      gsap.to('#scroller',.25,{opacity:1})
      this.$bus.$emit('REVEAL')
      this.renderPreloader = false
      this.refresh()
    })
  },
  watch:{
    $route(){
      this.refresh()
      gsap.to('#scroller',.25,{delay:.25, opacity:1,onComplete:()=>{
        !isMobile && ScrollBuddy.update()
        this.$bus.$emit('REVEAL')
      }})
    }
  },
  middleware({route, from}){
    if (process.server || from.path == route.path) return;
    return new Promise(res =>{
      gsap.to('#scroller',.25,{opacity:0,onComplete:res})
    })
  },
  methods:{
    initCreated(){
      let timeout = null
      let html = document.documentElement

      window.addEventListener('resize',()=>{
        timeout && clearTimeout(timeout)
        timeout = setTimeout(()=> {html.classList.remove('is-resizing')},100)
        html.classList.add('is-resizing')
      })

      !isMobile && this.initSmoothScroll()
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
      !isMobile && ScrollBuddy.reset()
    }
  }
}
</script>

<style lang="css">
html{
  font-size: 16px;
  background: #FFFFFF;
}
body{
  background: #FFFFFF;
}

.bg-image{
  background-size: cover;
  background-position: center center;
}

.bg-top{
  background-position: top center;
}

#content{
  min-height: 50vh;
}

@media screen and (min-width:550px){
  html{
    font-size: calc(16px + (100vw - 550px)/160);
  }
}
</style>
