const fs = require('fs');
const dotenv = require('dotenv');
var faker = require('faker');
var moment = require('moment');
const shortid = require('shortid');


// Load env vars
dotenv.config({ path: '../.env' });

let arr = [];

for (let i = 0; i < 100; i++) {
  var newDateObj = moment(Date.now()).add(i * 30, 'm').toDate();
  let obj = {
    "id": shortid.generate(),
    "timeToLive": newDateObj,
    "name": faker.name.findName(),
    "address": faker.address.streetAddress(),
    "age": Math.floor(Math.random() * (60 - 10 + 1) + 10),
    "phoneNo": faker.phone.phoneNumber(),
    "country": faker.address.country()
  };
  arr.push(obj);
}

console.log(arr);

// Import data into file
const importData = async () => {
  try {
    fs.writeFileSync("../data.json", JSON.stringify(arr), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log(chalk.red.inverse.italic('Data Destroyed...'));
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}