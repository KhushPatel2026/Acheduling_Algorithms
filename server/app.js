// Server.js (Express)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { fcfsScheduler, sjfScheduler, priorityScheduler, roundRobinScheduler } = require('./scheduler');
const { fifo, optimal, leastRecentlyUsed, leastFrequentlyUsed } = require('./pagereplacement');

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.post('/schedule', (req, res) => {
    const { algorithm, processes, timeQuantum } = req.body;
    let result;

    switch (algorithm) {
        case 'FCFS':
            result = fcfsScheduler(processes);
            break;
        case 'SJF':
            result = sjfScheduler(processes);
            break;
        case 'Priority':
            result = priorityScheduler(processes);
            break;
        case 'RoundRobin':
            result = roundRobinScheduler(processes, timeQuantum);
            break;
        default:
            result = { error: 'Invalid algorithm' };
            break;
    }

    res.json(result);
});

app.post('/pagereplacement', function(req, res) {
    let inputarray = req.body.inputstring.replace(/\s/g, '').split("").map((e) => {
        if(isNaN(parseInt(e))) {
            return 0;
        }
        return parseInt(e);
    });

    let frames = Number(req.body.frames);
    let algorithm = req.body.algo[0];

    let data;

    switch (algorithm) {
        case 'First In First Out':
            data = fifo(inputarray, frames);
            break;
        case 'Optimal':
            data = optimal(inputarray, frames);
            break;
        case 'Least Recently Used':
            data = leastRecentlyUsed(inputarray, frames);
            break;
        case 'Least Frequently Used':
            data = leastFrequentlyUsed(inputarray, frames);
            break;
        default:
            data = { error: 'Invalid algorithm' };
            break;
    }

    res.status(200).send(data);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
