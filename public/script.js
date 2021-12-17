//find the delete-button in the document
const deleteBtn = document.querySelector('#delete-btn')
//find the like button in the document
const likeBtn = document.querySelector('#like-btn')
//find the like counter in the document
const likeCounter = document.querySelector('#like-counter')
//get the current sauceID from the url
const id = window.location.pathname.split('/restaurants/')[1]
//find element with the id details-btn
let btn = document.getElementById('details-btn')
//find the element with the id menu-bt
let menuBtn = document.getElementById('menu-btn')
//find element with the id list
let list = document.getElementById('list')
let menuList = document.getElementById('menu')
menuBtn.addEventListener('click', async () => {
    const id = window.location.pathname.split('/restaurants/')
    console.log(id)
    //fetch the menu route from express
    let res = await fetch(`/menu/${id[1]}`)
    //parse as json
    let restaurant = await res.json()
    //access Menus in respone
    let menus = restaurant.Menus
    console.log(menus)
    //for each menu in the list, create a sublist
    menuList.innerText = ""
    for(m of menus){
        //add a size 3 header for each menu
        let menuLabel = document.createElement('h3')
        menuLabel.innerText = m.title
        menuList.append(menuLabel)
        let menu = document.createElement('ul')
        //for each menu item in that menu, create a list item
        for(i of m.MenuItems){
            let item = document.createElement('li')
            item.innerText = `${i.name}: ${i.price}`
            menu.append(item)
        }
        menuList.append(menu)
    }
})
//add event listener when this button is clicked
// btn.addEventListener('click', async () => {
//     //fetch the restaurant-data path from my express server
//     let res = await fetch('/restaurant-data');
//     //parse the response as json - just the data
//     let restaurantList = await res.json();
//     //console.log the data from the response
//     list.innerText = ""
//     for(item of restaurantList.restaurants){
//         console.log(item)
//     }
//   })

btn.addEventListener('click', async () => {
    list.style.display='block'
   
    //fetch the restaurant-data path from my express server
    let res = await fetch('/restaurant-data');
    //parse the response as json - just the data
    let restaurantList = await res.json();
    //console.log the data from the response
    list.innerText = ""
    let allRestaurantContainer=document.createElement('h3')
    allRestaurantContainer.innerText="All Restaurants:"
    list.append(allRestaurantContainer)
    for(item of restaurantList.restaurants){
        let restaurantLabel = document.createElement('h5')
        restaurantLabel.innerText = item.name
        list.append(restaurantLabel)
    }
  });

//add event to delete this sauce
deleteBtn.addEventListener('click', async () => {
    //fetch sauce route for this id with the DELETE method
    let res = await fetch(`/restaurants/${id}`, {
        method: 'DELETE'
    })
    console.log(res)
    //send user back to the sauces path
    window.location.assign('/restaurants')
  });
  //add an event to Like this sauce
likeBtn.addEventListener('click', async () =>{
    //get current likes from counter
    let currentLikes = parseInt(likeCounter.innerHTML)
    console.log(currentLikes)
    //Increment current likes
    currentLikes+=1
    //update the likes counter
    likeCounter.innerHTML = currentLikes
    //fetch the route for this id with the PUT method
    let res = await fetch(`/restaurants/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            likes:currentLikes
        })
    })
});