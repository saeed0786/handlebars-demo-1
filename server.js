const express = require("express");
const { check, validationResult } = require('express-validator');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const {sequelize}= require ('./db')
const Restaurant = require('./models/restaurant');
const Menu = require('./models/menu');
const MenuItem = require('./models/menuItem');
const initialiseDb = require('./initialiseDb');
initialiseDb();
const app = express();
const port = 3000;
app.use(express.static('public'));
//app.use(express.json());
//this new line of code allow you to add restaurant image.
app.use(express.json())
app.use(express.urlencoded({extended:false}))
const handlebars = expressHandlebars({
    handlebars : allowInsecurePrototypeAccess(Handlebars)
})
app.engine('handlebars', handlebars);
app.set('view engine', 'handlebars')
const seedDb = async () => {    
    // await sequelize.sync({ force: true });
     const restaurants = [
        {name : 'Mcdonald', image : '/img/mcdonalds-ronald-mcdonald.gif'},
        {name : 'Popeys', image: '/img/popeyes-fried-chicken.gif'},
        {name : 'KFC', image: '/img/KFC.gif'}
    ]
    const restaurantPromises = restaurants.map(restaurant => Restaurant.create(restaurant))
    await Promise.all(restaurantPromises)
    console.log("db populated!")
}
seedDb();
const restaurantChecks = [
    check('name').not().isEmpty().trim().escape(),
    check('image').isURL(),
    check('name').isLength({ max: 50 })
]
//*************** ROUTES ******************//
//index redirects to restaurant
app.get('/', (req,res)=>{
    res.redirect('/restaurants')
})
app.get('/restaurants', async (req, res) => {
    const restaurants = await Restaurant.findAll();
    res.render('restaurants',{restaurants})
});
app.get('/restaurant-data', async (req,res) => {
    const restaurants = await Restaurant.findAll();
    res.json({restaurants})
})
app.get('/menu/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {include: {
            model: Menu,
            include: MenuItem
        }
    });
    res.json(restaurant)
});
app.get('/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {include: {
            model: Menu,
            include: MenuItem
        }
    });
    //res.json(restaurant);
    res.render('restaurant',{restaurant})
});
app.post('/restaurants', restaurantChecks, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await Restaurant.create(req.body);
    res.sendStatus(201);
});
app.put('/restaurants/:id', restaurantChecks, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const restaurant = await Restaurant.findByPk(req.params.id);
    await restaurant.update(req.body);
    res.sendStatus(200);
});
app.patch('/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    await restaurant.update(req.body);
    res.sendStatus(200);
});
//New Restaurant go here:
app.get('/new-restaurant',async(req,res)=>{
    const restaurantAlert=""
    res.render('newrestaurant',{restaurantAlert})
})
app.post('/new-restaurant',async(req,res)=>{
const newRestaurant=await Restaurant.create(req.body)
let restaurantAlert = `${newRestaurant.name} added to your database`
const foundRestaurant=await Restaurant.findByPk(newRestaurant.id)
if(foundRestaurant){
    res.render('newrestaurant',{restaurantAlert})
}else{
    restaurantAlert='Failed to add Sauce'
    res.render('newrestaurant',{restaurantAlert})
}
})
//DELETE method, sauces/:id path => Deletes a sauce from db.sqlite
app.delete('/restaurants/:id', async (req,res)=>{
    const deleterestaurant = await Restaurant.destroy({
        where: {id:req.params.id}
    })
    // const restaurants = await Restaurant.findAll();
    // res.render('restaurants', {restaurants})
    res.render(deleterestaurant ? 'Deleted' : 'Deletion Failed')
})
app.put('/restaurants/:id', async (req,res) => {
    let updatedrestaurant = await Restaurant.update(req.body, {
        where: {id: req.params.id}
    })
    const restaurant = await Restaurant.findByPk(req.params.id)
    res.render('restaurant', {restaurant})
})
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});