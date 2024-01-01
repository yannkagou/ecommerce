<template>
    <div class="page-product" v-if="product.id">
        <div class="columns is-multiline">
            <div class="column is-9">
                <figure class="image mb-6">
                    <img :src="product.get_image">
                </figure>
                <h1 class="title">
                    {{ product.name }} 
                </h1>
                <p>{{ product.description }}</p>
            </div>

            <div class="column is-3">
                <h2 class="substitle">Information</h2>
                <p><strong>Price:</strong>${{ product.price }}</p>
                <div class="field has-addons mt-6">
                    <div class="control"><input type="number" class="input" min="1" v-model="quantity">
                    </div>
                    <div class="control">
                        <a class="button is-dark" @click="addToCart">Add to cart</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { toast } from 'bulma-toast'
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { useRoute } from 'vue-router';
import { usecartStore } from '../stores/index';

const route = useRoute();

const store = usecartStore();

let product = reactive({
    id: null,
});
let quantity = ref(1);

onBeforeMount(()=>{
    getProduct();
});

async function getProduct() {
    store.setIsLoading(true)

    const category_slug = route.params.category_slug
    const product_slug = route.params.product_slug
    console.log(category_slug, product_slug)

    await axios
        .get(`/api/v1/products/${category_slug}/${product_slug}/`)
        .then(response => {
            console.log(response.data)
            Object.assign(product, response.data);

            document.title = product.name + ' | Djackets'
        })
        .catch(error => {
            console.log(error)
        })

        store.setIsLoading(false)
}

function addToCart(){
    if (isNaN(quantity.value) || quantity<1){
        quantity.value = 1
    }
    const item = {
        product: product,
        quantity: quantity.value
    }
    console.log(item)
    store.addToCart(item);
    toast({
        message: 'The product was added to the cart',
        type: 'is-success',
        dismissible: true,
        pauseOnHover: true,
        duration: 2000,
        position: 'bottom-right',
    })
}

</script>