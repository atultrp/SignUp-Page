const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");
const { json } = require("body-parser");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const emailID = req.body.emailID;

    const data = {
        members: [{
            email_address: emailID,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us5.api.mailchimp.com/3.0/lists/10fa5cd22a";

    const options = {
        method: "POST",
        auth: "atultrp:336607c37c61d164b0574fbc8698c163-us5"
    };

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });

    });

    request.write(jsonData);
    request.end();

});

app.post("/failure.html", function() {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});