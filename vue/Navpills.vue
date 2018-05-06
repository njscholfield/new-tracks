<template>
  <ul class="nav nav-pills">
    <li class="nav-item" role="presentation"><a class="nav-link" :class="{'active': isCurrentPanel(1)}" @click="setPanel(1)">Description</a></li>
    <li class="nav-item" role="presentation" v-show="loggedIn"><a class="nav-link" :class="{'active': isCurrentPanel(2)}" @click="setPanel(2)">Tracks <span class="badge badge-pill badge-light">{{ numTracks }}</span></a></li>
    <li class="nav-item" role="presentation" v-show="loggedIn"><a class="nav-link" :class="{'active': isCurrentPanel(3)}" @click="setPanel(3)">Favorites <span class="badge badge-pill badge-light">{{ numOfFavTracks }}</span></a></li>
  </ul>
</template>

<script>
  export default {
    data() {
      return {};
    },
    props: ['currentPanel', 'numTracks', 'numOfFavTracks', 'loggedIn'],
    methods: {
      setPanel(id) {
        this.$emit('panelChange', id);
      },
      isCurrentPanel(id) {
        return this.currentPanel == id;
      }
    }
  }
</script>

<style scoped>
  ul {
    margin-bottom: 2rem;
  }
</style>