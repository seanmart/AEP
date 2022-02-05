import Vue from 'vue'

export default function(ctx, inject){
  inject('bus', new Vue())
}
