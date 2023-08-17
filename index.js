const express = require('express');
const {MongoClient} = require('mongodb');
const path = require('path');

const app = express();


app.get('/', async (req, res) => {
    require("dotenv").config({ path: "./config.env" });
    const uri = process.env.URI;
    const client = new MongoClient(uri, { useNewUrlParser: true });

    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');
    
    // Set the view engine to use EJS templates

    try {
        await client.connect();
        console.log('Connected to MongoDB');
    
        const RestaurantsInfo = client.db('CaseBites').collection('RestaurantsInfo');
        const restaurants = RestaurantsInfo.find();
        const data = [];
        await restaurants.forEach((document) => {
          data.push({
            name: document.name,
            location: document.location,
            payOptions: document.payOptions,
            hours: document.hours ,
            popItems: document.popItems,
            waitTime: document.waitTime,
            img: document.img
          });
        });
        
        //const userId = '6441518e3f9e71240c76c943';
        const userName = "testUser5"
        const UserInformation = client.db('CaseBites').collection('UserInformation');
        const user = await UserInformation.findOne({ name: userName });

        var caseCash = 0;
        var portSwipes = 0;
        var mealSwipes = 0;
        var reviewPoints = 0;

        try {
          caseCash = user.caseCash;
          reviewPoints = user.points;
          if(user.onMealPlan) {
            if(user.mealPlan == "Unlimited") {
              portSwipes = 7;
              mealSwipes = "Unlimited";
  
            }
            else if(user.mealPlan == "10 Classic") {
              portSwipes = 3;
              mealSwipes = 10;
  
            }
            else if(user.mealPlan == "14 Classic") {
              portSwipes = 3;
              mealSwipes = 14;
  
            }
            else if(user.mealPlan == "17 Classic") {
              portSwipes = 3;
              mealSwipes = 17;
  
            }
            else if(user.mealPlan == "10 Halal/Kosher") {
              portSwipes = 3;
              mealSwipes = 10;
  
            }
            else if(user.mealPlan == "14 Halal/Kosher") {
              portSwipes = 3;
              mealSwipes = 14;
  
            }
            else if(user.mealPlan == "Apartment 5/3/150") {
              portSwipes = 3;
              mealSwipes = 5;
  
            }
            else if(user.mealPlan == "Apartment 7/5/100") {
              portSwipes = 3;
              mealSwipes = 7;
  
            }
            else {
              portSwipes = 3;
              mealSwipes = 5;
  
            }
          }
        }
        catch (error) {
        }

        res.render(path.join(__dirname+'/map.ejs'),{
          data:data, 
          caseCash:caseCash, 
          portSwipes:portSwipes,
          mealSwipes:mealSwipes,
          reviewPoints:reviewPoints
        });
        // The "data" variable is passed to the "map" template file
        } catch (error) {
            console.error(`Error: ${error}`);
            res.send(`Error: ${error}`);
        } finally {
            await client.close();
            console.log('Disconnected from MongoDB');
        }
    });

    app.listen(3000, () => {
    console.log('Server listening on port 3000');
    });