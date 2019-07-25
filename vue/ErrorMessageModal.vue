<template>
  <b-modal static lazy ref="modal" ok-only ok-variant="danger" ok-title="Dismiss" header-text-variant="danger" :title="error.title">
    <h6>{{ this.error.message }}</h6>
  </b-modal>
</template>

<script>
  export default {
    data() {
      return {};
    },
    props: ['error'],
    methods: {
      showModal() {
        this.$refs.modal.show();
      }
    }
  };
</script>
