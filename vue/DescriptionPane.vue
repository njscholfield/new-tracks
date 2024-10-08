<template>
  <div class="container" v-if="rawData && rawData.error">
    <h4 class="text-danger">{{ rawData.error }}</h4>
  </div>
  <div class="container" v-else-if="rawData.title">
    <div class="alert alert-dismissable alert-success" role="alert" v-show="!user.loggedIn">
      <div class="d-flex">
        <button type="button" class="btn-close me-2" aria-label="Close"></button>
        <div><a class="alert-link" :href="`/login/?hash=${rawData.id}`">Sign in</a> or <a class="alert-link" :href="`/register/?hash=${rawData.id}`">create an account</a> to save this track for later!</div>
      </div>
    </div>
    <div class="row" id="trackTitle">
      <div class="col-md-10 order-md-2 mb-2">
        <h3>{{ rawData.title }}</h3>
        <h4>by <a :href="rawData.user.permalink_url" target="_blank" rel="noopener noreferrer">{{ rawData.user.username }}</a></h4>
        <h6><span class="text-success">{{ duration(rawData.duration) }}</span></h6>
        <p>
          <a v-if="rawData.downloadable" :href="clientID(rawData.download_url)" target="_blank" rel="noreferrer noopener">Download</a>
          <span v-if="rawData.downloadable && rawData.purchase_url"> | </span>
          <a v-if="rawData.purchase_url" :href="rawData.purchase_url" target="_blank" rel="noreferrer noopener">{{ rawData.purchase_title || 'Buy' }}</a>
        </p>
        <span v-if="tags.length > 0 && tags[0] !== ''">Tags:</span>
        <span class="badge bg-primary ms-1" v-for="(tag, idx) in tags" :key="idx">{{ tag }}</span>
      </div>
      <div class="col-md-2 order-md-1">
        <a class="artwork-link" :href="artworkUrl" target="_blank" rel="noreferrer noopener">
          <img class="img-fluid" :src="artworkUrl" alt="Album Artwork">
        </a>
      </div>
    </div>
    <hr>
    <p v-for="(paragraph, idx) in html" :key="idx" v-html="paragraph"></p>
    <h6>POSTED ON: {{ $filters.date(datePosted) }}</h6>

    <div v-if="user.loggedIn">
      <button class="btn btn-secondary" disabled v-if="savedIds.includes(rawData.id.toString())"><span><font-awesome-icon icon="check"/></span> Track Added To List</button>
      <button class="btn btn-success" v-else @click="$refs.addTrack.showModal()">+ Add Track To List</button>
    </div>

    <div class="row">
      <div class="col">
        <button class="btn btn-link" @click="toggleJSON">Raw Track Info</button>
      </div>
      <div class="col d-flex justify-content-end">
        <a :href="rawData.permalink_url" target="_blank" rel="noreferrer noopener"><img class="sc-icon" alt="Soundcloud Logo" title="Click to listen to this song on SoundCloud" src="https://developers.soundcloud.com/assets/logo_black-8c4cb46bf63fda8936f9a4d967416dc6.png"></a>
      </div>
    </div>
    <pre v-if="showJSON"><code>{{ rawData }}</code></pre>
    <add-track-modal ref="addTrack" :track-info="rawData" :user="user"></add-track-modal>
  </div>
  <div class="container" v-else>
    <br>
    <h4 class="text-info text-center">Enter a URL <strong>above</strong> <span v-show="user.loggedIn">or select a track from the <strong>Tracks</strong> or <strong>Favorites</strong> tab</span> to view its description.</h4>
  </div>
</template>

<script>
  import Autolinker from 'autolinker';
  import parseMilliseconds from 'parse-ms';
  import placeholder from '../static/img/placeholder.png';
  import AddTrackModal from './AddTrackModal.vue';

  export default {
    data() {
      return {
        showJSON: false,
        placeholder: placeholder,
      };
    },
    props: ['rawData', 'user', 'savedIds'],
    components: { AddTrackModal },
    methods: {
      toggleJSON() {
        this.showJSON = !this.showJSON;
      },
      duration(ms) {
        if(!ms) return '';
        const LABELS = [' hour', ' minute', ' second'];
        const LENGTH = parseMilliseconds(ms);
        const TIME = [(LENGTH.hours > 0) ? LENGTH.hours : '', LENGTH.minutes, LENGTH.seconds];

        TIME.forEach((val, i, arr) => arr[i] += (val === '') ? '' : (val === 1) ? LABELS[i]: LABELS[i] + 's');
        return TIME.join(' ').trim();
      },
      clientID(input) {
        if(!input) return '';
        return `${input}${(input.includes('?')) ? '&': '?'}client_id=30cba84d4693746b0a2fbc0649b2e42c`;
      }
    },
    computed: {
      datePosted() {
        return (this.rawData.created_at) ? new Date(this.rawData.created_at) : undefined;
      },
      artworkUrl() {
        return (this.rawData.artwork_url) ? this.rawData.artwork_url.replace('large', 't500x500') : this.placeholder;
      },
      html() {
        if(!this.rawData.description) return '';
        let html = this.rawData.description.split('\n');
        html.forEach((item, index, array) => {
          if(item === '') {
            array[index] = '<br>';
          } else {
            array[index] = Autolinker.link(item, { mention: 'soundcloud' });
          }
        });
        return html;
      },
      tags() {
        /* eslint no-useless-escape: 0 */
        if(!this.rawData.tag_list) return [];
        let tags = this.rawData.tag_list.split(' ');
        let result = [];
        for(var i = 0; i < tags.length; i++) {
          var text = tags[i];
          if(text.includes('\"')) {
            do {
              text = text + ' ' + tags[i + 1];
              i++;
            } while(!tags[i].includes('\"'));
            text = text.slice(1, -1);
          }
          result.push(text);
        }
        return result;
      }
    }
  };
</script>

<style>
  #top.dark-mode .img-fluid {
    opacity: .8;
  }
  #top.dark-mode .sc-icon {
    filter: invert(100%);
  }
  #top.dark-mode code {
    color: white;
  }
  .artwork-link:focus {
    outline: 3px solid var(--primary);
  }
  p a {
    word-wrap: break-word;
  }
</style>
