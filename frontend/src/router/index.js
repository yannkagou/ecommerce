import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import CategoryView from '../views/CategoryView.vue'
import Search from '../views/Search.vue'
import Cart from '../views/Cart.vue'
import SignUp from '../views/SignUp.vue'
import LogIn from '../views/LogIn.vue'
import MyAccount from '../views/MyAccount.vue'
import Checkout from '../views/Checkout.vue'
import Success from '../views/Success.vue'

import { usecartStore } from '../stores/index'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path:'/:category_slug/:product_slug/',
      name:'product',
      component: ProductView
    },
    {
      path:'/:category_slug/',
      name:'category',
      component: CategoryView
    },
    {
      path:'/search',
      name:'search',
      component: Search
    },
    {
      path:'/cart',
      name:'cart',
      component: Cart
    },
    {
      path:'/signup',
      name:'signup',
      component: SignUp
    },
    {
      path:'/login',
      name:'login',
      component: LogIn
    },
    {
      path:'/myaccount',
      name:'myaccount',
      component: MyAccount,
      meta: {
        requireLogin: true
      }
    },
    {
      path:'/cart/checkout',
      name:'checkout',
      component: Checkout,
      meta: {
        requireLogin: true
      }
    },
    {
      path:'/cart/success',
      name:'success',
      component: Success
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireLogin) && !usecartStore().isAuthenticated){
    next({name: 'login', query: {to: to.path} });
  } else {
    next()
  }
})

export default router
