let element = document.querySelector(".door");
element.addEventListener("click", toggleDoor);

function toggleDoor() {
    element.classList.toggle("doorOpen");
}

const doornumber = document.querySelector('#number');
let today = new Date();
doornumber.innerHTML = today.getDate();

const gift = document.querySelector('#gift');
gift.addEventListener('click', showGift);

const settingsbtn = document.querySelector('#settings');
const giftdialog = document.querySelector('#gift-dialog');
const controldialog = document.querySelector('#control-dialog');
const closebtn = document.querySelector('#close');
const savebtn = document.querySelector('#save_btn');
savebtn.addEventListener('click', saveGiftList);
const loadbtn = document.querySelector('#load_btn');
loadbtn.addEventListener('click', loadGiftList);
const volslider = document.querySelector('#volumeslider');
let audio = null;
const autoremove_chk = document.querySelector('#autoremove');

autoremove_chk.addEventListener('click', (event) => {
    localStorage.setItem('giftautoremove', event.target.checked);
});

window.onload = function() {
    let vol = localStorage.getItem('giftvolume');
    if (!vol) {
        vol = 50;
    }

    volslider.value = vol;

    audio = document.createElement("audio");
    audio.src = 'every_xmas_merry_xmas.ogg';
    audio.volume = vol / 100;
    audio.play();
}

volslider.onchange = function() {
    let vol = volslider.value;
    localStorage.setItem('giftvolume', vol);
    audio.volume = vol / 100;
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        giftdialog.style.display = "none";
        controldialog.style.display = "none";
        closebtn.style.display = "none";
    }
}

closebtn.onclick = function() {
    giftdialog.style.display = "none";
    controldialog.style.display = "none";
    closebtn.style.display = "none";
}

settingsbtn.onclick = function(event) {
    controldialog.style.display = "block";
    closebtn.style.display = "block";
}

let giftlist = [];
let storedList = localStorage.getItem('giftlist');
if (storedList) {
    giftlist = JSON.parse(storedList);
    for (let i = 0; i < giftlist.length; i++) {
        addGiftListItem(giftlist[i], i);
    }
}

const addbtn = document.querySelector('#add_btn');
addbtn.onclick = function(event) {
    const gifttextin = document.querySelector('#gifttext_in').value;
    if (gifttextin) {
        giftlist.push(gifttextin);
        updateGiftlist();
        document.querySelector('#gifttext_in').value = "";
    }
}

function addGiftListItem(item, id) {
    const element = document.createElement('div');
    /*const btn = document.createElement('button');
    btn.innerHTML = "🗑️";
    btn.addEventListener('click', removeGiftListItem);
    element.appendChild(btn);*/
    const btn = '<button onclick="removeGiftListItem(event)">🗑️</button>'
    element.innerHTML = btn;
    element.innerHTML += " - " + item;
    element.id = id;
    document.querySelector('#giftlist').appendChild(element);
}

function removeGiftListItem(event) {
    giftlist.splice(event.target.parentNode.id, 1);
    updateGiftlist();
}

function updateGiftlist() {
    document.querySelector('#giftlist').innerHTML = "";
    for (let i = 0; i < giftlist.length; i++) {
        addGiftListItem(giftlist[i], i);
    }
    localStorage.setItem('giftlist', JSON.stringify(giftlist));
}

function saveGiftList() {
    const name = "giftlist.json";
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(giftlist)], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function loadGiftList() {
    let input, file, fr;
    if (typeof window.FileReader !== 'function') {
        console.error("The file API isn't supported on this browser yet.");
        return;
    }
    input = document.getElementById('fileinput');
    if (!input.files[0]) {
        alert("Bitte Datei auswählen!");
    } else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(file);
    }

    function receivedText(e) {
        let lines = e.target.result;
        giftlist = JSON.parse(lines);
        updateGiftlist();
    }
}

function showGift(event) {
    let desc = document.querySelector('#gift-description');
    let gift_str = "Leider keine Geschenke hinterlegt :-(";
    if (giftlist.length > 0) {
        let i = Math.floor(Math.random() * giftlist.length);
        gift_str = giftlist[i];
        if (autoremove_chk.checked) {
            removeGiftListItem(i);
        }
    }
    desc.innerHTML = gift_str;
    giftdialog.style.display = "block";
    closebtn.style.display = "block";
}