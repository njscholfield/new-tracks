<template>
  <div class="jumbotron">
    <div class="container">
      <form id="track-input" @submit.prevent="getTrackInfo">
        <div class="form-group">
          <label for="url-input"><h3>Enter a track link below to get started</h3></label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <font-awesome-icon :icon="['fab', 'soundcloud']"></font-awesome-icon>
              </span>
            </div>
            <input id="url-input" class="form-control has-feedback" type="url" aria-label="SoundCloud® Track URL" v-model="trackURL" placeholder="https://soundcloud.com/...">
            <div class="input-group-append">
              <button class="form-control-feedback" type="reset" aria-label="Clear input"><font-awesome-icon icon="times"></font-awesome-icon></button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        trackURL: ''
      };
    },
    methods: {
      getTrackInfo() {
        this.$router.push(this.trackURL);
      }
    }
  };
</script>

<style scoped>
  .jumbotron {
    background: #FEAC5E;
    background: var(--gradient);
    color: white;
    margin-bottom: 1.5rem;
  }
  @media (min-width: 576px) {
    .jumbotron {
      padding: 4rem;
    }
  }
  .fa-soundcloud {
    color: #f50;
  }
  input {
    opacity: 0.6;
  }
  .form-control-feedback {
    background-color: transparent;
    color: white;
    border: none;
    margin-left: -1.5rem;
    z-index: 10;
  }
</style>
