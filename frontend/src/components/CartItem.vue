<template>
    <tr>
        <td><router-link :to="item.product.get_absolute_url">{{ item.product.name }}</router-link></td>
        <td>${{ item.product.price }}</td>
        <td>
            {{ item.quantity }}
            <a @click="decrementQuantity(item)">-</a>
            <a @click="incrementQuantity(item)">+</a>
        </td>
        <td>${{ getItemTotal(item).toFixed(2) }}</td>
        <td><button class="delete" @click="remove(item)"></button></td>
    </tr>
</template>

<script setup>
import { reactive, onBeforeMount } from "vue";
import { usecartStore } from '../stores/index';

const store = usecartStore();

const emits = defineEmits(['removeFromCart']);

const remove = (item) =>{
    emits('removeFromCart', item);
}

let props = defineProps({
    initialItem: Object
})

let item = reactive(props.initialItem);

const getItemTotal = (item) => {
    return item.quantity * item.product.price
}

const updateCart = () => {
    localStorage.setItem('cart', JSON.stringify(store.cart))
}

function decrementQuantity(item){
    item.quantity -= 1
    if (item.quantity === 0){
        remove(item)
    }
    updateCart()
}

function incrementQuantity(item){
    item.quantity += 1
    updateCart()
}

</script>