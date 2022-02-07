<template lang="html">
  <nav id="nav" :class="{hide}">

    <nuxt-link id="nav__logo" class="block fixed z-40 left-0 top-0" to="/">
      <the-logo red class="w-32 sm:w-44"/>
    </nuxt-link>

    <container id="nav__bar" noSpace logo class="hidden fixed z-30 top-0 left-0 right-0 h-16 bg-white border-grey border-b flex-row items-center text-xs lg:flex">
      <div class="nav__links flex flex-row">
        <template v-for="(link,i) in nav.links">
          <div class="nav__link mr-2" :class="{'-ml-4': i == 0}">
            <nuxt-link class="py-2 px-4 font-semibold hover:text-blue" :to="link.to" v-html="link.label" />
            <div class="nav-link__sub" v-if="link.items">items</div>
          </div>
        </template>
      </div>
      <div class="nav__cta ml-auto">
        <btn red :to="nav.cta.to" :value="nav.cta.label" class="ml-auto"/>
      </div>
    </container>

    <button id="nav__button" @click="toggleMenu" class="lg:hidden fixed z-40 top-4 right-6 h-16 w-16 flex flex-col justify-center rounded-full bg-pink">
      <icon menu class="stroke-red mx-4"/>
    </button>

    <div id="mobile-nav__links" class="lg:hidden fixed z-30 overflow-hidden top-0 left-0 h-0 w-0 bg-red">
      <div class="md:flex md:flex-col md:items-center h-screen w-screen">
        <div class="h-full flex flex-col justify-center items-start text-white text-2xl px-4 pl-32 sm:pl-44 xs:text-3xl md:pl-0">
          <template v-for="(link,i) in [...nav.links,nav.cta]">
            <nuxt-link class="mobile-nav__link py-3 sm:py-2 font-bold xs:font-semibold" :to="link.to" v-html="link.label" />
          </template>
        </div>
      </div>
    </div>

  </nav>
</template>

<script>
import {mapState} from 'vuex'
export default {
  mounted(){
    this.navBar = document.querySelector('#nav__bar')
    this.links = document.querySelector('.nav__links')
    this.logo = document.querySelector('#nav__logo')
    this.logoMark = document.querySelector('.c-logo-mark')
    this.logoType = document.querySelector('.c-logo-type')
    this.mobileLinks = document.querySelector('#mobile-nav__links')
    this.mobileLink = document.querySelectorAll('.mobile-nav__link')
    this.button = document.querySelector('#nav__button')

    this.$nextTick(this.init)
    this.$bus.$once('REVEAL',this.reveal)
  },
  destroyed(){
    this.scrolledAnim && this.scrolledAnim.kill()
  },
  computed:mapState({
    nav: state => state.lists.nav
  }),
  data:()=>({
    logoIsSmall:false,
    navIsHidden:false,
    screenIsLarge: true,
    menuIsOpen:false,
    hide: true
  }),
  watch:{
    logoIsSmall(){!this.menuIsOpen && this.toggleLogo()},
    navIsHidden(){!this.menuIsOpen && this.toggleNav()},
    $route(){this.menuIsOpen && this.toggleMenu()}
  },
  methods:{
    reveal(){
      gsap.timeline({onComplete: ()=> this.hide = false})
      .to(this.navBar,1,{y:0,ease:'expo.out'},0)
      .to(this.button,1,{y:0,ease:'expo.out'},'<')
      .to(this.logo,1,{x:0,ease:'expo.out'},'<')
    },
    init(){
      ScreenBuddy.onLg((matches)=>{
        gsap.set(this.mobileLinks,{clearProps:'all'})
        this.screenIsLarge = matches
        this.menuIsOpen = false
        !this.hide && this.toggleLogo()
      })
      this.scrolledAnim = ScrollTrigger.create({
        start: 50,
        end: 99999,
        onEnter:()=> this.logoIsSmall = true,
        onLeaveBack:()=> this.logoIsSmall = false,
        onUpdate:(self)=> this.navIsHidden = self.direction == 1
      })
    },
    toggleNav(){
      this.navIsHidden
      ? gsap.to(this.screenIsLarge ? this.navBar : this.button,1,{y:'-150%',ease: 'expo.inOut'})
      : gsap.to(this.screenIsLarge ? this.navBar : this.button,1,{y:0,ease: 'expo.inOut'})
    },
    toggleLogo(){
      let tl = gsap.timeline()
      if(this.logoIsSmall && !this.menuIsOpen){
        let logoWidth = this.logo.clientWidth
        let linksWidth = this.links.clientWidth
        if(this.screenIsLarge){
          tl.to(this.logo,1,{y:'-60%',x: '-50%',ease: 'expo.inOut'})
          tl.to(this.logoMark,1,{scale: .5,y:'162%', x:'67%',ease: 'expo.inOut'},'<')
          tl.to(this.logoType,1,{y:'205%',x:'83%', ease: 'expo.inOut'},'<')
          tl.to(this.links,1,{x:`-${(logoWidth * .5) / linksWidth * 100}%`,ease: 'expo.inOut'},'<')
        }else{
          tl.to(this.logo,1,{y:'-43.4%',x: '-30%',ease: 'expo.inOut'})
          tl.to(this.logoMark,1,{scale: .7,y:'128%', x:'40%',ease: 'expo.inOut'},'<')
          tl.to(this.logoType,1,{y:'170%',x:'50%', ease: 'expo.inOut'},'<')
          tl.to(this.links,1,{x:`-${(logoWidth * .6) / linksWidth * 100}%`,ease: 'expo.inOut'},'<')
        }
      } else {
        tl.to(this.logo,1,{y:0,x:0,ease: 'expo.inOut'})
        tl.to(this.logoMark,1,{scale:1,y:0, x:0,ease: 'expo.inOut'},'<')
        tl.to(this.logoType,1,{y:0,x:0,ease: 'expo.inOut'},'<')
        tl.to(this.links,1,{x:0,ease: 'expo.inOut'},'<')
      }
    },
    toggleMenu(){
      let rect = this.logo.getBoundingClientRect()
      let width = -2 + (this.logoIsSmall ? (rect.width * (this.screenIsLarge ? .5 : .7)) : rect.width)
      let height = -2 + (this.logoIsSmall ? (rect.height * (this.screenIsLarge ? .4 : .566)) : rect.height)
      let tl = gsap.timeline()

      this.menuIsOpen = !this.menuIsOpen

      if (this.menuIsOpen){
        tl.set(this.mobileLink,{y:'200%'})
        tl.set(this.mobileLinks,{width,height})
        tl.call(this.toggleLogo)
        tl.to(this.mobileLinks,1,{height: '100%',width: '100%', ease: 'expo.inOut'},'<')
        tl.to(this.mobileLink,1,{y:0,opacity:1,stagger:.05,ease: 'expo.out'},'<+=.25')
      } else {
        tl.call(this.toggleLogo)
        tl.to(this.mobileLink,.5,{opacity:0,y:'200%',ease: 'expo.in'},'<')
        tl.to(this.mobileLinks,1,{width,height, ease: 'expo.inOut'},'<')
        tl.set([this.mobileLinks,this.mobileLink],{clearProps:'all'})
      }
    }
  }
}
</script>

<style lang="css">

  .has-js #nav.hide #nav__logo{
    transform: translateX(-100%);
  }
  .has-js #nav.hide #nav__bar{
    transform: translateY(-100%);
  }
  .has-js #nav.hide #nav__button{
    transform: translateY(-150%);
  }

  #nav__button svg{
    stroke-width:3px;
  }
  #mobile-nav__links .mobile-nav__link{
    opacity: 0;
  }
</style>
