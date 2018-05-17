<template>
  <b-modal ref="modal" @shown="refreshData" @ok="submitTrack" ok-title="Add" title="Add Track">
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
        <button v-if="submitInfo.isFavorite" @click="updateFavorite(false)" class="btn btn-primary" title="Click to unfavorite this track"><span><font-awesome-icon icon="star"/></span> Favorite</button>
        <button v-else @click="updateFavorite(true)" class="btn btn-default"  title="Click to favorite this track"><span><font-awesome-icon :icon="['far', 'star']"/></span> Favorite</button>
      </div>
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
      submitTrack() {
        if(this.submitInfo.releaseDate) {
          this.submitInfo.releaseDate = this.$options.filters.moment(this.submitInfo.releaseDate, '');
        }
        const config = {
          method: 'POST',
          headers: new Headers({'Content-Type': 'application/json'}),
          body: JSON.stringify(this.submitInfo),
          credentials: 'include'
        };
        fetch(`/api/${this.user.username}/add`, config)
          .then(blob => blob.json())
          .then(data => this.$parent.$emit('update', data))
          .catch(response => console.log('Error adding track: ', response));
      },
      updateFavorite(newValue) {
        this.submitInfo.isFavorite = newValue;
      },
      showModal() {
        this.$refs.modal.show();
      },
      refreshData() {
        this.submitInfo = {
          isFavorite: false,
          title: this.trackInfo.title,
          artist: this.trackInfo.user.username,
          trackID: this.trackInfo.id,
          releaseDate: this.$options.filters.moment(this.releaseDate, 'YYYY-MM-DD')
        };
      }
    }
  };
</script>