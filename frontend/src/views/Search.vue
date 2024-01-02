<template>
    <div class="page-search">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Search</h1>
                <h2 class="is-size-5 has-text-grey">
                    Search term: "{{ query }}"
                </h2>
            </div>
        </div>

        <ProductBox v-for="product in products" :key="product.id" :product="product" />
    </div>
</template>

<script setup>
import axios from 'axios';
import { usecartStore } from '../stores/index.js'
import { onMounted, ref } from 'vue';
import ProductBox from '../components/ProductBox.vue';

let store = usecartStore()

let products = ref([])
let query = ref('')

const performSearch = async () => {
    store.setIsLoading(true)

    await axios
        .post('/api/v1/products/search/', {'query': query.value})
        .then(response => {
            products.value = response.data
        })
        .catch(error => {
            console.log(error)
        })

    store.setIsLoading(false)
}

onMounted(()=>{
    document.title = 'Search | Djackets'

    let uri = window.location.search.substring(1)
    let params = new URLSearchParams(uri)

    if (params.get('query')){
        query.value = params.get('query');
        performSearch();
    }
})

</script>

<style scoped>

</style>