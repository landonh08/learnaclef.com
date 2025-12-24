const hamburger = document.getElementById('show-settings'); 
const navEl = document.querySelector('.settings-nav'); 

hamburger.onclick = function() { 
    navEl.classList.add('active'); 
}; 