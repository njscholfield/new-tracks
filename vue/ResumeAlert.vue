<template>
  <div v-if="trackInfo.title" class="alert alert-dismissible" id="resume">
    <h6 class="text-muted" id="resume-header">LAST OPENED TRACK</h6>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="hide = true"></button>
  <hr id="resume-divider">
  <div class="row">
    <div class="col-4 col-sm-auto">
      <router-link :to="user.resumeTrack"><img alt="Album Artwork" class="img-fluid" id="resume-img" :src="artworkURL">
      </router-link>
    </div>
    <div class="col-8 col-sm">
      <router-link :to="user.resumeTrack">
        <h5>{{ trackInfo.title }}</h5>
      </router-link>
      <h6>{{ trackInfo.user.username }}</h6>
    </div>
  </div>
  </div>
</template>

<script>
  import placeholder from '../static/apple-touch-icon-152x152.png';

  export default {
    data() {
      return {
        trackInfo: {},
        hide: false
      };
    },
    props: ['user', 'isVisible'],
    computed: {
      artworkURL() {
        if(!this.trackInfo) return '';
        else if(!this.trackInfo.artwork_url) return placeholder;
        return this.trackInfo.artwork_url.replace('large', 't300x300');
      },
      visible() {
        return this.isVisible && !this.hide;
      }
    },
    methods: {
      getTrackInfo() {
        const url = `https://api.soundcloud.com/tracks/${this.user.resumeTrack}`;
        this.axios(url, { headers: { 'Authorization': `Bearer ${this.user.token}`} })
          .then(response => this.trackInfo = response.data)
          .catch(() => this.hide = true);
      }
    },
    mounted() {
      this.getTrackInfo();
    }
  };
</script>

<style scoped>
  #resume {
    min-width: 40%;
    max-width: 32rem;
    margin: 1em;
    padding-right: 20px;
    background-color: rgba(255, 255, 255, 0.96);
    border: .5px solid gray;
    border-left: 5px solid #43AC6A;
    position: fixed;
    bottom: calc(env(safe-area-inset-bottom) + 3.4rem);
    right: 0;
    z-index: 12;
    color: var(--text);
  }
  #top.dark-mode #resume {
    background-color: rgba(51, 51, 51, 0.96);
  }
  #top.dark-mode .text-muted {
    color: #ffffff99 !important;
  }
  #resume-divider {
    margin: 0;
    margin-bottom: 1em;
  }
  #resume-header {
    margin-top: 0;
  }
  #resume-img {
    max-height: 100px;
  }

  @media (max-width: 500px) {
    /* make resume box full width on small screens */
    #resume {
      max-width: none;
      width: 94%;
    }
    #resume h5 {
      font-size: 15px;
    }
    #resume h6 {
      font-size: 13px;
    }
  }
</style>
