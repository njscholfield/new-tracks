<template>
  <div>
    <div class="d-none d-md-block">
      <table class="table">
        <thead>
          <tr>
            <th>Track Name</th>
            <th>Artist</th>
            <th class="text-center">Edit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="track in tracks">
            <td><router-link :to="track.trackID">{{ track.title }}</router-link></td>
            <td>{{ track.artist }}</td>
            <td><font-awesome-icon icon="pencil-alt"/></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-md-none">
      <div v-for="track in tracks">
        <div>
          <h3><router-link :to="track.trackID">{{ track.title }}</router-link></h3>
          <h5>{{ track.artist }}</h5>
          <h6>{{ track.releaseDate | moment('LL') }}</h6>
          <button class="btn btn-sm btn-primary" ng-click="trackCtrl.editTrack(track)"><font-awesome-icon icon="pencil-alt"/> Edit Info</button>
          <hr>
        </div>
      </div>
      <h4 class="text-info" v-show="numTracks == 0">No results</h4>
    </div>
    <button class="btn btn-link" @click="toggleJSON">View JSON</button>
    <pre v-if="showJSON"><code>{{ tracks }}</code></pre>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tracks: [],
        showJSON: false
      }
    },
    props: ['user'],
    computed: {
      numTracks() {
        return this.tracks.length;
      },
      favTracks() {
        return this.tracks.filter((item) => item.isFavorite)
      },
      favTrackNum() {
        return this.favTracks.length;
      }
    },
    methods: {
      getTracks() {
        fetch(`/api/${this.user.username}`, {credentials: 'include'})
          .then(blob => blob.json())
          .then(data => this.tracks = data.tracks)
          .then(() => this.$emit('track-num', this.numTracks, this.favTrackNum))
          .catch(response => console.log('Error fetching tracks: ', response));
      },
      receiveTracks(trackArray) {
        this.tracks = trackArray;
        this.$emit('track-num', this.numTracks, this.favTrackNum);
      },
      toggleJSON() {
        this.showJSON = !this.showJSON;
      }
    },
    mounted() {
      this.getTracks();
    }
  }
</script>