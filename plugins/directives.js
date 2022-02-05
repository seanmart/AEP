import Vue from "vue";
import {uid} from '@/assets/helpers'

Vue.directive("image", {
  bind: function (el, { value, arg }) {
    el.style.backgroundImage = `url("${value}")`;
    el.style.backgroundSize = "cover";
    el.style.backgroundRepeat = "no-repeat";
  },
});

Vue.directive("wordsplit", {
  inserted: function (el, { value, arg }) {
    let html = "";
    let children = el.children;
    let split = (text) => {
      text.split(" ").forEach((w) => (html += `<div class="word--wrapper" style="display:inline-block;overflow:hidden"><div class="word">${w}&nbsp</div></div>`));
    };

    if (children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        split(children[i].innerText);
        children[i].innerHTML = html;
        html = "";
      }
    } else {
      split(el.innerText);
      el.innerHTML = html;
    }
  },
});
