<template>
  <nav class="nav-container bg-primary">
    <ul class="nav">
      <li class="nav-item">
        <button class="btn nav-link" :class="{'active': isCurrentPanel(1)}" @click="setPanel(1)" tabindex="0" title="View the current track's description">
          <font-awesome-icon icon="stream"></font-awesome-icon> <span id="desc-label" class="d-none d-sm-inline-block">Description</span>
        </button>
      </li>
      <li class="nav-item" v-show="user.loggedIn">
        <button class="btn nav-link" :class="{'active': isCurrentPanel(2)}" @click="setPanel(2)" tabindex="0" title="View all your saved tracks">
          <font-awesome-icon icon="music"></font-awesome-icon> <span class="d-none d-sm-inline-block">Tracks</span> <span class="badge rounded-pill text-bg-light">{{ numTracks.all }}</span>
        </button>
      </li>
      <li class="nav-item" v-show="user.loggedIn">
        <button class="btn nav-link" :class="{'active': isCurrentPanel(3)}" @click="setPanel(3)" tabindex="0" title="View all your favorited tracks">
          <font-awesome-icon icon="star"></font-awesome-icon> <span id="fav-label" class="d-none d-sm-inline-block">Favorites</span> <span class="badge rounded-pill text-bg-light">{{ numTracks.favorites }}</span>
        </button>
      </li>
    </ul>
  </nav>
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

<style scoped lang="scss">
  ul {
    margin-bottom: 2rem;
  }
  button.nav-link {
    color: rgba(255, 255, 255, 0.5);
    border: 0;
    .badge {
      background-color: rgba(255, 255, 255, 0.7);
      --bs-badge-padding-x: .5rem;
    }
    cursor: pointer;
    &:hover {
      color: white; // prevent hover color being black in light mode
    }
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
    color: white;
    .badge {
      background-color: white;
    }
  }
  .nav-link:focus {
    outline: 1px solid #fafafa;
  }
</style>
