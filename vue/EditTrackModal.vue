<template>
  <div class="modal" id="edit-track-modal" data-bs-backdrop="static" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Track</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group mb-3">
              <label class="form-label" for="edit-title">Title</label>
              <input class="form-control" type="text" id="edit-title" v-model="submitInfo.title">
            </div>
            <div class="form-group mb-3">
              <label class="form-label" for="edit-artist">Artist</label>
              <input class="form-control" type="text" id="edit-artist" v-model="submitInfo.artist">
            </div>
            <div class="form-group mb-3">
              <label class="form-label" for="edit-date">Release Date</label>
              <input class="form-control" type="date" id="edit-date" v-model="submitInfo.releaseDate" placeholder="YYYY-MM-DD">
            </div>
            <div>
              <button class="btn btn-secondary" v-if="!submitInfo.isFavorite" @click.prevent="updateFavorite(true)"
                title="Click to favorite this track"><span>
                  <font-awesome-icon :icon="['far', 'star']" />
                </span> Favorite</button>
              <button class="btn btn-primary" v-if="submitInfo.isFavorite" @click.prevent="updateFavorite(false)"
                title="Click to unfavorite this track"><span>
                  <font-awesome-icon icon="star" />
                </span> Favorite</button>
            </div>
            <br>
            <button class="btn btn-danger w-100" @click="deleteTrack()">Delete Track</button>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="updateTrack">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Modal } from 'bootstrap';

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
          const str = this.submitInfo.releaseDate.split('-');
          const date = new Date(this.submitInfo.releaseDate);
          date.setFullYear(str[0]);
          date.setMonth(str[1] - 1);
          date.setDate(str[2]);
          date.setHours(0);
          this.submitInfo.releaseDate = date.toJSON();
        }
        this.axios.post(`/api/${this.user.username}/edit`, this.submitInfo, {credentials: 'same-origin'})
          .then(response => this.$parent.$emit('update', response.data))
          .catch(response => this.$parent.$emit('error', 'Error updating track', response));
        this.modal.hide();
      },
      deleteTrack() {
        const postData = { trackID: this.submitInfo.trackID };
        this.axios.post(`/api/${this.user.username}/remove`, postData, {credentials: 'same-origin'})
          .then(response => this.$parent.$emit('update', response.data))
          .catch(response => this.$parent.$emit('error', 'Error deleting track', response));
        this.modal.hide();
      },
      updateFavorite(newValue) {
        this.submitInfo.isFavorite = newValue;
      },
      showModal() {
        this.modal.show();
      },
      refreshData() {
        this.submitInfo = Object.assign({}, this.trackInfo);
        const date = new Date(this.trackInfo.releaseDate);
        date.setHours(0);
        this.submitInfo.releaseDate = (this.trackInfo.releaseDate) ? date.toJSON().split('T')[0] : '';
      }
    },
    watch: {
      'trackInfo': function () {
        this.refreshData();
      }
    },
    mounted() {
      this.modal = new Modal('#edit-track-modal');
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
