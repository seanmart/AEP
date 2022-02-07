<template lang="html">
  <div class="">
    <container nav logo padTop padBottom class="c-landing font-serif text-4xl">
      {{$route.path.replace('/','').replace('-',' ')}} Coming Soon
    </container>
  </div>
</template>

<script>
export default {
  async asyncData({ store, route, $prismic }) {
    let res = null;
    let page = route.path.replaceAll("/", "");

    if (!store.state.pages[page]) {
      res = await $prismic.api.getByUID('page',page);
      store.commit("PAGE", [page, res.data]);
    }
    let data = store.state.pages[page] || null;
    if (data) return { data };
  },
  data:()=>({
    data: {}
  })
}
</script>

<style lang="css">
.c-landing{
  height: 600px;
}
</style>
