<template>
  <div>
    <navbar username="njscholfield"></navbar>
    <url-input @update="updateData"></url-input>
    <b-container>
      <description :raw-data="trackData"></description>
    </b-container>
  </div>
</template>

<script>
  import navbar from './Navbar.vue';
  import urlInput from './urlInput.vue';
  import description from './Description.vue';
  
  export default {
    data() {
      return { 
        trackData: {}
      };
    },
    components: { navbar, urlInput, description },
    methods: {
      updateData(newData) {
        this.trackData = newData;
      }
    }
  }
</script>