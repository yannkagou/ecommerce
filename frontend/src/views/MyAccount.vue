<template>
    <div class="page-my-account">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">My Account</h1>
            </div>
            <div class="column is-12">
                <button @click="logout()" class="button is-danger">Log out</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { usecartStore } from '../stores/index';

const store = usecartStore();
const router = useRouter();

onBeforeMount(() => {
  store.initializeStore();
})

const logout = () => {
    axios.defaults.headers.common['Authorization'] = ""

    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userid')
    
    store.removeToken()

    router.push('/')
}

</script>