<template>
  <div v-if="rawData">
    <div class="row" id="trackTitle">
      <div class="col-sm-10 order-sm-2">
        <h3>{{ rawData.title }}</h3>
        <h4>by <a :href="rawData.user.permalink_url" target="_blank">{{ rawData.user.username }}</a></h4>
        <a :href="rawData.purchase_url" target="_blank"><h6>{{ rawData.purchase_title }}</h6></a>
        <span v-if="tags && tags[0] !== ''">Tags:</span>
        <span class="badge badge-primary ml-1" v-for="tag in tags">{{tag}}</span>
      </div>
      <div class="col-sm-2 order-sm-1">
        <img class="img-fluid" :src="rawData.artwork_url.replace('large', 't500x500')">
      </div>
    </div>
    <hr>
    <p v-for="paragraph in html" v-html="paragraph"></p>
    <h6>POSTED ON: {{ datePosted.toLocaleDateString() }}</h6>
    <div class="row">
      <div class="col">
        <button class="btn btn-link" @click="toggleJSON">Raw Track Info</button>
      </div>
      <div class="col d-flex justify-content-end">
        <a :href="rawData.permalink_url" target="_blank"><img alt="Soundcloud Logo" src="https://developers.soundcloud.com/assets/logo_black-8c4cb46bf63fda8936f9a4d967416dc6.png"></a>
      </div>
    </div>
    <pre v-if="showJSON"><code>{{ rawData }}</code></pre>
  </div>
  <div v-else>
    <br>
    <h4 class="text-info text-center">Enter a URL <strong>above</strong> <span v-show="loggedIn">or select a track from the <strong>Tracks</strong> or <strong>Favorites</strong> tab</span> to view its description.</h4>
  </div>
</template>

<script>
  import Autolinker from 'autolinker';

  export default {
    data() {
      return {
        showJSON: false
      };
    },
    props: ['rawData', 'loggedIn'],
    methods: {
      toggleJSON: function() {
        this.showJSON = !this.showJSON;
      }
    },
    filters: {
      autolinker: function(input) {
        if(input) {
          input = input.replace('\n', '<br>');
          return Autolinker.link(input);
        }
      }
    },
    computed: {
      datePosted: function() {
        return new Date(this.rawData.created_at);
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