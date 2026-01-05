let imagesLoaded = 0; 
const totalImages = 7; 

const navEle = document.querySelector('.settings-nav'); 
const backdropEle = document.querySelector(".backdrop");
const closeButton = document.getElementById('save-and-close'); 
const refreshButton = document.getElementById('refresh'); 
const revealButton = document.getElementById('reveal'); 
const clefs = document.getElementsByName('clef'); 
const practiceTypes = document.getElementsByName('pt'); 
const prefixTypes = document.getElementsByName('sf');
const halfStepCounter = document.getElementById('tp'); 

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
let pracTranspose = 0; 

var note; 
var notesOnScreen = []
var key;

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
        generateNote(true); 
    } 
} 

function generateNotesInClef(forcedPrefix = pracPrefix) { 
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
    let accedentalNote = (forcedPrefix == 0) ? -1 : 0; 
    for (let i = 0; i < 25; i++) { 
        if (notesInClefOrder[i].replace(/[0-9]/g, '').length == 1) { 
            notePositions.set(notesInClefOrder[i], 14-currentPos); 
            currentPos++; 
        } else { 
            notePositions.set(notesInClefOrder[i], 14-(currentPos + accedentalNote)); 
        } 
    } 
} 

function generateNote(newKey = false) { 
    notesOnScreen.length = 0;
    let noteID; 
    if (pracType == 0) { 
        noteID = Math.floor(Math.random() * 25); 
    } else { 
        noteID = Math.floor(Math.random() * 12); 
    }
    note = notesInClefOrder[noteID]; 
    notesOnScreen.push(note);
    if (newKey) key = note.replace(/[0-9]/g, ''); 
    draw(); 
} 

function drawNote(x, nt, forcedPrefix = pracPrefix) {
    notesOnScreen.push({x: x, nt: nt});
    let basis = notePositions.get(nt); 
    let noteY = 50 + basis * 10; // 50: two ledger lines above the staff | 10: space between possible notes 
    let prefix = nothingImg;
    let dimension = [0, 0]; 
    if (nt.replace(/[0-9]/g, '').length == 2) {
        prefix = (forcedPrefix == 0) ? sharpImg : flatImg;
        dimension = (forcedPrefix == 0) ? [23/32*20, 20, 0] : [20/43*30, 30, -10]
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
    notesOnScreen.length = 0; 
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

    if (pracType == 0) {
        drawNote(180, note); // draws a note at x=180 
    } else {
        generateScale(note);
    }
        
    const { img, x, y, width, height } = pracClef; 
    ctx.drawImage(img, x, y, width, height); 
}

function generateScale(nt) {
    let scalePrefix = (["g", "d", "a", "e", "b"].includes(key)) ? 0 : 1;
    generateNotesInClef(scalePrefix);
    drawNote(180, nt, scalePrefix);
    index = notesInClefOrder.indexOf(nt);
    for (let i = 1; i<8; i++) {
        let interval = (i == 3 || i == 7) ? 1 : 2;
        index += interval;
        drawNote(180+60*i, notesInClefOrder[index], scalePrefix);
    }

}

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

    let numValue = halfStepCounter.valueAsNumber;
    pracTranspose = (isNaN(numValue)) ? 0 : numValue;

    (pracType === 0) ? generateNote() : generateNote(true);
    

    draw();
    generateNotesInClef();
    generateNote(true);
    navEle.classList.remove('navbar-active');
    backdropEle.classList.remove('backdrop-active');  
}; 

refreshButton.onclick = function() { 
    generateNote(true); 
};

revealButton.onclick = function() {
    draw();
    ctx.font = "20px Roboto"; 
     for (let i = 0; i < notesOnScreen.length; i++) {
        let {x, nt} = notesOnScreen[i];
        let noteName = nt.replace(/[0-9]/g, '');
        let new_index = (ALL_NOTE_NAMES.indexOf(noteName)+pracTranspose)%(ALL_NOTE_NAMES.length-1)
        new_index = (new_index >= 0) ? new_index : 11+new_index;
        let transposedNote = ALL_NOTE_NAMES[new_index].toUpperCase();
        console.log(transposedNote, new_index);
        if (transposedNote.length == 2) {
            if (pracPrefix == 0) {
                transposedNote = transposedNote.slice(0, 1) + "♯"; 
            } else {
                transposedNote = transposedNote.slice(1, 2) + "♭"; 
            }
        }
        ctx.fillText(transposedNote, x+10, 230); 
     }
}