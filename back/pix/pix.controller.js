// pix.controller.js

const express = require('express');
const router = express.Router();
const pixService = require('./pix.service');

// Store All Transfers
let transfers = [];

// Routes to Create Static Pix and Pay Static Pix
router.post('/newStaticPix', async (req, res, next) => {
    try {
        // Get data from request body
        const { type, correlationId, description, amount, additionalInformation, baKey } = req.body;

        // Log receive data
        console.log('Objeto recebido /newStaticPix:', req.body);

        // Check if all data was received
        if (!type || !correlationId || !description || !amount || !additionalInformation || !baKey) {
            return res.status(400).json({ message: 'Dados do Pix incompletos' });
        }

        // Call service to create new static Pix
        const result = await pixService.newStaticPix(req.body);

        // Check if the API response was successful
        if (result) {
            console.log('Result Controler:', result)
            // Returne Pix data to front-end
            res.status(200).json(result);
        } else {
            res.status(500).json({ message: 'Erro ao processar o Pix' });
        }
    } catch (error) {
        next(error);
    }
});

router.post('/payStaticPix', async (req, res, next) => {
    try {
        // Extract data from request body
        const { payload, baKey } = req.body;

        // Log received data
        console.log('Objeto recebido /payStaticPix:', req.body);

        // Check if all data was received
        if (!payload || !baKey) {
            return res.status(400).json({ message: 'Dados do Pix incompletos' });
        }

        // Call service to pay static Pix
        const result = await pixService.payStaticPix(payload, baKey);

        // Check if the API response was successful
        if (result) {
            // Return Pix data to front-end
            console.log('Paid Pix Controler:', result)
            res.status(200).json(result);
            transfers.push(result);
        } else {
            res.status(500).json({ message: 'Erro ao processar o pagamento do Pix' });
        }
    } catch (error) {
        next(error);
    }
});

router.get('/allTransfers', (req, res, next) => {
    try {
        // Return array JSON Format
        res.status(200).json(transfers);
    } catch (error) {
        next(error);
    }
});

module.exports = router;