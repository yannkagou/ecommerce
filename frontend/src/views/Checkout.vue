<template>
    <div class="page-my-account">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Checkout</h1>
            </div>

            <div class="column is-12 box">
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in cart.items" :key="item.product.id">
                            <td>{{ item.product.name }}</td>
                            <td>${{ item.product.price }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>${{ getItemTotal(item).toFixed(2) }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2">Total</td>
                            <td>{{ CartTotalLength }}</td>
                            <td>${{ cartTotalPrice.toFixed(2) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="column is-12 box">
                <h2 class="subtitle">Shipping details</h2>
                <p class="has-text-grey sb-4">* All fields are required</p>
                <div class="columns is-multiline">
                    <div class="column is-6">

                        <div class="field">
                            <label>First name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="first_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>Last name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="last_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>E-mail*</label>
                            <div class="control">
                                <input type="email" class="input" v-model="email">
                            </div>
                        </div>

                        <div class="field">
                            <label>Phone*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="phone">
                            </div>
                        </div>

                    </div>

                    <div class="column is-6">

                        <div class="field">
                            <label>Address*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="address">
                            </div>
                        </div>

                        <div class="field">
                            <label>Zip code*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="zipcode">
                            </div>
                        </div>

                        <div class="field">
                            <label>Place*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="place">
                            </div>
                        </div>

                    </div>

                </div>

                <div v-if="errors.length" class="notification is-danger mt-4">
                    <p v-for="error in errors" :key="error">{{ error }}</p>
                </div>

                <hr>
                    
                <div id="card-element" class="mb-5"></div>

                <template v-if="CartTotalLength">
                    <hr>
                    <button @click="submitForm" class="button is-dark">Pay with Stripe</button>
                </template>

            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { onBeforeMount, onMounted, reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { usecartStore } from '../stores/index';

const router = useRouter();
const store = usecartStore();

let cart = reactive({
    items: []
})

let stripe = reactive({})

let elements = reactive({})

let card = reactive({})

let first_name = ref('')
let last_name = ref('')
let email = ref('')
let phone = ref('')
let address = ref('')
let zipcode = ref('')
let place = ref('')

let errors = ref([])

onBeforeMount(() => {
  store.initializeStore();
  const token = store.token;
  if (token){
    axios.defaults.headers.common['Authorization'] = 'Token' + token
  } else {
    axios.defaults.headers.common['Authorization'] = ''
  }
  cart = store.cart;
  stripe = Stripe('pk_test_51OK45DEWs8EQSsWt5vE03jFDHDbLoEYmlBaRAcRpk0k9hcNBNSYVGR1moxHRVlTB04KYdIBReEsRQGLcxiSNIEZy004Jvc8VlB')
  elements = stripe.elements();

})

onMounted(() => {
    document.title = 'Checkout | Djackets'
    if(CartTotalLength.value) {
        card = elements.create('card', { hidePostalCode: true })
        card.mount('#card-element')
    }
})

function getItemTotal(item){
    return item.quantity * item.product.price
}

function submitForm(){
    errors.value = []

    if (first_name.value === ''){
        errors.value.push('The first name is missing!')
    }
    if (last_name.value === ''){
        errors.value.push('The last name is missing!')
    }
    if (email.value === ''){
        errors.value.push('The email is missing!')
    }
    if (phone.value === ''){
        errors.value.push('The phone is missing!')
    }
    if (address.value === ''){
        errors.value.push('The address is missing!')
    }
    if (zipcode.value === ''){
        errors.value.push('The zip code is missing!')
    }
    if (place.value === ''){
        errors.value.push('The place is missing!')
    }

    if (!errors.value.length){
        store.setIsLoading(true)
        stripe.createToken(card).then(result => {
            if (result.error){
                store.setIsLoading(false)
                errors.value.push('Something went wrong with Stripe. Please try again')
                console.log(result.error.message)
            } else {
                stripeTokenHandler(result.token)
            }
        })
    }
}

async function stripeTokenHandler(token) {
    const items = []

    for (let i = 0; i < cart.items.length; i++) {
        const item = cart.items[i]
        const obj = {
            product: item.product.id,
            quantity: item.quantity,
            price: item.product.price * item.quantity
        }
        items.push(obj)
    }

    const data = {
        "first_name": first_name.value,
        "last_name": last_name.value,
        "email": email.value,
        "address": address.value,
        "zipcode": zipcode.value,
        "place": place.value,
        "phone": phone.value,
        "stripe_token": token.id,
        "items": items,
    }

    await axios
        .post('/api/v1/checkout/', data)
        .then(response => {
            store.clearCart()
            router.push('/cart/success')
        })
        .catch(error => {
            errors.value.push('Something went wrong. Please try again')
            console.log(error)
        })

        store.setIsLoading(false)
}

const CartTotalLength = computed(() => {
    return store.cart.items.reduce((acc, curVal) => {
        return acc += curVal.quantity
    }, 0)
})

const cartTotalPrice = computed(() => {
    return store.cart.items.reduce((acc, curVal) => {
        return acc += curVal.product.price * curVal.quantity
    }, 0)
})

</script>