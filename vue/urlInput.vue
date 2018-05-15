<template>
  <b-jumbotron>
    <h3>Enter a track link below to get started</h3>
    <form id="track-input" @submit.prevent="getTrackInfo">
      <fieldset>
        <div class="form-group">
          <label class="sr-only" for="trackURL">SoundCloud® Track URL</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <font-awesome-icon :icon="['fab', 'soundcloud']"/>
              </span>
            </div>
            <input class="form-control has-feedback" type="url" v-model="trackURL" placeholder="https://soundcloud.com/...">
            <div class="input-group-append">
              <button class="form-control-feedback" aria-hidden="true" type="reset"><font-awesome-icon icon="times"/></button>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  </b-jumbotron>
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
        // const url = `https://api.soundcloud.com/resolve.json?url=${this.trackURL}&client_id=30cba84d4693746b0a2fbc0649b2e42c`;
        // fetch(url)
        //   .then(blob => blob.json())
        //   .then(data => this.$emit('update', data))
        //   .catch(response => console.log(response));
      }
    }
  }
</script>

<style scoped>
  .jumbotron {
    background: #FEAC5E;
    background: linear-gradient(to right, #4BC0C8, #C779D0, #FEAC5E); 
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