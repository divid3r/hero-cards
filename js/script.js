'use strict'

const heroCards = document.querySelector('.hero__cards'),
      heroPopup = document.getElementById('heroPopup'),
      heroFilterBtn = document.getElementById('heroFilterBtn'),
      heroMoviesFilter = document.getElementById('heroMoviesFilter'),
      heroAllFilters = document.getElementById('heroAllFilters');
let movies = [];

// get info about heroes from .json file
fetch('../db_heroes/dbheroes.json')
   .then((response) => {
      if (response.status !== 200) {
         throw new Error('status network not 200');
      }
      return response.json();
   })
   .then((data) => {
      renderCard(data);

      heroFilterBtn.addEventListener('click', () => {
         heroAllFilters.style.display = 'flex';

         // Make the select element for a list of movies
         heroMoviesFilter.innerHTML = '';
         movies = [];
         const moviesList = document.createElement('select');
         moviesList.classList.add('hero__movies-list');
         heroMoviesFilter.appendChild(moviesList);

         // Get the list of movies from .json file
         data.forEach(hero => {
            if (hero.movies) {
               for (let movie of hero.movies) {
                  movies = movies.concat(movie); // Unite repeated movies
               }
            }
         });

         // Make an elements (movies) for select element
         movies.forEach((movie, index) => {
            const moviesItem = document.createElement('option');
            if (index === 0) {
               moviesItem.classList.add('hero__movies-item');
               moviesItem.value = '';
               moviesItem.innerText = `Choose a movie ...`;
               moviesList.appendChild(moviesItem);
            } else {
               moviesItem.classList.add('hero__movies-item');
               moviesItem.value = movie;
               moviesItem.innerText = movie;
               moviesList.appendChild(moviesItem);
            }
         });

         moviesList.addEventListener('change', (event) => {
            const target = event.target.value;
            let newData = []; // New data variable for a filtered heroes

            // Filter of heroes by movie
            data.forEach(hero => {
               if (hero.movies) {
                  for (let movie of hero.movies) {
                     if (movie === target) {
                        newData.push(hero);
                     }
                  }
               }
            });

            if (target === '') {
               renderCard(data);
            } else renderCard(newData);
         });
      });
   })
   .catch((error) => {
      console.log(error);
   });

// render hero card
const renderCard = (data) => {
   let i = 0;
   heroCards.innerHTML = '';

   data.forEach(elem => {
      let heroCard = document.createElement('div');
      heroCard.classList.add('hero__card');
      heroCard.id = `${i}`;
      heroCard.innerHTML = `
         <div class="hero__photo"><img src="db_heroes/${elem['photo']}" alt="" /></div>
         <div class="hero__name">${elem['name']}</div>
         <div class="hero__real-name">${elem['realName']}</div>
      `;
      i++;
      heroCards.appendChild(heroCard);

      heroCard.addEventListener('click', (event) => {
         heroPopup.style.display = 'flex';
         renderCardBig(data, heroCard.id);
         let index = heroCard.id; // record current index of element

         heroPopup.addEventListener('click', (event) => {
            let target = event.target;
         
            // Close popup
            if (target.closest('.hero__popup-close-btn') || !target.closest('.hero__card-big')) {
               heroPopup.style.display = 'none';
            }
      
            // #arrowLeft move slider to the left
            if (target.closest('#arrowLeft')) {
               if (index <= 0) {
                  index = 0;
               } else {
                  index--;
               }

               renderCardBig(data, index);
            }

            // #arrowRight move slider to the right
            if (target.closest('#arrowRight')) {
               if (index === data.length - 1) {
                  index = data.length - 1;
               } else {
                  index++;
                  renderCardBig(data, index);
               }
            }
         });
      });
   });
}

// render modal window with additional info about a hero
const renderCardBig = (data, index) => {
   const movies = data[index]['movies'];
   let strMovies = '';

   if (movies) {
      movies.forEach(movie => {
          strMovies += '<span class="movie">' + movie + '</span>';
      });
   } else {
      strMovies += 'no movies';
   }

   heroPopup.innerHTML = `
      <div class="hero__card-big">
         <div class="hero__popup-close-btn"><img src="img/close.svg" alt="" /></div>
         <div class="arrow arrow-left" id="arrowLeft"></div>
         <div class="arrow arrow-right" id="arrowRight"></div>
         <div class="hero__photo-big"><img src="db_heroes/${data[index]['photo']}" alt="" /></div>
         <div class="hero__info">
            <div class="hero__big-name">${data[index]['name']}</div>
            <div class="hero__big-realname"></span>${data[index]['realName'] ? data[index]['realName'] : 'unknown'}</div>
            <div class="hero__big-actors"><span>actor: </span>${data[index]['actors']}</div>
            <div class="hero__big-species">${data[index]['species']}</div>
            <div class="hero__big-status">${data[index]['birthDay'] ? data[index]['birthDay'] : 'unknown'} - ${data[index]['deathDay'] ? data[index]['deathDay'] : 'unknown'}</div>
            <div class="hero__big-citizenship">${data[index]['citizenship'] ? data[index]['citizenship'] : 'unknown'}</div>
            <div class="hero__big-movies">${strMovies}</div>
         </div>
      </div>
   `;
}


