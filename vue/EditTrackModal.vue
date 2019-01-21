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
        <button class="btn btn-default" v-if="!submitInfo.isFavorite" @click.prevent="updateFavorite(true)" title="Click to favorite this track"><span><font-awesome-icon :icon="['far', 'star']"/></span> Favorite</button>
        <button class="btn btn-primary" v-if="submitInfo.isFavorite" @click.prevent="updateFavorite(false)" title="Click to unfavorite this track"><span><font-awesome-icon icon="star"/></span> Favorite</button>
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
        this.axios.post(`/api/${this.user.username}/edit`, this.submitInfo, {credentials: 'same-origin'})
          .then(response => this.$parent.$emit('update', response.data))
          .catch(response => this.$parent.$emit('error', 'Error updating track', response));
      },
      deleteTrack() {
        const postData = { trackID: this.submitInfo.trackID };
        this.axios.post(`/api/${this.user.username}/remove`, postData, {credentials: 'same-origin'})
          .then(response => this.$parent.$emit('update', response.data))
          .catch(response => this.$parent.$emit('error', 'Error deleting track', response));
        this.$refs.modal.hide();
      },
      updateFavorite(newValue) {
        this.submitInfo.isFavorite = newValue;
      },
      showModal() {
        this.$refs.modal.show();
      },
      refreshData() {
        this.submitInfo = Object.assign({}, this.trackInfo);
        this.submitInfo.releaseDate = this.$options.filters.moment(this.trackInfo.releaseDate, 'YYYY-MM-DD');
      }
    }
  };
</script>

<style>
  .modal-content {
    background-color: var(--background);
    color: var(--text);
  }
  .btn-default,
  .btn-default:focus,
  .btn-default:hover {
    color: var(--text);
  }
</style>
