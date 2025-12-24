let imagesLoaded = 0; 
const totalImages = 7; 

const navEl = document.querySelector('.settings-nav'); 
const hamburger = document.getElementById('show-settings'); 
const closeButton = document.getElementById('byebye'); 
const refreshButton = document.getElementById('refresh'); 
const revealButton = document.getElementById('reveal'); 
const clefs = document.getElementsByName('clef'); 
const practiceTypes = document.getElementsByName('pt'); 
const prefixTypes = document.getElementsByName('sf'); 

const trebleImg = new Image(); 
trebleImg.src = "Assets/Images/treble-clear.png"; 
const altoImg = new Image(); 
altoImg.src = "Assets/Images/alto-tenor-clear.png"; 
const bassImg = new Image(); 
bassImg.src = "Assets/Images/bass-clear.png"; 
const noteImgUp = new Image(); 
noteImgUp.src = "Assets/Images/quarternote-clear.png"; 
const noteImgDown = new Image(); 
noteImgDown.src = "Assets/Images/quarternoteflipped-clear.png"; 
const sharpImg = new Image(); 
sharpImg.src = "Assets/Images/sharp-clear.png"; 
const flatImg = new Image(); 
flatImg.src = "Assets/Images/flat-clear.png"; 
const nothingImg = new Image(); // :p

trebleImg.onload = checkImagesLoaded; 
altoImg.onload = checkImagesLoaded; 
bassImg.onload = checkImagesLoaded; 
noteImgUp.onload = checkImagesLoaded; 
noteImgDown.onload = checkImagesLoaded; 
flatImg.onload = checkImagesLoaded; 
sharpImg.onload = checkImagesLoaded; 

const ALL_NOTE_NAMES = ["a", "ab", "b", "c", "cd", "d", "de", "e", "f", "fg", "g", "ga"]; 
var notesInClefOrder = []; 

// ik, hardcoded positions are bad :( but it works at all canvas sizes :)
const clefInfo = new Map([
    [0, { img: trebleImg, x: 50, y: 35, width: 100, height: 200 }],
    [1, { img: altoImg, x: 50, y: 95, width: 70, height: 90 }],
    [2, { img: altoImg, x: 50, y: 75, width: 70, height: 90 }],
    [3, { img: bassImg, x: 50, y: 100, width: 60, height: 70 }]
]); 

var notePositions = new Map(); 

let pracClef = clefInfo.get(0); 
let pracType = 0; 
let pracPrefix = 0; 

var note; 
var notesOnScreen = []

const canvas = document.getElementById('score'); 
const ctx = canvas.getContext('2d'); 
canvas.width = window.innerWidth / 2; 
canvas.height = window.innerHeight / 2; 

window.addEventListener('resize', function() { 
    canvas.width = window.innerWidth / 2; 
    canvas.height = window.innerHeight / 2; 
    draw(); 
}); 

ctx.font = "50px Roboto"; 
ctx.fillText("Loading...", 80, 80); 

function checkImagesLoaded() { 
    imagesLoaded++; 
    if (imagesLoaded == totalImages) { 
        generateNotesInClef(); 
        generateNote(); 
    } 
} 

function generateNotesInClef() { 
    notesInClefOrder.length = 0; 
    notePositions.clear();
    let start; 
    if (pracClef == clefInfo.get(0)) { 
        start = 3; // starts on c 
    } else if (pracClef == clefInfo.get(1)) { 
        start = 5; // starts on d 
    } else if (pracClef == clefInfo.get(2)) { 
        start = 2; // starts on b 
    } else if (pracClef == clefInfo.get(3)) { 
        start = 7; // starts on e 
    } 
    for (let i = 0; i < 25; i++) { 
        notesInClefOrder.push(ALL_NOTE_NAMES[(start + i) % 12] + String(i)); 
    } 
    let currentPos = 0; 
    let accedentalNote = (pracPrefix == 0) ? -1 : 0; 
    for (let i = 0; i < 25; i++) { 
        if (notesInClefOrder[i].replace(/[0-9]/g, '').length == 1) { 
            notePositions.set(notesInClefOrder[i], 14-currentPos); 
            currentPos++; 
        } else { 
            notePositions.set(notesInClefOrder[i], 14-(currentPos + accedentalNote)); 
        } 
    } 
} 

