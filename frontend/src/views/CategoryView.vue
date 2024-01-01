<template>
    <div class="page-category">
        <div class="colums is-mutiline">
            <div class="column is-12">
                <h2 class="is-size-2 has-text-centered">
                    {{ category.name }}
                </h2>
            </div>
        </div>

        <div class="column is-3" v-for="product in category.products" :key="product.id">
            <div class="box">
                <figure class="image mb-4">
                    <img :src="product.get_thumbnail">
                </figure>
                <h3 class="is-size-4">{{ product.name }}</h3>
                <p class="is-size-6 has-text-grey">${{ product.price }}</p>

                <router-link :to="product.get_absolute_url" class="button is-dark mt-4">View details</router-link>

            </div>
        </div>

    </div>
</template>

<script setup>

import axios from 'axios';
import { toast } from 'bulma-toast'
import { onMounted, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usecartStore } from '../stores/index';

const route = useRoute();
const store = usecartStore();

let category = reactive({
    products: [],
})

onMounted(() =>{
    getCategory();
})

const getCategory = async() => {
    store.setIsLoading(true)
    const categorySlug = route.params.category_slug
    await axios
        .get(`/api/v1/products/${categorySlug}/`)
        .then(response => {
            console.log('category data', response.data)
            Object.assign(category, response.data)

            document.title = category.name + ' | Djackets'
        })
        .catch(error => {
            console.log('error', error)
            toast({
                message: 'Somethong went wrong. Please try again.',
                type: 'is-danger',
                dismissible: true,
                pauseOnHover: true,
                duration: 2000,
                position: 'bottom-right',
            })
        })
    store.setIsLoading(false)
}

watch(
    () => route.params.category_slug,
    () => {
        getCategory();
    },
    { deep: true, immediate: true  }
    );

</script>