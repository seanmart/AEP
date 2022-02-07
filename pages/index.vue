<template>
  <div id="home" :class="{hide}">
    <div class="relative overflow-hidden">

      <container v-if="data.banner" nav logo class="c-banner">
        <template v-for="(line, i) in data.banner">
          <div class="c-banner__title-wrapper overflow-hidden">
            <h1 class="c-banner__title font-serif" :class="{ 'text-red': line.spans.length > 0 }" v-html="line.text"/>
          </div>
        </template>
      </container>

      <div class="c-links w-screen lg:absolute lg:top-0 lg:right-0 lg:bottom-0">
        <container v-if="data.links" nav fullWidth class="c-links__wrapper lg:px-12">
          <div class="relative h-64 sm:h-72 lg:h-auto">
            <template v-for="link in [...data.links, {fake:true}]">
              <div class="c-links__link absolute w-64 top-0 left-0 rounded-full overflow-hidden sm:w-72 lg:w-full lg:relative lg:mb-2" :class="{'hidden lg:block':link.fake}">
              <div v-if="link.image" class="bg-image pb-full w-full" :style="{backgroundImage: `url(${link.image.url})`}"/>
              <div v-else class="pb-full w-full bg-pink"/>
              </div>
            </template>
          </div>
        </container>
      </div>

      <container v-if="data.mission" spaceTop padTop padBottom class="c-mission bg-grey relative">
        <div class="featured-stories--max-width relative z-20 mx-auto lg:mx-0">
          <div class="text-center text-lg lg:text-base lg:text-left" v-html="$prismic.asHtml(data.mission)" />
          <div class="w-full pb-half" />
        </div>
        <div class="c-mission__bg absolute inset-0 z-10" :style="{backgroundImage: `url(/patterns/pattern1.svg)`}"/>
      </container>

    </div>

    <container spaceBottom v-if="stories.length > 0" class="relative z-20">
      <div class="flex flex-col lg:flex-row">
        <!-- top left -->
        <div class="flex-initial w-full featured-stories--max-width mx-auto lg:mx-0">
          <div class="w-full pb-half relative">
            <div class="absolute left-0 right-0 bottom-0 -top-full overflow-hidden">
              <div class="relative h-full bg-blue">
                <template v-for="(item, i) in stories">
                  <figure
                    class="absolute inset-0 bg-image"
                    :style="{backgroundImage: `url(${item.data.photo.url})`}"
                  />
                </template>
              </div>
            </div>
          </div>
        </div>
        <!-- top right -->
        <div class="flex-auto c-feature-stories--min-width mt-5 lg:self-end">
          <div class="featured-stories--max-width c-feature-stories__titles mx-auto lg:mx-0 lg:pl-12 relative overflow-hidden">
            <h3 class="font-serif text-4xl lg:text-2xl leading-none pb-1" v-html="stories[1].data.title" />
          </div>
        </div>
      </div>
      <div class="flex flex-col-reverse lg:flex-row sm:text-xs">
        <!-- bottom left -->
        <div class="flex-initial w-full featured-stories--max-width mx-auto lg:text-right lg:mx-0 text-red mt-5">
          slide selector will go here
        </div>
        <!-- bottom right -->
        <div class="flex-auto c-feature-stories--min-width mt-5">
          <div class="featured-stories--max-width mx-auto lg:mx-0 lg:pl-12 relative">
            <p v-html="stories[0].data.description" />
          </div>
        </div>
      </div>
    </container>

    <template v-for="item in data.body">
      <component :is="camelize(item.slice_type)" :data="item"/>
    </template>

  </div>
</template>

