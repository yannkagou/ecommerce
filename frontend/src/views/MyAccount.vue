<template>
    <div class="page-my-account">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">My Account</h1>
            </div>
            <div class="column is-12">
                <button @click="logout()" class="button is-danger">Log out</button>
            </div>

            <hr>

            <div class="column is-12">
                <h2 class="subtitle">My Orders</h2>

                <OrderSummary v-for="order in orders" :key="order.id" :order="order" />
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import OrderSummary from '../components/OrderSummaru.vue'
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usecartStore } from '../stores/index';

const store = usecartStore();
const router = useRouter();

let orders = reactive({})

onBeforeMount(() => {
  store.initializeStore();
})

onMounted(() => {
    document.title = 'My Account | Djackets'
    getMyOrders()
})

const getMyOrders = async () => {
    store.setIsLoading(true)

    await axios.get('/api/v1/orders/')
        .then(response => {
            Object.assign(orders, response.data)
        })
        .catch(error => {
            console.log(error)
        })
    
    store.setIsLoading(false)
}

const logout = () => {
    axios.defaults.headers.common['Authorization'] = ""

    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userid')
    
    store.removeToken()

    router.push('/')
}

</script>