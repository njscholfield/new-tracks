<template>
  <div>
    <Navbar username="njscholfield"/>
    <Input @update="updateData" />
    <b-container>
      <Description :raw-data="rawData" />
    </b-container>
  </div>
</template>

<script>
  import Navbar from './Navbar.vue';
  import Input from './Input.vue';
  import Description from './Description.vue';
  
  export default {
    data() {
      return { 
        rawData: {}
      };
    },
    components: { Navbar, Input, Description },
    methods: {
      updateData(newData) {
        this.rawData = newData;
      }
    }
  }
</script>