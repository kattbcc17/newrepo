const nav = document.querySelector('nav')
const toggle = document.querySelector('.toggle')
const logo = document.querySelector('.siteName a')
let isOpen = false

toggle.addEventListener('click', ()=>{

    if(!isOpen){
        nav.style.display = "block";
        isOpen = true;
        logo.style.marginLeft = "-90px"
    }else{
        nav.style.display = "none"
        logo.style.marginLeft = "0px"
        isOpen = false;
    }

})