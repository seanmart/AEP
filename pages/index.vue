<template>
  <div id="home">
    <div class="relative overflow-hidden">

      <container v-if="data.banner" navYAll navXAll padX class="c-banner">
        <template v-for="(line, i) in data.banner">
          <div class="c-banner__title-wrapper overflow-hidden">
            <h1 class="c-banner__title font-serif" :class="{ 'text-red': line.spans.length > 0 }" v-html="line.text" />
          </div>
        </template>
      </container>

      <div class="c-circle-links w-screen lg:absolute lg:top-0 lg:right-0 lg:bottom-0" ref="container">
        <container v-if="data.links" navY padT padX ref="links">
          <div class="lg:flex lg:flex-col relative h-64 sm:h-72 lg:h-auto">
            <template v-for="link in [...data.links, {fake:true}]">
              <div class="absolute top-0 left-0 lg:relative lg:flex-grow-0 lg:flex-shrink-0" :class="{'hidden lg:block':link.fake}" ref="link">
                <div class="w-64 sm:w-72 lg:w-full rounded-full overflow-hidden relative">
                  <div class="pb-full w-full bg-pink" />
                  <figure v-if="link.image" class="absolute inset-0" v-image="link.image.url" />
                </div>
              </div>
            </template>
          </div>
        </container>
      </div>

      <container v-if="data.mission" padY margT padX navX class="c-mission bg-grey">
        <div class="text-xl featured-stories--max-width mx-auto lg:mx-0">
          <div class="text-center lg:text-left font-medium" v-html="$prismic.asHtml(data.mission)" />
        </div>
        <div class="featured-stories--max-width">
          <div class="w-full pb-half" />
        </div>
      </container>
    </div>

    <container navX padX padB margB v-if="stories.length > 0" >
      <div class="flex flex-col lg:flex-row">
        <!-- top right -->
        <div class="flex-initial w-full featured-stories--max-width mx-auto lg:mx-0">
          <div class="w-full pb-half relative">
            <div class="absolute left-0 right-0 bottom-0 -top-full overflow-hidden">
              <div class="relative h-full bg-blue">
                <template v-for="(item, i) in stories">
                  <figure
                    class="absolute inset-0"
                    :class="{
                      'is-active': i == active,
                      'is-prev': i == prev,
                      'is-next': i == next,
                    }"
                    v-image="item.data.photo.url"
                  />
                </template>
              </div>
            </div>
          </div>
        </div>
        <!-- top left -->
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


  </div>
</template>

<script>
import storiesQuery from "@/assets/queries/stories";
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
    this.$nextTick(this.initLinks)
  },
  destroyed(){
    this.mq && this.mq.kill()
  },
  data: () => ({
    data: {},
    stories: [],
  }),
  computed: {
    filteredStories() {
      if (this.stories.length == 0) return this.stories;
    },
    active() {},
    next() {},
    prev() {},
  },
  methods:{
    initLinks(){
      if (!this.data.links || this.data.links.length == 0) return

      this.mq = ScreenBuddy.onLg((matches)=>{

        gsap.set([this.$refs.links.$el,this.$refs.link],{clearProps:'all'})
        this.anim && this.anim.kill()

        if (matches){

          let offset = ()=>{
            let triggerHeight = this.$refs.container.offsetHeight
            let linksHeight = this.$refs.links.$el.offsetHeight
            let linkHeight = this.$refs.link[0].offsetHeight
            return (triggerHeight - linksHeight) + linkHeight / 2
          }

          this.anim = gsap.to(this.$refs.links.$el,1,{y:offset, ease: 'none',scrollTrigger:{
            trigger:this.$refs.container,
            start:'top top',
            end:'bottom top',
            scrub:true,
            invalidateOnRefresh: true
          }})
        } else {
          let gap = 3
          let offset = 20
          let limit = (this.$refs.link.length - 1) * (100 + gap)

          gsap.set(this.$refs.link,{x:(i)=> `${(i * (100 + gap)) - offset}%`})

          this.anim = gsap.to(this.$refs.link, {
            duration: 50,
            ease: "none",
            x: `+=${limit}%`,
            modifiers: {
              x: gsap.utils.unitize(x => (parseFloat(x) % limit) - (100 + offset), "%") //force x value to be between 0 and 500 using modulus
            },
            repeat: -1,
            scrollTrigger:{
              trigger:this.$refs.container,
              start:'top bottom',
              end:'bottom top',
              toggleActions:'play pause play none'
            }
          });

        }
      })
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

#home .featured-stories--max-width {
  max-width: 500px;
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
  #home .c-circle-links {
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
