<template>
  <b-navbar toggleable="xl" type="dark" variant="primary">
    <b-navbar-brand href="/"><img id="brandimg" src="../static/img/placeholder.png"></b-navbar-brand>
      <!-- Right aligned nav items -->
      <b-nav-item-dropdown right class="ml-auto">
        <!-- Using button-content slot -->
        <template slot="button-content">
          <font-awesome-icon :icon="user"/>
        </template>
        <b-dropdown-item :href="username"><strong>{{ username }}</strong></b-dropdown-item>
        <b-dropdown-item href="/settings/"><span><font-awesome-icon :icon="cog"/></span> Settings</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item href="/logout/">Sign Out</b-dropdown-item>
      </b-nav-item-dropdown>
  </b-navbar>
</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
  import { faUser, faCog } from '@fortawesome/fontawesome-free-solid';
  
  export default {
    data() {
      return { 
        user: faUser,
        cog: faCog
      }
    },
    components: { FontAwesomeIcon },
    props: ['username']
  }
</script>

<style>
  #brandimg {
    height: 2rem;
    border-radius: 2em;
  }
  .b-nav-dropdown {
    list-style-type: none;
  }
  .dropdown-toggle {
    color: white;
  }
</style>