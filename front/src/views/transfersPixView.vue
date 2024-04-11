<script setup>
import { ref, onMounted } from 'vue';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

const transfers = ref([]);

onMounted(async () => {
    try {
        const response = await fetch(`${baseUrl}/api/allTransfers`);
        if (!response.ok) {
            throw new Error('Erro ao obter as transferências');
        }
        transfers.value = await response.json();
    } catch (error) {
        console.error(error);
    }
});

</script>

<template>
    <div>
      <h2 style="margin-bottom: 24px;" >Transferências</h2>
      <div v-if="transfers.length > 0">
        <ul>
          <li v-for="(transfer, index) in transfers" :key="index">
            <p>{{ transfer.key }}</p>
            <p>Valor: {{ transfer.amount }}</p>
            <p>Conta: {{ transfer.beneficiary.number }}</p>
            <p>Beneficiário: {{ transfer.beneficiary.participant.name }}</p>
            <hr>
          </li>
        </ul>
      </div>
      <div v-else>
        Não existem transferências.
      </div>
    </div>
  </template>