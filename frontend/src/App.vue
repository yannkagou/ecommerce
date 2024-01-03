<template>
  <div class="wrapper">
    <nav class="navbar is-dark">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item"><strong>Djackets</strong></router-link>
        <a class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-menu" @click="showMobileMenu = !showMobileMenu">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" id="navbar-menu" :class="{'is-active': showMobileMenu}">
        <div class="navbar-start">
          <div class="navbar-item">
            <form method="get" action="/search">
              <div class="field has-addons">
                <div class="control">
                  <input type="text" name="query" class="input" placeholder="What are you looking for?">
                </div>
                <div class="control">
                  <button class="button is-success">
                    <span class="icon">
                      <i class="fas fa-search"></i>
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="navbar-end">
          <router-link to="/summer" class="navbar-item">Summer</router-link>
          <router-link to="/winter" class="navbar-item">Winter</router-link>

          <div class="navbar-item">
            <div class="buttons">

              <router-link v-if="store.isAuthenticated" to="/myaccount" class="button is-light">My Account</router-link>

              <router-link v-else to="/login" class="button is-light">Log in</router-link>

              <router-link to="/cart" class="button is-success">
                <span class="icon"><i class="fas fa-bell"></i></span>
                <span>Cart ({{ cartTotalLength }})</span> 
              </router-link>

            </div>
          </div>
        </div>

      </div>
    </nav>

    <div class="is-loading-bar has-text-centered" :class="{'is-loading': store.isLoading}">
      <div class="lds-dual-ring"></div>
    </div>

    <section class="section">
      <router-view />
    </section>

    <footer class="footer">
      <p class="has-text-centered">Copyright (c) 2023</p>
    </footer>
    
  </div>
</template>

<script setup>
import axios from 'axios';
import { computed, onBeforeMount, ref } from 'vue';
import { usecartStore } from '../src/stores/index.js'

const store = usecartStore();


let showMobileMenu = ref(false);

onBeforeMount(() => {
  store.initializeStore();
  const token = store.token;
  if (token){
    axios.defaults.headers.common['Authorization'] = 'Token' + token
  } else {
    axios.defaults.headers.common['Authorization'] = ''
  }
})

const cartTotalLength = computed(() => {
  let totalLength = 0;
  for (let i = 0; i < store.cart.items.length; i++) {
    totalLength += store.cart.items[i].quantity;
  }
  return totalLength;
});

</script>

<style lang="scss">
@import '../node_modules/bulma/css/bulma.css';

.lds-dual-ring{
  display: inline-block;
  width: 80px;
  height: 80px;
}

.lds-dual-ring:after{
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #ccc;
  border-color: #ccc transparent #ccc transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0%{
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(360deg);
  }
}

.is-loading-bar{
  height: 0;
  overflow: hidden;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;

  &.is-loading{ 
    height: 80px;
  }
}

</style>
