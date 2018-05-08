<template>
  <div v-if="rawData">
    <div class="row" id="trackTitle">
      <div class="col-sm-10 order-sm-2">
        <h3>{{ rawData.title }}</h3>
        <h4>by <a :href="rawData.user.permalink_url" target="_blank">{{ rawData.user.username }}</a></h4>
        <h6><span class="text-success">{{ rawData.duration | duration }}</span></h6>
        <h6>
          <a v-if="rawData.downloadable" :href="rawData.download_url | clientID" target="_blank" rel="noreferrer noopener">Download</a>
          <span v-if="rawData.downloadable && rawData.purchase_url"> | </span>
          <a v-if="rawData.purchase_url" :href="rawData.purchase_url" target="_blank" rel="noreferrer noopener">{{ rawData.purchase_title || 'Buy' }}</a>
        </h6>
        <span v-if="tags && tags[0] !== ''">Tags:</span>
        <span class="badge badge-primary ml-1" v-for="tag in tags">{{tag}}</span>
      </div>
      <br>
      <div class="col-sm-2 order-sm-1">
        <a :href="artworkUrl" target="_blank" rel="noreferrer noopener">
          <img class="img-fluid" :src="artworkUrl" alt="Album Artwork">
        </a>
      </div>
    </div>
    <hr>
    <p v-for="paragraph in html" v-html="paragraph"></p>
    <h6>POSTED ON: {{ datePosted | moment('LL') }}</h6>
    <div class="row">
      <div class="col">
        <button class="btn btn-link" @click="toggleJSON">Raw Track Info</button>
      </div>
      <div class="col d-flex justify-content-end">
        <a :href="rawData.permalink_url" target="_blank" rel="noreferrer noopener"><img alt="Soundcloud Logo" title="Click to listen to this song on SoundCloud" src="https://developers.soundcloud.com/assets/logo_black-8c4cb46bf63fda8936f9a4d967416dc6.png"></a>
      </div>
    </div>
    <pre v-if="showJSON"><code>{{ rawData }}</code></pre>
  </div>
  <div v-else>
    <br>
    <h4 class="text-info text-center">Enter a URL <strong>above</strong> <span v-show="user.loggedIn">or select a track from the <strong>Tracks</strong> or <strong>Favorites</strong> tab</span> to view its description.</h4>
  </div>
</template>

<script>
  import Autolinker from 'autolinker';
  import moment from 'moment'

  export default {
    data() {
      return {
        showJSON: false
      };
    },
    props: ['rawData', 'user'],
    methods: {
      toggleJSON() {
        this.showJSON = !this.showJSON;
      }
    },
    filters: {
      duration(ms) {
        if(!ms) return '';
        const LABELS = [' hour', ' minute', ' second'];
        const LENGTH = moment.duration(ms);
        const TIME = [(LENGTH.hours() > 0) ? LENGTH.hours() : '', LENGTH.minutes(), LENGTH.seconds()]; 

        TIME.forEach((val, i, arr) => arr[i] += (val === '') ? '' : (val === 1) ? LABELS[i]: LABELS[i] + 's');
        return TIME.join(' ').trim();
      },
      moment(input, formatString) {
        if(!input) return '';
        return moment(input).format(formatString);
      },
      clientID(input) {
        if(!input) return '';
        return `${input}${(input.includes('?')) ? '&': '?'}client_id=30cba84d4693746b0a2fbc0649b2e42c`;
      }
    },
    computed: {
      datePosted() {
        return new Date(this.rawData.created_at);
      },
      artworkUrl() {
        return (this.rawData.artwork_url) ? this.rawData.artwork_url.replace('large', 't500x500') : '/img/placeholder.png';
      },
      html() {
        let html = this.rawData.description.split('\n');
        html.forEach((item, index, array) => {
          if(item === '') {
            array[index] = '<br>';
          } else {
            array[index] = Autolinker.link(item, {mention: 'twitter', replaceFn(match) {
                return (match.getType() === 'mention') ? `<a href="https://soundcloud.com/${match.getMention()}" target="_blank">@${match.getMention()}</a>` : true;
              }
            });
          }
        });
        return html;
      },
      tags() {
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
  }
</script>