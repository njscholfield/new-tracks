<template>
  <b-navbar toggleable="xl" type="dark" variant="primary">
    <b-navbar-brand href="/"><img id="brandimg" src="../static/favicon-96x96.png"></b-navbar-brand>
      <b-nav-item-dropdown right class="ml-auto" v-if="user.loggedIn">
        <!-- Using button-content slot -->
        <template slot="button-content">
          <font-awesome-icon icon="user"/>
        </template>
        <b-dropdown-item :href="user.username"><strong>{{ user.username }}</strong></b-dropdown-item>
        <b-dropdown-item href="/settings/"><span><font-awesome-icon icon="cog"/></span> Settings</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item href="/logout/">Sign Out</b-dropdown-item>
      </b-nav-item-dropdown>
      <div class="ml-auto" v-else>
        <a class="btn btn-secondary navbar-btn" href="/login/">Sign In</a>
        <a class="btn btn-success navbar-btn" href="/register/">Register</a>
      </div>
  </b-navbar>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: ['user'],
    computed: {
      brandimg () {
        return favicon;
      }
    }
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