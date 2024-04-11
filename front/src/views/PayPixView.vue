<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores';
import * as Yup from 'yup';
import { Form, Field } from 'vee-validate';
import { ref } from 'vue';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

const schema = Yup.object().shape({
    qrcPayload: Yup.string().required('Digite o QR Code Payload')
});

async function onSubmit(values, { setErrors }) {
    const requestStructure = {
        "payload": qrcPayload.value,
        "baKey": baKey
    };

    console.log('Objeto Pagamento enviado:', requestStructure);

    try {
        const response = await fetch(`${baseUrl}/api/payStaticPix`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestStructure)
        });

        if (!response.ok) {
            throw new Error('Erro ao tentar realizar o pagamento');
        }

        const responseData = await response.json();
        console.log('Resposta Pagamento:', responseData); // Test Response
        paidPix.value = responseData;

        return responseData;
    } catch (error) {
        setErrors({ apiError: error.message });
    }
}

function copyToClipboard() {
    const el = document.createElement('textarea');
    el.value = qrcExample;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Conteúdo copiado para a área de transferência!');
}

// Example QR Code Payload
const qrcExample = "00020126770014br.gov.bcb.pix01365b0ac9a4-fad6-43f9-be70-6d7c9a2fad260215Testando qrcode52040000530398654049.995802BR5920HOMOLOGACAO INTEGRAC6007ARACAJU62290525charged4Jw0qHWPaXUFs5CAzu6304FFB1"

// API Token Auth
const baKey = authUser.value.key

// Request Data

const qrcPayload = ref('');

const paidPix = ref({});

</script>

<template>
    <div>
        <div class="alert alert-info">
            Pagamento de Pix Estático<br/>
            Bank Account: {{authUser?.bankAccount}} <br/>
            key: {{ authUser?.key.substring(0, 30) }}...
            <p class="text-center" style="margin-top: 16px;">
                Copy Exemplo
            <span @click="copyToClipboard" style="cursor: pointer; font-size: 8px; background-color: #333; color: #fff; padding: 8px 8px; border-radius: 8px;" title="Clique para copiar">{{ qrcExample }}</span>
        </p>
        </div>
        <div v-if="Object.keys(paidPix).length > 0">
            <h2 class="text-center">Pix Pago</h2>
            <div style="max-width: 300px; margin: auto;">
                <p class="text-center">{{ paidPix.key }}</p>
                <p class="text-center">Tipo: {{ paidPix.type }}</p>
                <p class="text-center">Valor: {{ paidPix.amount }}</p>
            </div>
        </div>
        <div v-if="Object.keys(paidPix).length == 0">
            <h2>Pagar Pix</h2>
            <div>
                <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">           
                    <div class="form-group">
                        <label>Digite o QR Code Payload</label>
                        <Field name="qrcPayload" type="text" v-model="qrcPayload" class="form-control" :class="{ 'is-invalid': errors.qrcPayload }" />
                        <div class="invalid-feedback">{{errors.qrcPayload}}</div>
                    </div>          
                    <div class="form-group">
                        <button class="btn btn-primary" :disabled="isSubmitting">
                            <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                            Pagar Pix
                        </button>
                    </div>
                    <div v-if="errors.apiError" class="alert alert-danger mt-3 mb-0">{{errors.apiError}}</div>
                </Form>
            </div>
        </div>
    </div>
</template>