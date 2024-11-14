const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ['http://127.0.0.1:5500', 'https://danielbgoncalves.github.io', 'https://danielbgoncalves.github.io/YoutubeScraping/'];

const corsOption = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(express.json());

app.post('/scraping', async (req, res) =>{
    try{
        let url = req.body.url;

        const pyProcess = spawn('python', ['main.py', url]);
        let result = '';

        pyProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pyProcess.stdout.on('end', () => {
            try{
                const parsedResult = JSON.parse(result);
                res.json({status: 'Sucess', data: parsedResult});
            }catch(error){
                console.error(`Erro ao analisar JSON: ${error}`);
                res.status(500).json({status: 'Error', message: 'Erro ao analisar os dados do Python.'})
            }
        });

        pyProcess.stderr.on('data', (data) => {
            console.error(`Erro no script Python ${data}`);
            res.status(500).json({status: 'Error', message: data.toString() });
        });

    } catch(error){
        console.error(`Erro ao iniciar o processo em Python ${error}`);
        res.status(500).json({Statys: "Error", message: "Erro ao inicar o processo em Python"})
    }
});

app.listen(port, ()=>{
    console.log(`Ouvindo da porta ${port}`);
});