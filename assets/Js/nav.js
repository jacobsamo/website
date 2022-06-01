//import the classes form html
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');


//add event listener for the button being clicked
hamburger.addEventListener('click', () =>{
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
})

//remove the event listener when a link is clicked
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () =>{
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}))