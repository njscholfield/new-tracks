<template>
  <div class="loading-background">
    <div class="loading">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    }
  };
</script>

<style scoped>
  .loading-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(22, 22, 22, 0.4);
    z-index: 15;
  }
  .line {
      display: inline-block;
      width: 15px;
      height: 15px;
      border-radius: 15px;
      background-color: #008cba;
  }
  .loading .line:nth-last-child(1) {animation: loadingC .6s .1s linear infinite;}
  .loading .line:nth-last-child(2) {animation: loadingC .6s .2s linear infinite;}
  .loading .line:nth-last-child(3) {animation: loadingC .6s .3s linear infinite;}

  @keyframes loadingC {
      0 {transform: translate(0,0);}
      50% {transform: translate(0,15px);}
      100% {transform: translate(0,0);}
  }
</style>