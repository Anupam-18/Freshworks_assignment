const fs = require('fs');
const chalk = require('chalk');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const { json } = require('body-parser');

const app = express();
dotenv.config();
const PORT = process.env.PORT || 7000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get(('/users'), async (req, res) => {
    fs.readFile('./data.json', 'utf8', function (err, data) {
        if (err) {
            return res.status(400).json({ "msg": "Failure" });
        }
        let allUsers = JSON.parse(data);
        res.status(200).json({ "msg": "Success", "length_of_data": allUsers.length, "data": allUsers });
    });
});

app.get(('/user/:user_id'), async (req, res) => {
    let user_id = req.params.user_id;
    fs.readFile('./data.json', 'utf8', function (err, data) {
        if (err) {
            return res.status(400).json({ "msg": "Failure" });
        }
        let allUsers = JSON.parse(data);
        allUsers.map((user) => {
            if (user.id === user_id) {
                // CHECK FOR THE TIME TO LIVE PROPERTY
                if (user.timeToLive < Date.now()) {
                    return res.status(400).json({ "msg": "Failure" });
                }
                return res.status(200).json({ "msg": "Success", "data": user });
            }
        })
    });
});

app.post(('/user'), async (req, res) => {
    let body = req.body;

    fs.readFile('./data.json', 'utf8', function (err, data) {
        if (err) {
            return res.status(400).json({ "msg": "Failure" });
        }
        let allUsers = JSON.parse(data);
        allUsers.push(body);

        // writing the file after adding a new user...
        fs.writeFile("results.json", JSON.stringify(allUsers), (err) => {
            if (err) return res.status(400).json({ "msg": "Failure" });
        })

        res.status(200).json({ "msg": "Success", "data": body });
    });


    if (newProduct != null) {
        res.status(200).json({ "msg": "Success", "data": newProduct });
    } else {
        res.status(400).json({ "msg": "Failure" });
    }
});

app.put(('/user/:user_id'), async (req, res) => {
    let body = req.body;
    let user_id = req.params.user_id;

    fs.readFile('./data.json', 'utf8', function (err, data) {
        if (err) {
            return res.status(400).json({ "msg": "Failure" });
        }
        let allUsers = JSON.parse(data);
        let modifiedUser, index;
        // select the given user
        for (index = 0; index < allUsers.length; index++) {
            let user = allUsers[index];
            if (user.id === user_id) {
                // CHECK FOR THE TIME TO LIVE PROPERTY
                if (user.timeToLive < Date.now()) {
                    return res.status(400).json({ "msg": "Time over Passed" });
                }
                modifiedUser = {
                    "id": user_id,
                    "timeToLive": "2021-01-02T01:59:38.457Z",
                    "name": body.name !== undefined ? body.name : user.name,
                    "address": body.address !== undefined ? body.address : user.address,
                    "age": body.age !== undefined ? body.age : user.age,
                    "phoneNo": body.phoneNo !== undefined ? body.phoneNo : user.phoneNo,
                    "country": body.country !== undefined ? body.country : user.country
                }
                // modify the actual array
                allUsers[index] = modifiedUser;

                // now write the file with modified user
                // writing the file after adding a new user...
                fs.writeFile("results.json", JSON.stringify(allUsers), (err) => {
                    if (err) return res.status(400).json({ "msg": "Failure" });
                })
                res.status(200).json({ "msg": "Success", "data": modifiedUser });

                // break from the loop...
                break;
            }
        }
    });
});

app.delete(('/user/:user_id'), async (req, res) => {
    let user_id = req.params.product_id;
    let index;

    fs.readFile('./data.json', 'utf8', function (err, data) {
        if (err) {
            return res.status(400).json({ "msg": "Failure" });
        }
        let allUsers = JSON.parse(data);

        for (index = 0; index < allUsers.length; index++) {
            let user = allUsers[index];
            if (user.id === user_id) {
                // CHECK FOR THE TIME TO LIVE PROPERTY
                if (user.timeToLive < Date.now()) {
                    return res.status(400).json({ "msg": "Time over Passed" });
                }

                //delete tht user
                allUsers.splice(1, index);

                // now write the file with modified user
                // writing the file after adding a new user...
                fs.writeFile("results.json", JSON.stringify(allUsers), (err) => {
                    if (err) return res.status(400).json({ "msg": "Failure" });
                })
                res.status(200).json({ "msg": "Success", "data": "Data Deleted for given id" });

                // break from the loop...
                break;
            }
        }

        res.status(200).json({ "msg": "Success", "length_of_data": allUsers.length, "data": allUsers });
    });
});


app.listen(PORT, () => console.log(chalk.bgBlue.bold(`Server Running On Port ${PORT}`)));