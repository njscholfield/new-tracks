<template>
  <b-modal ref="modal" @shown="refreshData" @ok="updateTrack" ok-title="Save" title="Edit Track">
    <form>
      <div class="form-group">
        <label>Title</label>
        <input class="form-control" type="text" v-model="submitInfo.title">
      </div>
      <div class="form-group">
        <label>Artist</label>
        <input class="form-control" type="text" v-model="submitInfo.artist">
      </div>
      <div class="form-group">
        <label>Release Date</label>
        <input class="form-control" type="date" v-model="submitInfo.releaseDate" placeholder="YYYY-MM-DD">
      </div>
      <div>
        <button class="btn btn-default" v-if="!submitInfo.isFavorite" @click="updateFavorite(true)" title="Click to favorite this track"><span><font-awesome-icon :icon="['far', 'star']"/></span> Favorite</button>
        <button class="btn btn-primary" v-if="submitInfo.isFavorite" @click="updateFavorite(false)" title="Click to unfavorite this track"><span><font-awesome-icon icon="star"/></span> Favorite</button>
      </div>
      <br>
      <button class="btn btn-danger btn-block" @click="deleteTrack()">Delete Track</button>
    </form>
  </b-modal>
</template>

<script>
  export default {
    data() {
      return {
        submitInfo: {}
      };
    },
    props: ['trackInfo', 'user'],
    computed: {
      releaseDate() {
        if(!this.trackInfo.release_year) return undefined;
        return new Date(this.trackInfo.release_year, this.trackInfo.release_month - 1, this.trackInfo.release_day);
      }
    },
    methods: {
      updateTrack() {
        if(this.submitInfo.releaseDate) {
          this.submitInfo.releaseDate = this.$options.filters.moment(this.submitInfo.releaseDate, '');
        }
        const config = {
          method: 'POST',
          headers: new Headers({'Content-Type': 'application/json'}),
          body: JSON.stringify(this.submitInfo)
        };
        fetch(`/api/${this.user.username}/edit`, config)
          .then(blob => blob.json())
          .then(data => this.$parent.$emit('update', data))
          .catch(response => console.log('Error updating track: ', response));
      },
      deleteTrack() {
        const config = {
          method: 'POST',
          headers: new Headers({'Content-Type': 'application/json'}),
          body: JSON.stringify({trackID: this.submitInfo.trackID})
        };
        fetch(`/api/${this.user.username}/remove`, config)
          .then(blob => blob.json())
          .then(data => this.$parent.$emit('update', data))
          .catch(response => console.log('Error deleting track: ', response));
        this.$refs.modal.hide();
      },
      updateFavorite(newValue) {
        this.submitInfo.isFavorite = newValue;
      },
      showModal() {
        this.$refs.modal.show();
      },
      refreshData() {
        this.submitInfo = {
          isFavorite: this.trackInfo.isFavorite,
          title: this.trackInfo.title,
          artist: this.trackInfo.artist,
          trackID: this.trackInfo.trackID,
          releaseDate: this.$options.filters.moment(this.trackInfo.releaseDate, 'YYYY-MM-DD')
        }
      }
    }
  }
</script>