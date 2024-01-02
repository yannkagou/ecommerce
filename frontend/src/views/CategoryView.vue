<template>
    <div class="page-category">
        <div class="colums is-mutiline">
            <div class="column is-12">
                <h2 class="is-size-2 has-text-centered">
                    {{ category.name }}
                </h2>
            </div>
        </div>

        <ProductBox v-for="product in category.products" :key="product.id" :product="product" />

    </div>
</template>

<script setup>

import axios from 'axios';
import ProductBox from '../components/ProductBox.vue';
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