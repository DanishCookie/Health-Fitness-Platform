// Dette er til at holde på billedet. Deraf navnet.
let displayedImage = document.getElementById("imageContainer");

// Jeg laver min funktion
function changeImage() {
  let imageSelectorAalborg = document.getElementById("Aalborg").checked;
  let imageSelectorAarhus = document.getElementById("Aarhus").checked;
  let imageSelectorOdense = document.getElementById("Odense").checked;
  let imageSelectorCopenhagen = document.getElementById("Copenhagen").checked;

  if (imageSelectorAalborg) {
    displayedImage.innerHTML = `<img src="byerImages/Aalborg.png">`;
  } else if (imageSelectorAarhus) {
    displayedImage.innerHTML = `<img src="byerImages/Aarhus.png">`;
  } else if (imageSelectorOdense) {
    displayedImage.innerHTML = `<img src="byerImages/Odense.png">`;
  } else if (imageSelectorCopenhagen) {
    displayedImage.innerHTML = `<img src="byerImages/Copenhagen.png">`;
  }
}

// Jeg tilføjer eventListener til hver gang byerns radio button skifter status
document.getElementById("Aalborg").addEventListener("change", changeImage);
document.getElementById("Aarhus").addEventListener("change", changeImage);
document.getElementById("Odense").addEventListener("change", changeImage);
document.getElementById("Copenhagen").addEventListener("change", changeImage);

function resetImageNothing() {
  displayedImage.innerHTML = "";
}

document.getElementById("resetFormBtn").addEventListener("click", resetImageNothing);


//Denne funktion "lytter" til hvad der sker på toggleGender switchen
function toggleGender() {
  document.getElementById("gender").addEventListener("change", function() {
    console.log("Test");
  });
}
toggleGender();

