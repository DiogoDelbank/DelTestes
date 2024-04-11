<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores';
import * as Yup from 'yup';
import { Form, Field } from 'vee-validate';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

const schema = Yup.object().shape({
    amount: Yup.number().required('Digite um valor maior que 0'),
    additionalInformation: Yup.string().required('Digite uma descrição adicional para o pix')
});

async function onSubmit(values, { setErrors }) {
    const requestStructure = {
        "type": "PIX_STATIC",
        "correlationId": `${guid}`,
        "description": `${authUser.value.lastName} - Vupix Static Pix`,
        "amount": parseFloat(requestAmount.value),
        "additionalInformation": requestAdditionalInformation.value,
        "baKey": baKey
    };

    console.log('Objeto enviado:', requestStructure);

    try {
        const response = await fetch(`${baseUrl}/api/newStaticPix`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestStructure)
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar a solicitação');
        }

        const responseData = await response.json();
        console.log('Resposta:', responseData); // Imprime a resposta no console
        generatedPix.value = responseData; // Guarda a resposta em generatedPix

        return responseData;
    } catch (error) {
        setErrors({ apiError: error.message });
    }
}

// API Token Auth
const baKey = authUser.value.key

// uuid
const guid = uuidv4();

// Request Data

const requestAmount = ref(0);
const requestAdditionalInformation = ref(`Pix para - ${authUser.value.lastName}`);

function validateInput() {
    // Converte o valor em requestAmount para número
    requestAmount.value = parseFloat(requestAmount.value);
    if (isNaN(requestAmount.value)) {
        requestAmount.value = 0;
    }
    if (requestAmount.value < 0) {
        requestAmount.value = 0;
    }
}

const generatedPix = ref({});

function copyToClipboard() {
    const el = document.createElement('textarea');
    el.value = generatedPix.value.qrCodePayload;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Conteúdo copiado para a área de transferência!');
}

</script>

<template>
    <div>
    <div class="alert alert-info">
        Geração de Pix Estático<br/>
        Bank Account: {{authUser?.bankAccount}} <br/>
        key: {{ authUser?.key.substring(0, 30) }}...
    </div>
    <div v-if="Object.keys(generatedPix).length > 0">
        <h2 class="text-center">Pix Gerado</h2>
        <div style="max-width: 300px; margin: auto;">
            <p class="text-center">{{ generatedPix.description }}</p>
            <img style="max-width: 300px;" class="d-block" :src="generatedPix.qrCodeImageBase64" alt="QR Code">
        </div>
        <p class="text-center" style="margin-top: 16px;">
            <span @click="copyToClipboard" style="cursor: pointer; font-size: 8px; background-color: #333; color: #fff; padding: 8px 8px; border-radius: 8px;" title="Clique para copiar">{{ generatedPix.qrCodePayload }}</span>
        </p>
    </div>
    <div v-if="Object.keys(generatedPix).length == 0">
        <h2>Gerar Pix</h2>
        <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">           
            <div class="form-group">
                <label>Valor</label>
                <Field name="amount" type="number" v-model="requestAmount" @input="validateInput" class="form-control" :class="{ 'is-invalid': errors.amount }" />
                <div class="invalid-feedback">{{errors.amount}}</div>
            </div>
            <div class="form-group">
                <label>Descrição Adicional</label>
                <Field name="additionalInformation" type="text" v-model="requestAdditionalInformation" class="form-control" :class="{ 'is-invalid': errors.additionalInformation }" />
                <div class="invalid-feedback">{{errors.additionalInformation}}</div>
            </div>          
            <div class="form-group">
                <button class="btn btn-primary" :disabled="isSubmitting">
                    <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                    Gerar Pix
                </button>
            </div>
            <div v-if="errors.apiError" class="alert alert-danger mt-3 mb-0">{{errors.apiError}}</div>
        </Form>
    </div>
    </div>
    
</template>