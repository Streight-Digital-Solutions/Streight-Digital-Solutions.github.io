// FUNCTION THAT PLAYS THE UNIVERSAL SOUND EFFECT
function playMusic(){
    var audio = new Audio("../assets/audio/click.mp3");
    audio.play();
}
// APPLY SOUND EFFECT TO ALL NAVIGATION LINKS
var navitems = document.querySelectorAll("#nav-link");
navitems.forEach((event) => event.addEventListener("mouseover", playMusic));

// APPLY SOUND EFFECT TO ALL TERMS BUTTONS WHEN CLICKED
var termbuttons = document.querySelectorAll("#action-button");
termbuttons.forEach((event) => event.addEventListener("click", playMusic));


// CONTACT FORM SUBMISSION
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
