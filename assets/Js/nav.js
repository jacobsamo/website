const menuBtn = document.querySelector('.nav-menu');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
  if(!menuOpen) {
    menuBtn.classList.add('active');
    menuOpen = true;
  } else {
    menuBtn.classList.remove('active');
    menuOpen = false;
  }
});





