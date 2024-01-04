import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const usecartStore = defineStore({
    id: 'cart',

    state: () => ({
        cart: {
           items: []
        },
        isAuthenticated: false,
        token:'',
        isLoading: false
    }),
    

    actions: {
        initializeStore() {
            // console.log('initStore', localStorage.getItem('cart'))

            if (localStorage.getItem('cart')) {
                this.cart = JSON.parse(localStorage.getItem('cart'));
            } else{
                localStorage.setItem('cart', JSON.stringify(this.cart))
            }

            if (localStorage.getItem('token')){
                this.token = localStorage.getItem('token'),
                this.isAuthenticated = true
            } else [
                this.token = '',
                this.isAuthenticated = false
            ]
        },

        addToCart(item) {
            const exists = this.cart.items.filter(i => i.product.id === item.product.id)
            if (exists.length){
                exists[0].quantity = parseInt(exists[0].quantity + parseInt(item.quantity))
            } else{
                this.cart.items.push(item)
            }

            localStorage.setItem('cart', JSON.stringify(this.cart))
        },
        
        setIsLoading(status){
            this.isLoading = status
        },

        setToken(token) {
            this.token = token,
            this.isAuthenticated = true
            // console.log(this.token)
        },
        removeToken() {
            this.token = '',
            this.isAuthenticated = false
        },
        clearCart() {
            this.cart = {
                items: []
            }
            localStorage.setItem('cart', JSON.stringify(this.cart))
        }
    }
})