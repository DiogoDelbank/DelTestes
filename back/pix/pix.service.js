// pix.service.js
const axios = require('axios');

module.exports = {
    newStaticPix,
    payStaticPix
};

async function newStaticPix(requestBody) {
    try {
        // Remove key 'baKey' from obj requestBody and use as header
        const { baKey, ...pixData } = requestBody;

        // Configure header with key 'x-delbank-api-key'
        const headers = {
            'Content-Type': 'application/json',
            'x-delbank-api-key': baKey
        };

        // Log obj sended to Delbank API and header
        console.log('Objeto enviado para API Delbank:', pixData);
        console.log('Header:', headers);

        // Send new charge data to Delbank API
        const response = await axios.post('https://apisandbox.delbank.com.br/baas/api/v1/charges', pixData, { headers });

        // Log code status Delbank API
        console.log('Código de status da resposta da API do Delbank:', response.status);

        // Check API response
        if (response.status === 200) {
            console.log('Response Service:', response.data)
            return response.data; // Return Pix data when sucess
        } else {
            throw new Error(`Erro ao criar o Pix. Status: ${response.status}`);
        }
    } catch (error) {
        throw new Error(`Erro ao enviar a solicitação para a API do Delbank: ${error.message}`);
    }
}

async function payStaticPix(payload, baKey) {
    try {
        const options = {
            method: 'POST',
            url: 'https://apisandbox.delbank.com.br/baas/api/v2/pix/qrcode/payment-initialization',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'x-delbank-api-key': baKey
            },
            data: {
                payload: payload
            }
        };

        // Send Request to Delbank API starting Pix payment 
        const response = await axios.request(options);

        // Log code status from Delbank API
        console.log('Código de status da resposta da API do Delbank:', response.status);

        // Log response from Delbank API
        console.log('Dados da resposta da API do Delbank:', response.data);

        // Check response status
        if (response.status === 200) {
            return response.data; // Return data about payments when sucess
        } else {
            throw new Error(`Erro ao inicializar o pagamento do Pix. Status: ${response.status}`);
        }
    } catch (error) {
        throw new Error(`Erro ao enviar a solicitação para a API do Delbank: ${error.message}`);
    }
}