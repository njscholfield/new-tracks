<template>
  <nav class="navbar navbar-expand navbar-dark" :class="variant">
  <div class="container-fluid">
    <a class="navbar-brand" href="/"><img id="brandimg" alt="Home" src="../static/favicon-96x96.png" height="96" width="96"></a>
      <ul class="navbar-nav ms-auto mb-0 mb-lg-0" v-if="user.loggedIn">
        <li class="nav-item">
          <button class="btn navbar-btn" @click="randomTrack" title="Click to view a random saved track">
            <label class="sr-only">Click to view a random saved track</label>
            <font-awesome-icon icon="dice" aria-hidden="true"></font-awesome-icon>
          </button>
        </li>
        <li class="nav-item dropdown">
          <button class="btn nav-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            <label class="sr-only">User menu dropdown toggle</label>
            <font-awesome-icon icon="user" aria-hidden="true" title="User menu dropdown toggle"/>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" :href="user.username"><strong>{{ user.username }}</strong></a></li>
            <li><a class="dropdown-item" href="/settings/"><span><font-awesome-icon icon="cog"/></span> Settings</a></li>
            <li class="dropdown-item" @click="toggleDarkMode">
              <div class="form-check form-switch">
                <input type="checkbox" class="form-check-input" id="customSwitch1" :checked="mode">
                <label class="form-check-label" for="customSwitch1"><span><font-awesome-icon icon="moon"/></span> Dark Mode</label>
              </div>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="/logout/">Sign Out</a></li>
          </ul>
        </li>
      </ul>
      <div class="ml-auto" v-else>
        <a class="btn btn-secondary navbar-btn me-1" href="/login/">Sign In</a>
        <a class="btn btn-success navbar-btn" href="/register/">Register</a>
      </div>
    </div>
  </nav>
</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import { Dropdown } from 'bootstrap';

  export default {
    data() {
      return {};
    },
    props: ['user', 'mode'],
    computed: {
      variant() {
        return this.mode ? 'bg-dark' : 'bg-primary';
      }
    },
    methods: {
      toggleDarkMode() {
        this.$emit('darkMode');
      },
      randomTrack() {
        this.$emit('random');
      }
    },
  };
</script>

<style lang="scss">
  #brandimg {
    height: 2rem;
    width: auto;
    border-radius: 2em;
  }
  .navbar-nav {
    flex-direction: row;
    gap: 1rem;
    .dropdown-toggle, .navbar-btn {
      color: white !important;
    }
  }
</style>
