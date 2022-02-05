<template lang="html">
  <nav id="nav" ref="nav">

    <nuxt-link id="nav__logo" class="fixed z-40 top-0" to="/">
      <the-logo red class="w-32 sm:w-44"/>
    </nuxt-link>

    <container padL padR navX id="nav__links" class="hidden lg:block fixed z-30 top-0 left-0 right-0 bg-white border-grey border-b">
      <div class="h-16 flex flex-row items-center justify-start text-xs">
        <template v-for="(link,i) in nav">

          <div v-if="i < nav.length - 1" class="nav-link mr-2" :class="{'-ml-4': i == 0}">
            <nuxt-link class="py-2 px-4 font-semibold" :to="link.to" v-html="link.label" />
            <div class="nav-link__sub" v-if="link.items">
              items
            </div>
          </div>

          <btn v-else red :to="link.to" :value="link.label" class="ml-auto"/>

        </template>
      </div>
    </container>

    <button
    id="nav__button"
    @click="toggleNav"
    class="lg:hidden fixed z-40 top-4 right-6 h-16 w-16 flex flex-col justify-center rounded-full bg-pink"
    >
      <icon menu class="stroke-red mx-4"/>
    </button>

    <div id="mobile-nav__links" class="lg:hidden fixed z-30 overflow-hidden top-0 left-0 h-0 w-0 bg-red">
      <div class="md:flex md:flex-col md:items-center h-screen w-screen">
        <div class="h-full flex flex-col justify-center items-start text-white text-2xl px-4 pl-32 sm:pl-44 xs:text-3xl md:pl-0">
          <template v-for="(link,i) in nav">
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
    this.$nextTick(this.init)
  },
  destroyed(){
    this.scrolledAnim && this.scrolledAnim.kill()
  },
  computed:mapState({
    nav: state => state.lists.nav
  }),
  data:()=>({
    logoSmall:false,
    navHidden:false,
    isLarge: true,
    menuIsOpen:false,
    cancelMenuToggle:false
  }),
  watch:{
    logoSmall(){
      !this.menuIsOpen && this.checkLogo()
    },
    navHidden(){
      !this.menuIsOpen && this.checkNav()
    },
    isLarge(large){
      if (!this.logoSmall) return
      large ? this.logoAnimLarge() : this.logoAnimSmall()
    }
  },
  methods:{
    init(){
      this.links = document.querySelector('#nav__links')
      this.mobileLinks = document.querySelector('#mobile-nav__links')
      this.mobileLink = document.querySelectorAll('.mobile-nav__link')
      this.button = document.querySelector('#nav__button')
      this.logo = document.querySelector('#nav__logo')
      this.logoMark = document.querySelector('#nav__logo .c-logo-mark')
      this.logoType = document.querySelector('#nav__logo .c-logo-type')

      ScreenBuddy.onLg((matches)=>{
        gsap.set([this.mobileLinks,this.logoWrapper],{clearProps:'all'})
        this.menuIsOpen = false
        this.isLarge = matches
      })
      this.scrolledAnim = ScrollTrigger.create({
        start: 50,
        end: 99999,
        onEnter:()=> this.logoSmall = true,
        onLeaveBack:()=> this.logoSmall = false,
        onUpdate:(self)=> this.navHidden = self.direction == 1
      })

    },
    toggleNav(){
      this.menuIsOpen = !this.menuIsOpen
      this.menuIsOpen ? this.menuAnimOpen() : this.menuAnimClose()
    },
    checkLogo(){
      this.logoSmall
      ? this.isLarge ? this.logoAnimLarge() : this.logoAnimSmall()
      : this.logoAnimReset()
    },
    checkNav(){
      this.navHidden
      ? this.isLarge ? this.navAnimLarge() : this.navAnimSmall()
      : this.navAnimReset()
    },
    logoAnimLarge(){
      gsap.timeline()
      .to(this.logo,1,{y:'-50%',x:0,ease: 'expo.inOut'})
      .to(this.logoMark,1,{scale: .8,y:'132.5%', x:'9.5%',ease: 'expo.inOut'},'<')
      .to(this.logoType,1,{y:'200%',x:0,ease: 'expo.inOut'},'<')
    },
    logoAnimSmall(){
      gsap.timeline()
      .to(this.logo,1,{y:'-50%',x: '-30%',ease: 'expo.inOut'})
      .to(this.logoMark,1,{scale: .7,y:'137%', x:'41%',ease: 'expo.inOut'},'<')
      .to(this.logoType,1,{y:'200%',x:'50%', ease: 'expo.inOut'},'<')
    },
    logoAnimReset(){
      gsap.timeline()
      .to(this.logo,1,{y:0,x:0,ease: 'expo.inOut'})
      .to(this.logoMark,1,{scale:1,y:0, x:0,ease: 'expo.inOut'},'<')
      .to(this.logoType,1,{y:0,x:0,ease: 'expo.inOut'},'<')
    },
    navAnimLarge(){
      gsap.to(this.links,1,{y:'-150%',ease: 'expo.inOut'})
    },
    navAnimSmall(){
      gsap.to(this.button,1,{y:'-150%',ease: 'expo.inOut'})
    },
    navAnimReset(){
      gsap.to([this.button,this.links],1,{y:0,ease: 'expo.inOut'})
    },
    menuAnimOpen(){
      let rect = this.logo.getBoundingClientRect()
      let width = (rect.width + rect.left) - 2
      let height = (rect.height + rect.top) - 2

      gsap.timeline()
      .set(this.mobileLink,{y:'200%'})
      .set(this.mobileLinks,{width,height})
      .call(this.logoAnimReset)
      .to(this.mobileLinks,1,{height: '100%',width: '100%', ease: 'expo.inOut'},'<')
      .to(this.mobileLink,1,{y:0,opacity:1,stagger:.05,ease: 'expo.out'},'<+=.25')
    },
    menuAnimClose(){
      let rect = this.logo.getBoundingClientRect()
      let width = this.logoSmall ? (rect.width * .7) - 2 : rect.width - 2
      let height = this.logoSmall ? (rect.height / 2) - 2 : rect.height - 2

      gsap.timeline()
      .call(this.checkLogo)
      .to(this.mobileLink,.5,{opacity:0,y:'200%',ease: 'expo.in'},'<')
      .to(this.mobileLinks,1,{height,width, ease: 'expo.inOut'},'<')
      .set([this.mobileLinks,this.mobileLink],{clearProps:'all'})
    }
  }
}
</script>

<style lang="css">
  #nav__button svg{
    stroke-width:3px;
  }
  #mobile-nav__links .mobile-nav__link{
    opacity: 0;
  }
</style>
