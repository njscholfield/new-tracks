<template>
  <b-modal static lazy ref="modal" @shown="refreshData" @ok="submitTrack" ok-title="Add" title="Add Track">
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
        <button v-if="submitInfo.isFavorite" @click.prevent="updateFavorite(false)" class="btn btn-primary" title="Click to unfavorite this track"><span><font-awesome-icon icon="star"/></span> Favorite</button>
        <button v-else @click.prevent="updateFavorite(true)" class="btn btn-default"  title="Click to favorite this track"><span><font-awesome-icon :icon="['far', 'star']"/></span> Favorite</button>
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
          const str = this.submitInfo.releaseDate.split('-');
          const date = new Date(this.submitInfo.releaseDate);
          date.setFullYear(str[0]);
          date.setMonth(str[1] - 1);
          date.setDate(str[2]);
          date.setHours(0);
          this.submitInfo.releaseDate = date.toJSON();
        }
        this.axios.post(`/api/${this.user.username}/add`, this.submitInfo, {credentials: 'same-origin'})
          .then(response => this.$parent.$emit('update', response.data))
          .catch(response => this.$parent.$emit('error', 'Error adding track', response));
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
          releaseDate: (this.releaseDate) ? this.releaseDate.toJSON().split('T')[0] : ''
        };
      }
    }
  };
</script>

<style>
  .modal-content {
    background-color: var(--background);
    color: var(--text);
  }
  .form-control {
    color: var(--text);
    background-color: var(--backgound);
  }
</style>