<script>
import storiesQuery from "@/assets/queries/stories";
import {camelize} from '@/assets/helpers'
export default {
  name: "Home",
  async asyncData({ store, $prismic }) {
    let res = null;
    if (!store.state.pages.home) {
      res = await $prismic.api.getSingle("home");
      store.commit("PAGE", ["home", res.data]);
    }
    if (store.state.lists.stories.length == 0) {
      res = await storiesQuery($prismic);
      res && store.commit("LIST", ["stories", res.results]);
    }
    let stories = store.state.lists.stories || [];
    let data = store.state.pages.home || {};
    return { data, stories };
  },
  mounted(){
    this.title = document.querySelectorAll('.c-banner__title')
    this.links = document.querySelector('.c-links')
    this.linksWrapper = document.querySelector('.c-links__wrapper')
    this.link = document.querySelectorAll('.c-links__link')

    this.$nextTick(this.initLinks)
    this.$bus.$once('REVEAL',this.reveal)
  },
  destroyed(){
    this.mq && this.mq.kill()
    this.linksAnim && this.linksAnim.kill()
  },
  data: () => ({
    data: {},
    stories: [],
    camelize,
    hide: true
  }),
  methods:{
    reveal(){
      gsap.timeline({onComplete:()=> this.hide = false})
      .to(this.title,1,{y:0,stagger:.08,ease: 'expo.out'},0)
      .to(this.link,1,{scale:1,stagger:.08,ease: 'expo.out'},0)
    },
    initLinks(){
      if (!this.data.links || this.data.links.length == 0) return
      this.mq = ScreenBuddy.onLg((matches)=>{
        gsap.set([this.linksWrapper,this.link],{clearProps:'all'})
        this.linksAnim && this.linksAnim.kill()
        matches ? this.linksVertical() : this.linksHorizontal()
      })
    },
    linksHorizontal(){
      let gap = 3
      let offset = 20
      let limit = (this.link.length - 1) * (100 + gap)
      gsap.set(this.link,{x:(i)=> `${(i * (100 + gap)) - offset}%`})
      this.linksAnim = gsap.to(this.link, {
        duration: 50,
        ease: "none",
        x: `+=${limit}%`,
        modifiers: {x: gsap.utils.unitize(x => (parseFloat(x) % limit) - (100 + offset), "%")},
        repeat: -1,
        scrollTrigger:{
          trigger:this.links,
          start:'top bottom',
          end:'bottom top',
          toggleActions:'play pause play none'
        }
      });
    },
    linksVertical(){
      let offset = ()=>{
        let triggerHeight = this.links.offsetHeight
        let linksHeight = this.linksWrapper.offsetHeight
        let linkHeight = this.link[0].offsetHeight
        return (triggerHeight - linksHeight) + linkHeight / 2
      }
      this.linksAnim = gsap.to(this.linksWrapper,1,{y:offset, ease: 'none',scrollTrigger:{
        trigger:this.links,
        start:'top top',
        end:'bottom top',
        scrub:true,
        invalidateOnRefresh: true
      }})
    }
  }
};
</script>

<style media="screen">
#home .c-banner {
  font-size: calc((100vw - 11rem) / 4.5);
}
#home .c-banner__title-wrapper {
  margin-top: -0.2em;
}
#home .c-banner__title-wrapper:first-child {
  margin-top: 0px;
}
#home .c-banner__title {
  font-size: 1em;
  line-height: 0.9;
  padding-bottom: 0.15em;
}
#home .c-mission__bg{
  opacity: .3;
  background-size: cover;
  background-position: center center;
}
#home .featured-stories--max-width {
  max-width: 500px;
}
.has-js #home.hide .c-banner__title{
  transform: translateY(100%);
}
.has-js #home.hide .c-links__link{
  transform: scale(0)
}

@screen sm {
  #home .c-banner {
    font-size: calc((100vw - 17rem) / 5);
  }
}

@screen lg {
  #home .c-banner {
    font-size: calc((100vw - 35vw - 11rem) / 5.5);
  }
  #home .c-links {
    width: 35vw;
  }
  #home .c-mission {
    margin-right: 35vw;
  }
  #home .c-feature-stories--min-width {
    min-width: 35vw;
  }
  #home .c-feature-stories__titles {
    margin-bottom: -0.55rem;
  }
}
</style>
