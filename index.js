// EXPRESS AND OTHER SETUP
const express = require('express');
const MongoUtil = require('./MongoUtil.js');
const ObjectId  = require('mongodb').ObjectId;
const hbs = require('hbs');
const wax = require('wax-on');
const passport = require('./passport/setup');

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
app.use(passport.initialize());
app.use(passport.session());
// app.use(cookieParser("secret"))
// app.use(session({
//     cookie:{
//         maxAge:60000
//     }
// }))


// app.use(function(req,res,next) {
//     res.locals.success_message = req.flash("success_messages");
//     res.locals.err_messages= req.flash("error_messages");
//     next(); 
// })

// setup template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

var helpers = require("handlebars-helpers")({
    handlebars : hbs.handlebars
});

async function main() {
    const MONGO_URL=process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, "Fault_Reporting");
    let db = MongoUtil.getDB();

     app.get('/', async (req,res) => {
         let results = await db.collection('faults').find().toArray();
         res.render('fault', {
             'faults' : results
         })
     })

    app.get('/faults/add', async (req,res) =>{
        res.render('add_fault');
    }) 

app.post('/faults/add', async (req,res) =>{
    let {title,location,tags,block,reporter_name,reporter_email,date} = req.body;
    
    let newFaultRecord = {title,location,tags,block,reporter_name,reporter_email,
        'date': new Date(date)};
         await db.collection('faults').insertOne(newFaultRecord);
        res.redirect('/')
})

app.get('/fault/:id/update', async (req,res) => {
    let fault = await db.collection('faults').findOne({
        '_id' : ObjectId(req.params.id)
    })    
    res.render('fault_form', {
        'fault' : fault
    })
})

app.post('/fault/:id/update', async (req,res) => {
    let updateFaultRecord = {};
      updateFaultRecord.title = req.body.title;
     updateFaultRecord.location = req.body.location;
      updateFaultRecord.block = req.body.block;
       updateFaultRecord.tags = req.body.tags;
        updateFaultRecord.reporter_name = req.body.reporter_name;
         updateFaultRecord.reporter_email = req.body.reporter_email;

await db.collection('faults').updateOne({
    '_id' : ObjectId(req.params.id)
},{ '$set' : updateFaultRecord});
res.redirect('/');
})

app.get('/fault/:id/delete', async (req,res) => {

    let record = await db.collection('faults').findOne({
        '_id' : ObjectId(req.params.id)
    })
    res.render('confirm_delete_fault', {
        'fault' : record
    })
})

app.post('/fault/:id/delete', async (req,res) => {
    await db.collection('faults').deleteOne({'_id': ObjectId(req.params.id)
})
res.redirect('/')
})


const userRoutes = require('./routes/userRoutes')
app.use('/users',userRoutes);



}

main();

// LISTEN
app.listen(3000, ()=>{
    console.log("Express is running")   
})