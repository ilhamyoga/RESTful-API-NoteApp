/*var express = require('express')
var bodyparser = require('body-parser')
var app = express()

app.use(bodyparser.json())
app.use('/', (req, res) => res.send('Hello Express!'))
app.use('/routes', (req, res) => res.send('Routes Test'))
app.listen(3000);
console.log('RESTful API.. App berjalan di localhost:' + 3000);*/

// merujuk express, body-parser
const express = require('express');
const bodyParser = require('body-parser');

// instansiasi obejct express dan di simpan pada konstanta app
const app = express();

// gunakan body parser sebgai middleware
app.use(bodyParser.json());

// untuk sementara kita anggap variable db ini sebagai sumber data kita
// contoh data yang kita gunakan adalah job pada karakter game
let db = [
    {
        id: 1,
        name: 'Warior',
        attack: 100,
        defence: 50,
        agility: 30,
        magic: 0,
    },
    {
        id: 2,
        name: 'Mage',
        attack: 10,
        defence: 20,
        agility: 50,
        magic: 100,
    },
];

// contoh routing pada express
app.get('/', (request, response) => response.send('Hello World'));

// memberikan List job
app.get('/jobs', (request, response) => {
    return response.json(db);
});

// memberikan job spesifik sesuai dengan nama yang ada pada url
app.get('/jobs/:name', (request, response) => {
    const result = db.filter(val => {
        return val.name.toLocaleLowerCase() === request.params.name.toLocaleLowerCase();
    });
    return response.json(result);
});

// memasukan job baru
app.post('/jobs', (request, response) => {
    const newJob = {
        id: db.length + 1,
        name: request.body.name,
        attack: request.body.attack,
        defence: request.body.defence,
        agility: request.body.agility,
        magic: request.body.magic,
    };

    db.push(newJob);
    
    return response.json(newJob);
});

// mengubah job yang ada
app.put('/jobs/:name', (request, response) => {
    const theJob = db.filter(val => {
        return val.name.toLocaleLowerCase() === request.params.name.toLocaleLowerCase();
    });

    if (theJob === null) {
        return response.json('Not Found');
    }

    const newJob = {
        id: theJob[0].id,
        name: request.body.name || theJob[0].name,
        attack: request.body.attack || theJob[0].attack,
        defence: request.body.defence || theJob[0].defence,
        agility: request.body.agility || theJob[0].agility,
        magic: request.body.magic || theJob[0].magic,
    };

    db.push(newJob);
    
    return response.json(newJob);
});

// menghapus job yang ada
app.delete('/jobs/:name', (request, response) => {
    db = db.filter(val => {
        return val.name.toLocaleLowerCase() !== request.params.name.toLocaleLowerCase();
    });

    return response.json(db);
});

// mendengarkan event yang terjadi pada localhost dengan port 3000
app.listen(3000, () => console.log('listenig on localhos:3000'));