function generateNote() { 
    notesOnScreen.length = 0;
    let noteID; 
    if (pracType == 0) { 
        noteID = Math.floor(Math.random() * 25); 
    } else { 
        noteID = Math.floor(Math.random() * 12); 
    } 
    note = notesInClefOrder[noteID]; 
    notesOnScreen.push(note)
    draw(); 
} 

function drawNote(x) { 
    console.log(note);
    let basis = notePositions.get(note); 
    let noteY = 50 + basis * 10; // 50: two ledger lines above the staff | 10: space between possible notes 
    let prefix = nothingImg;
    let dimension = [0, 0]; 
    if (note.replace(/[0-9]/g, '').length == 2) {
        prefix = (pracPrefix == 0) ? sharpImg : flatImg;
        dimension = (pracPrefix == 0) ? [23/32*20, 20, 0] : [20/43*30, 30, -10]
    }
    if (noteY < 140) { 
        ctx.drawImage(prefix, x-5, noteY + dimension[2], dimension[0], dimension[1]);
        ctx.drawImage(noteImgDown, x, noteY - 1, 50, 80); 
    } else {
        ctx.drawImage(prefix, x-5, noteY + dimension[2], dimension[0], dimension[1]); 
        ctx.drawImage(noteImgUp, x, noteY - 59, 50, 80);
    } 
    for (let i = 1; i < 3; i++) { 
        checkPos = 40 + (20 * i); 
        if (noteY < checkPos) { 
            ctx.beginPath(); 
            ctx.moveTo(x + 10, checkPos); 
            ctx.lineTo(x + 40, checkPos); 
            ctx.stroke(); 
        } 
        if (noteY == 190) { // will make dynamic if i decide to add a range option 
            ctx.beginPath(); 
            ctx.moveTo(x + 8, 200); 
            ctx.lineTo(x + 38, 200); 
            ctx.stroke(); 
        } 
    } 
} 

function draw() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.fillStyle = "white"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
    ctx.strokeStyle = "black"; 
    ctx.lineWidth = 2; 
    ctx.fillStyle = 'black'; 
    ctx.font = "2rem Roboto"; 
    for (let i = 0; i < 5; i++) { // 5 line 20px apart to create bar lines 
        let lineY = 100 + (20 * i); 
        ctx.beginPath(); 
        ctx.moveTo(0, lineY); 
        ctx.lineTo(canvas.width, lineY); 
        ctx.stroke(); 
    } 
    drawNote(180); // draws a note at x=180 
    const { img, x, y, width, height } = pracClef; 
    ctx.drawImage(img, x, y, width, height); 
} 

hamburger.onclick = function() { 
    navEl.classList.add('active'); 
}; 

closeButton.onclick = function() { 
    for (let i = 0; i < clefs.length; i++) { 
        if (clefs[i].checked) { 
            pracClef = clefInfo.get(i); 
        } 
    } 
    for (let i = 0; i < practiceTypes.length; i++) { 
        if (practiceTypes[i].checked) { 
            pracType = i; 
        } 
    } 
    for (let i = 0; i < prefixTypes.length; i++) { 
        if (prefixTypes[i].checked) { 
            pracPrefix = i; 
        } 
    } 
    generateNotesInClef(); 
    draw(); 
    navEl.classList.remove('active'); 
}; 

refreshButton.onclick = function() { 
    generateNote(); 
};

revealButton.onclick = function() {
    ctx.font = "20px Roboto"; 
     for (let i = 0; i < notesOnScreen.length; i++) {
        let noteName = note.replace(/[0-9]/g, '').toUpperCase();
        if (noteName.length == 2) {
            if (pracPrefix == 0) {
                noteName = noteName.slice(0, 1) + "♯"; 
            } else {
                noteName = noteName.slice(1, 2) + "♭"; 
            }
        }
        ctx.fillText(noteName, 190, 230); 
     }
}
