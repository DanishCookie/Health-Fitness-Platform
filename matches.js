const favoriteButtons = document.querySelectorAll('.fa.fa-star.unchecked');

favoriteButtons.forEach((favoriteButton, index) => {
  favoriteButton.dataset.id = index;
  favoriteButton.addEventListener('click', function() {
    favoriteButton.classList.toggle('checked');
    favoriteButton.classList.toggle('unchecked');
    localStorage.setItem(`favorite-${favoriteButton.dataset.id}`, favoriteButton.classList.contains('checked'));
  });
});

function loadFavoriteButtons() {
  favoriteButtons.forEach((favoriteButton) => {
    const favorite = localStorage.getItem(`favorite-${favoriteButton.dataset.id}`);
    if (favorite === 'true') {
      favoriteButton.classList.remove('unchecked');
      favoriteButton.classList.add('checked');
    } else {
      favoriteButton.classList.remove('checked');
      favoriteButton.classList.add('unchecked');
    }
  });
}

// Call the function to set the initial state of the buttons
loadFavoriteButtons();