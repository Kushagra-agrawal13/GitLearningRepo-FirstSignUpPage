//jshint esversion:6

const express = require('express');
const bodyparser = require('body-parser');

//Here these both are also required
const request = require('request');
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const emailAddress = req.body.email;

    // This is the data which we have to send to mailchimp , but it is in javascript format (we need it in json , according to their documentation).
    const data = {
        members: [
            {
                email_address: emailAddress,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    // Then we are converting that data into JSON format
    const jsonData = JSON.stringify(data);

    const url = "https://us1.api.mailchimp.com/3.0/lists/  /* here comes my list id of mailchimp */";     //👈 here comes my list id of mailchimp 
    
    const options = {
        method: "POST",
        auth: "Kushagra:/* here comes my api key of mailchimp */"            //👈 here comes my api key of mailchimp
    };
    
    // This is the request criteria according to mailchimp documentation
    const request = https.request(url, options, function(response){


            //These loops are for success and failure pages
            if(response.statusCode===200){   
                res.sendFile(__dirname + "/success.html");
            }else{
                res.sendFile(__dirname + "/failure.html");
            }



                        response.on("data", function(data){
                          console.log(JSON.parse(data));
        })

    })

    //Final giving data to mailchimp
    request.write(jsonData);
    request.end();


});


app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});
