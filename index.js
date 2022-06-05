const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require('express');
const path = require('path');
const axios = require("axios");
const app = express();
const cors = require('cors')

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    axios.get('https://judge0-ce.p.rapidapi.com/about', {
        headers: {
            'X-RapidAPI-Host': process.env.HOST,
            'X-RapidAPI-Key': process.env.KEY
        }
    })
        .then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
})


app.post('/createsub', (req, res) => {
    console.log(req.body)
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: { base64_encoded: 'false', fields: '*' },
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
            'X-RapidAPI-Host': process.env.HOST,
            'X-RapidAPI-Key': process.env.KEY
        },
        data: '{"language_id":71,"source_code":' + `${req.body.code}` + '}'
    };

    axios.request(options).then(function (response) {
        checkStatus(response.data.token);
    }).catch(function (error) {
        console.error(error);
    });

    const checkStatus = async (token) => {
        const options = {
            method: "GET",
            url: 'https://judge0-ce.p.rapidapi.com/submissions/' + token,
            params: { base64_encoded: "false", fields: "*" },
            headers: {
                "X-RapidAPI-Host": process.env.HOST,
                "X-RapidAPI-Key": process.env.KEY,
            },
        };

        axios.request(options)
            .then(response => {
                let statusId = response.data.status?.id;
                if (statusId === 1 || statusId === 2) {
                    setTimeout(() => {
                        checkStatus(token)
                    }, 2000)
                    return
                } else {
                    console.log(response.data)
                    return
                }
            })
            .catch(err => {
                console.log("err", err);
            })
    };

})

app.listen(6000, () => {
    console.log("server is running");
})