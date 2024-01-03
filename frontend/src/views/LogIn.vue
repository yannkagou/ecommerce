<template>
    <div class="page-sign-up">
        <div class="columns">
            <div class="column is-4 is-offset-4">
                <h1 class="title">Log In</h1>
                <form @submit.prevent="submitForm">

                    <div class="class">
                        <label>Username</label>
                        <div class="control">
                            <input type="text" class="input" v-model="username">
                        </div>
                    </div>

                    <div class="class">
                        <label>Password</label>
                        <div class="control">
                            <input type="password" class="input" v-model="password">
                        </div>
                    </div>

                    <div class="notification is-danger" v-if="errors.length">
                        <p v-for="error in errors" :key="error">{{ error }}</p>
                    </div>

                    <div class="field">
                        <div class="control">
                            <button class="button is-dark">Log In</button>
                        </div>
                    </div>

                    <hr>

                    Or <router-link to="/signup">click here</router-link> to sign up!

                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios  from 'axios';
import { usecartStore } from '../stores/index';
import { toast } from 'bulma-toast'
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const store = usecartStore();
const router = useRouter()
const route = useRoute()

let username = ref('')
let password = ref('')

let errors = ref([])

onBeforeMount(() => {
  store.initializeStore();
})


onMounted(() => {
    document.title = 'Log In | Djackets'
})

async function submitForm() {
    errors.value = []
    if (username.value === ''){
        errors.value.push('The username is missing')
    }
    if (password.value === ''){
        errors.value.push('The password is missing')
    }
    if (!errors.value.length) {
        axios.defaults.headers.common['Authorization'] = ''
        localStorage.removeItem('token')

        const formData = {
            username: username.value,
            password: password.value
        }

        axios
            .post('/api/v1/token/login/', formData)
            .then(response => {
                const token = response.data.auth_token
                store.setToken(token)
                axios.defaults.headers.common['Authorization'] = 'Token' + token
                localStorage.setItem('token', token)
                const toPath = route.query.to || '/cart'
                router.push(toPath)
                toast({
                    message: 'Successfully log in!',
                    type: 'is-success',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 2000,
                    position: 'bottom-right',
                })
            })
            .catch(error => {
                if (error.response){
                    for (const property in error.response.data){
                        errors.value.push(`${property}: ${error.response.data[property]}`)
                    }
                    console.log(JSON.stringify(error.response.data))
                } else if (error.message) {
                    errors.value.push('Something went wrong. Please try again')
                    console.log(error.message)
                    console.log(JSON.stringify(error))
                }
            })
    }
}

</script>