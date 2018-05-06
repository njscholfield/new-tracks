<template>
  <ul class="nav nav-pills">
    <li class="nav-item" role="presentation"><a class="nav-link" :class="{'active': isCurrentPanel(1)}" @click="setPanel(1)">Description</a></li>
    <li class="nav-item" role="presentation" v-show="user.loggedIn"><a class="nav-link" :class="{'active': isCurrentPanel(2)}" @click="setPanel(2)">Tracks <span class="badge badge-pill badge-light">{{ numTracks }}</span></a></li>
    <li class="nav-item" role="presentation" v-show="user.loggedIn"><a class="nav-link" :class="{'active': isCurrentPanel(3)}" @click="setPanel(3)">Favorites <span class="badge badge-pill badge-light">{{ numFav }}</span></a></li>
  </ul>
</template>

<script>
  export default {
    data() {
      return {};
    },
    props: ['value', 'numTracks', 'numFav', 'user'],
    methods: {
      setPanel(id) {
        this.$emit('input', id);
      },
      isCurrentPanel(id) {
        return this.value == id;
      }
    }
  }
</script>

<style scoped>
  ul {
    margin-bottom: 2rem;
  }
</style>