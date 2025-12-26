const hamburger = document.getElementById('show-settings'); 
const navEl = document.querySelector('.settings-nav');
const backdropEl = document.querySelector(".backdrop"); 

const clefButton = document.getElementById('clef-options');
const clefSetting = document.getElementById('select-clef');

const practiceButton = document.getElementById('practice-options');
const practiceSetting = document.getElementById('select-pt');

const prefixButton = document.getElementById('prefix-options');
const prefixSetting = document.getElementById('select-prefix');

const transposeButton = document.getElementById('transpose-options');
const transposeSetting = document.getElementById('select-transpose');

const allSettings = [clefSetting, practiceSetting, prefixSetting, transposeSetting];

hamburger.onclick = function() {
    navEl.classList.add('navbar-active'); 
    backdropEl.classList.add('backdrop-active'); 
}

clefButton.onclick = function() {
    toggleSetting(clefSetting);
}
practiceButton.onclick = function() {
    toggleSetting(practiceSetting);
}
prefixButton.onclick = function() {
    toggleSetting(prefixSetting);
}
transposeButton.onclick = function() {
    toggleSetting(transposeSetting);
}

function toggleSetting(setting) {
    for (let i = 0; i < allSettings.length; i++) {
        if (allSettings[i] !== setting) {
            allSettings[i].classList.remove("revealed");
        }
    }
    if (!setting.classList.contains('revealed')) {
        setting.classList.add("revealed");
    } else {
        setting.classList.remove("revealed");
    }
}
