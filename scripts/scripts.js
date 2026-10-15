var navitem = document.getElementById("nav-link");
var navitem2 = document.getElementById("nav-link2");
var navitem3 = document.getElementById("nav-link3");
var navitem4 = document.getElementById("nav-link4");
var navitem5 = document.getElementById("nav-link5");
var navitem6 = document.getElementById("nav-link6");

navitem.addEventListener("mouseover", playMusic);
navitem2.addEventListener("mouseover", playMusic);
navitem3.addEventListener("mouseover", playMusic);
navitem4.addEventListener("mouseover", playMusic);
navitem5.addEventListener("mouseover", playMusic);
navitem6.addEventListener("mouseover", playMusic);

var termbutton = document.getElementById("action-button");
termbutton.addEventListener("click", playMusic);

function playMusic(){
    var audio = new Audio("../assets/audio/click.mp3");
    audio.play();
   
}

var button = document.getElementById("liability");
button.addEventListener("click", Scroll)

function Scroll(){
    button.scrollIntoView();
}

const form = document.getElementById('form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("access_key", "6cf0bab0-63af-440b-8d58-7506057a34f2");

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success! Your message has been sent.");
            form.reset();
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});
