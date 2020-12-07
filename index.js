// EXPRESS AND OTHER SETUP
const express = require('express');
const MongoUtil = require('./MongoUtil.js')
const hbs = require('hbs')
const wax = require('wax-on')


// load in environment variables
require('dotenv').config();

// create the app
const app = express();
//use handlebars as the view engine (for templates) ==because they many other choices
//allows express to data submitted via forms
app.set('view engine', 'hbs')
//we want our static files (images, css etc) to be in a folder 
app.use(express.static('public'))
//allows express to datasubmitted via form
app.use(express.urlencoded({extended:false}))
// setup template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

async function main() {
    const MONGO_URL=process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, "tgc9_cico");
    let db = MongoUtil.getDB();

    app.get('/', async (req,res) => {
        let food = await db.collection('food').find().toArray();
        res.render('food', {
            'foodRecords' : food
        })
    })

      app.get('/food/add', async (req,res)=>{
        res.render('add_food')
    })

app.post('/food/add', async (req,res)=> {
    let {name,calories,meal,date,tags} = req.body;
    let newFoodRecord = {
        'name' :name,
        'calories' : parseInt(calories),
        'meal' : meal,
        'date' : new Date(date),
        'tag' :tags
    }
    await db.collection('food').insertOne(newFoodRecord);
    res.redirect('/')
})
 
}

main();

// LISTEN
app.listen(3000, ()=>{
    console.log("Express is running")
    
})