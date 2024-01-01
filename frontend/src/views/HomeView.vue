<template>
  <div class="home">
    <section class="hero is-medium is-dark mb-6">
      <div class="hero-body has-text-centered">
        <p class="title mb-6">
          Welcome ro Djacket
        </p>
        <p class="subtitle">
          The best djacket store online
        </p>
      </div>
    </section>

    <div class="columns is-multiline">
      <div class="column is-12">
        <h2 class="is-size-2 has-text-centered">Latest Products</h2>
      </div>

      <div class="column is-3" v-for="product in latestProducts" :key="product.id">

        <div class="box">

          <figure class="image mb-4">
            <img :src="product.get_thumbnail">
          </figure>
          <h3 class="is-size-4">
            {{ product.name }}
          </h3>
          <p class="is-size-6 has-text-grey">
            ${{ product.price }}
          </p>

          <router-link :to="product.get_absolute_url" class="button is-dark mt-4">View details</router-link>

        </div>

      </div>
    </div>
  </div>
</template>


<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { usecartStore } from '../stores/index';

const store = usecartStore();

let latestProducts = ref([]);

onMounted(() =>{
  getLatestProducts();
  document.title = 'Home | Djackets'
})

const getLatestProducts = async () =>{
  store.setIsLoading(true)
  await axios
    .get('/api/v1/latest-products/')
    .then(response => {
      console.log(response.data)
      latestProducts.value = response.data
    })
    .catch(error => {
      console.log(error)
    })
    store.setIsLoading(false)
}

</script>

<style scoped>
.image{
  margin-top: -1.25rem;
  margin-left: -1.25rem;
  margin-right: -1.25rem;
}
</style>
