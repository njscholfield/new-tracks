<template>
  <div class="nav-container">
    <ul class="nav">
      <li class="nav-item" role="presentation"><a class="nav-link" :class="{'active': isCurrentPanel(1)}" @click="setPanel(1)"><font-awesome-icon icon="stream"></font-awesome-icon> <span class="d-none d-sm-inline-block">Description</span></a></li>
      <li class="nav-item" role="presentation" v-show="user.loggedIn"><a class="nav-link" :class="{'active': isCurrentPanel(2)}" @click="setPanel(2)"><font-awesome-icon icon="music"></font-awesome-icon> <span class="d-none d-sm-inline-block">Tracks</span> <span class="badge badge-pill badge-light">{{ numTracks.all }}</span></a></li>
      <li class="nav-item" role="presentation" v-show="user.loggedIn"><a class="nav-link" :class="{'active': isCurrentPanel(3)}" @click="setPanel(3)"><font-awesome-icon icon="star"></font-awesome-icon> <span class="d-none d-sm-inline-block">Favorites</span> <span class="badge badge-pill badge-light">{{ numTracks.favorites }}</span></a></li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    props: ['value', 'numTracks', 'user'],
    methods: {
      setPanel(id) {
        this.$emit('input', id);
      },
      isCurrentPanel(id) {
        return this.value == id;
      }
    }
  };
</script>

<style scoped>
  ul {
    margin-bottom: 2rem;
    color: white;
  }
  .nav {
    justify-content: space-around;
    flex-grow: 1;
    flex-basis: 0;
    background-color: var(--blue);
    margin-bottom: 0;
    padding-top: .5rem;
    padding-bottom: .5rem;
    padding-bottom: calc(env(safe-area-inset-bottom) + .5rem);
  }
  .nav-container {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 1000;
  }
  .nav-item {
    flex-basis: 25%;
    flex-grow: 0;
    align-self: end;
    display: flex;
    justify-content: center;
  }
  .nav-link.active{
    color: #4CAECE;
  }
</style>
