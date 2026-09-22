var card = document.getElementById("nav");
card.addEventListener("mouseover", playMusic);

function playMusic(){
    var audio = new Audio("./audio/click.mp3");
    audio.play();
   
}

var button = document.getElementById("liability");
button.addEventListener("click", Scroll)

function Scroll(){
    button.scrollIntoView();
}