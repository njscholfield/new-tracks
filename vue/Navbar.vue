<template>
  <b-navbar toggleable="xl" type="dark" :variant="variant">
    <b-navbar-brand href="/"><img id="brandimg" alt="Home" src="../static/favicon-96x96.png"></b-navbar-brand>
      <b-nav class="ml-auto" v-if="user.loggedIn">
        <b-nav-item @click="randomTrack" title="Click to view a random saved track">
          <label class="sr-only">Click to view a random saved track</label>
          <font-awesome-icon icon="dice" aria-hidden="true"></font-awesome-icon>
        </b-nav-item>
        <b-nav-item-dropdown right>
          <!-- Using button-content slot -->
          <template slot="button-content">
            <label class="sr-only">User menu dropdown toggle</label>
            <font-awesome-icon icon="user" aria-hidden="true" title="User menu dropdown toggle"/>
          </template>
          <b-dropdown-item :href="user.username"><strong>{{ user.username }}</strong></b-dropdown-item>
          <b-dropdown-item href="/settings/"><span><font-awesome-icon icon="cog"/></span> Settings</b-dropdown-item>
          <b-dropdown-item @click="toggleDarkMode">
            <div class="custom-control custom-switch">
              <input type="checkbox" class="custom-control-input" id="customSwitch1" :checked="mode">
              <label class="custom-control-label" for="customSwitch1"><span><font-awesome-icon icon="moon"/></span> Dark Mode</label>
            </div>
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item href="/logout/">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-nav>
      <div class="ml-auto" v-else>
        <a class="btn btn-secondary navbar-btn mr-1" href="/login/">Sign In</a>
        <a class="btn btn-success navbar-btn" href="/register/">Register</a>
      </div>
  </b-navbar>
</template>

<script>
  export default {
    data() {
      return {};
    },
    props: ['user', 'mode'],
    computed: {
      variant() {
        return this.mode ? 'dark' : 'primary';
      }
    },
    methods: {
      toggleDarkMode() {
        this.$emit('darkMode');
      },
      randomTrack() {
        this.$emit('random');
      }
    }
  };
</script>

<style>
  #brandimg {
    height: 2rem;
    border-radius: 2em;
  }
  .b-nav-dropdown {
    list-style-type: none;
  }
  .dropdown-toggle, .nav-link {
    color: white;
  }
</style>
