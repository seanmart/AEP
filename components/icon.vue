<template lang="html">
  <svg v-if="menu || icon == 'menu'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 23">
    <line class="cls-1" y1="1.5" x2="40" y2="1.5"/>
    <line class="cls-1" y1="11.5" x2="40" y2="11.5"/>
    <line class="cls-1" y1="21.5" x2="40" y2="21.5"/>
  </svg>
</template>

<script>
export default {
  props:{
    menu:Boolean,
    icon: String
  }
}
</script>
