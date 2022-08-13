<template>
  <div class="modal" data-bs-backdrop="static" tabindex="-1" id="error-modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-danger">{{ this.error.title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h6>{{ this.error.message }}</h6>
        </div>
        <div class="modal-footer">
          <button type="button" data-bs-dismiss="modal" class="btn btn-danger">Dismiss</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Modal } from 'bootstrap';

  export default {
    data() {
      return {};
    },
    props: ['error'],
    methods: {
      showModal() {
        this.modal.show();
      }
    },
    mounted() {
      this.modal = new Modal('#error-modal');
    }
  };
</script>
