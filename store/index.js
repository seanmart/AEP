export default{
  state:()=>({
    stories:{},
    pages:{},
    lists:{
      stories:[],
      nav:[]
    }
  }),
  mutations:{
    STORY:(state,[key,data]) => state.stories[key] = data,
    PAGE:(state,[key,data]) => state.pages[key] = data,
    LIST:(state,[key,data]) => state.lists[key] = data
  },
  actions:{
    async NAV({commit}){
      let res = await this.$prismic.api.getSingle("navigation");
      if (!res) return

      let links = res.data.body.map((item) => {
        return {
          to:`/${item.primary.link.type == 'page' ? item.primary.link.uid : item.primary.link.type}`,
          label: item.primary.label
        }
      })

      links.push({
        to: `/${res.data.cta_link.uid}`,
        label: res.data.cta_label
      })

      commit("LIST", ['nav',links]);

    },
    async nuxtServerInit({dispatch,commit}){
      await dispatch('NAV')
    }
  }
}
