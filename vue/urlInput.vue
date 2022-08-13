<template>
  <div class="jumbotron p-5">
    <div class="container">
      <form id="track-input" @submit.prevent="getTrackInfo">
        <div class="form-group">
          <label for="url-input"><h3>Enter a track link below to get started</h3></label>
          <div class="input-group">
            <div class="input-group-text"><font-awesome-icon :icon="['fab', 'soundcloud']"></font-awesome-icon></div>
            <input id="url-input" class="form-control" type="url" aria-label="SoundCloud® Track URL" v-model="trackURL" placeholder="https://soundcloud.com/...">
            <button class="btn btn-clear" type="reset" aria-label="Clear input"><font-awesome-icon icon="times"></font-awesome-icon></button>
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

<style scoped lang="scss">
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
    &::placeholder {
      color: var(--bs-border-color);
    }
  }
  .form-control-feedback {
    background-color: transparent;
    color: white;
    border: none;
    margin-left: -1.5rem;
    z-index: 10;
  }
  #url-input {
    border-right: 0;
  }
  .btn-clear {
    color: var(--text);
    border: 1px solid var(--bs-border-color);
    border-left: 0;
    opacity: .6;
  }
</style>
