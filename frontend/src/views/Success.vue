<template>
    <div class="page-success">
        <div class="columnd is-multiline">
            <div class="column is-12">
                <h1 class="title">Thank You</h1>
                <p>Your order will be processed within 48 hours</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";


onMounted(() => {
    document.title = 'Success | Djackets'
})

</script>