<script setup>
import { storeToRefs } from 'pinia';

import { useAuthStore, useUsersStore } from '@/stores';

const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);

usersStore.getAll();
</script>

<template>
    <div>
        <h1>Olá {{authUser?.lastName}}!</h1>
        <!-- <p>Vupix funciona com Vue 3 + Pinia & JWT!!</p> -->
        <div class="alert alert-info">
            Bank Account: {{authUser?.bankAccount}} <br/>
            key: {{ authUser?.key.substring(0, 30) }}...
        </div>
        <h3>Usuários obtidos da API:</h3>
        <ul v-if="users.length">
            <li v-for="user in users" :key="user.id">{{user.firstName}} {{user.lastName}}</li>
        </ul>
        <div v-if="users.loading" class="spinner-border spinner-border-sm"></div>
        <div v-if="users.error" class="text-danger">Error loading users: {{users.error}}</div>
    </div>
</template>
