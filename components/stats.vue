<template lang="html">
  <container padTop padBottom class="c-stats relative bg-black overflow-hidden" ref="container">
    <div class="relative z-10 flex flex-col justify-center items-center lg:flex-row text-white py-12 -mx-4">
      <template v-for="item in items">
        <div class="c-stat p-6 max-w-xs">
          <h3 class="text-6xl mb-4 font-bold">
            <span v-html="parseFloat(item.number)" ref="number" /><span v-html="item.number.replace(/[0-9]/g, '')" />
          </h3>
          <p class="sm:text-xs" v-html="item.text" />
        </div>
      </template>
    </div>
    <div v-if="image" class="bg-image bg-top c-stats-image absolute inset-0 -top-1/4" ref="img" :style="{backgroundImage: `url(${image})`}" />
  </container>
</template>

<script>
export default {
  props: ["data"],
  mounted() {

    this.countAnim = gsap.timeline({scrollTrigger: {trigger: this.$refs.container.$el,start: "top 50%",once: true}});
    this.$refs.number.forEach((el) => {
      this.countAnim.from(el, 1, { textContent: 0, ease: 'none', snap: { textContent: 1 } },0);
    });
    if (this.image){
      this.imgAnim = gsap.to(this.$refs.img,{y:'25%',ease: 'none',scrollTrigger:{trigger: this.$refs.container.$el,scrub: true}})
    }
  },
  destroyed(){
    this.countAnim && this.countAnim.kill()
    this.imgAnim && this.imgAnim.kill()

  },
  computed: {
    image() {
      if (!this.data || !this.data.primary || !this.data.primary.image) return null;
      return this.data.primary.image.url;
    },
    items() {
      if (!this.data) return [];
      return this.data.items;
    },
  },
};
</script>

<style lang="css">
.c-stats .c-stats-image {
  opacity: 0.4;
}
</style>
