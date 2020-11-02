'use strict'

const heroCards = document.querySelector('.hero__cards'),
      heroPopup = document.getElementById('heroPopup'),
      heroFilterBtn = document.getElementById('heroFilterBtn'),
      heroAllFilters = document.getElementById('heroAllFilters'),
      heroGenderFilter = document.getElementById('heroGenderFilter'),
      heroStatusFilter = document.getElementById('heroStatusFilter'),
      heroMovieFilter = document.getElementById('heroMoviesFilter');
let movies = [];

// Get info about heroes from .json file
fetch('./db_heroes/dbHeroes.json')
   .then((response) => {
      if (response.status !== 200) {
         throw new Error('status network not 200');
      }
      return response.json();
   })
   .then((data) => {
      renderCard(data);
      renderFilterElements(data);
      handlers(data);
   })
   .catch((error) => {
      console.log(error);
   });
// *** Get info about heroes from .json file

// Render a FILTER elements
const renderFilterElements = (data) => {
   // GENDER Make an elements for the filter
   heroGenderFilter.innerHTML = `
      <div class="hero__filter-title">
         <h3 class="hero__filter-text">Filter by gender</h3>
         <button type="button" class="hero__gender-filter-btn hero__filter-btn">reset</button>
      </div>
      <div class="hero__filter-items">
         <div class="hero__gender-item hero__filter-item">Male</div>
         <div class="hero__gender-item hero__filter-item">Female</div>
      </div>
   `;
   // *** GENDER Make an elements for the filter

   // STATUS Make an elements for the filter
   heroStatusFilter.innerHTML = `
      <div class="hero__filter-title">
         <h3 class="hero__filter-text">Filter by status</h3>
         <button type="button" class="hero__status-filter-btn hero__filter-btn">reset</button>
      </div>
      <div class="hero__filter-items">
         <div class="hero__status-item hero__filter-item">Alive</div>
         <div class="hero__status-item hero__filter-item">Deceased</div>
      </div>
   `;
   // *** STATUS Make an elements for the filter

   // MOVIE Make an elements for the filter
   heroMovieFilter.innerHTML = `
      <div class="hero__filter-title">
         <h3 class="hero__filter-text">Filter by movie</h3>
         <button type="button" class="hero__movie-filter-btn hero__filter-btn">reset</button>
      </div>
      <div class="hero__movie-filter-items hero__filter-items" id="heroMovieFilterItems"></div>
   `;
   const heroMovieFilterItems = document.getElementById('heroMovieFilterItems');

   data.forEach(hero => { // Get the list of movies from .json file
      if (hero.movies) {
         for (let movie of hero.movies) {
            movies.push(movie);
         }
      }
   });
   movies = [... new Set(movies)]; // Unite a repeated movies

   movies.forEach(movie => {
      const heroMovieItem = document.createElement('div');
      heroMovieItem.classList.add('hero__movie-item');
      heroMovieItem.classList.add('hero__filter-item');
      heroMovieItem.innerText = movie;
      heroMovieFilterItems.appendChild(heroMovieItem);
   });
   // *** MOVIE Make an elements for the filter
}
// *** Render a FILTER elements

// Render a HERO CARD
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
         <div class="hero__real-name">${elem['realName'] ? elem['realName'] : 'unknown'}</div>
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
// *** Render HERO CARD

// Render a HERO CARD BIG with additional info about a hero
const renderCardBig = (data, index) => {
   const movies = data[index]['movies'];
   let strMovies = '';

   if (movies) {
      movies.forEach(movie => {
          strMovies += '<span class="movie">' + movie + '</span>';
      });
   } else {
      strMovies += 'no movies'
   }

   heroPopup.innerHTML = `
      <div class="hero__card-big">
         <div class="arrow arrow-left" id="arrowLeft"></div>
         <div class="arrow arrow-right" id="arrowRight"></div>
         <div class="hero__photo-big"><img src="db_heroes/${data[index]['photo']}" alt="" /></div>
         <div class="hero__info">
            <div class="hero__popup-close-btn"><img src="img/close.svg" alt="" /></div>
            <div class="hero__big-name">${data[index]['name']}</div>
            <div class="hero__big-realname"></span>${data[index]['realName'] ? data[index]['realName'] : ''}</div>
            <div class="hero__big-actors"><span>actor: </span>${data[index]['actors']}</div>
            <div class="hero__big-species">${data[index]['species']}</div>
            <div class="hero__big-status">${data[index]['birthDay'] ? data[index]['birthDay'] : 'unknown'} - ${data[index]['deathDay'] ? data[index]['deathDay'] : 'unknown'}</div>
            <div class="hero__big-citizenship">${data[index]['citizenship'] ? data[index]['citizenship'] : 'unknown'}</div>
            <div class="hero__big-movies">${strMovies}</div>
         </div>
      </div>
   `;
}
// *** Render HERO CARD BIG with additional info about a hero

// HANDLER for filters block
const handlers = (data) => {
   heroFilterBtn.addEventListener('click', () => {
   heroAllFilters.classList.toggle('show');
   
   // HANDLER for filters block
   let selected = [0, 0, 0], // Arrya of selected filters
       heroFiltered = [], // Filtered heroes
       buff = []; // Buffer
   const heroGenderItemAll = document.querySelectorAll('.hero__gender-item'),
         heroStatusItemAll = document.querySelectorAll('.hero__status-item'),
         heroMovieItemAll = document.querySelectorAll('.hero__movie-item');

   heroAllFilters.addEventListener('click', (event) => {
      let target = event.target;
      heroFiltered = data;

      // HANDLERS
      // Handler by GENDER
      if (target.matches('.hero__gender-item')) {
         removeSelection(heroGenderItemAll);
         target.classList.toggle('hold');
         selected[0] = target.innerText;
      }

      if (target.matches('.hero__gender-filter-btn')) {
         selected[0] = 0;
         removeSelection(heroGenderItemAll);
      }
      // *** Handler by GENDER

      // Handler by STATUS
      if (target.matches('.hero__status-item')) {
         removeSelection(heroStatusItemAll);
         target.classList.toggle('hold');
         selected[1] = target.innerText;
      }

      if (target.matches('.hero__status-filter-btn')) {
         selected[1] = 0;
         removeSelection(heroStatusItemAll);
      }
      // *** Handler by STATUS

      // Handler by MOVIE
      if (target.matches('.hero__movie-item')) {
         removeSelection(heroMovieItemAll);
         target.classList.toggle('hold');
         selected[2] = target.innerText;
      }

      if (target.matches('.hero__movie-filter-btn')) {
         selected[2] = 0;
         removeSelection(heroMovieItemAll);
      }
      // *** Handler by MOVIE
      // *** HANDLERS


      // FILTERS
      // Filter by GENDER
      if (selected[0] === 'Male') {
         heroFiltered.forEach(hero => {
            if (hero.gender) {
               if (hero.gender.toLowerCase() === 'male') {
                  buff.push(hero);
               }
            }
         });

         heroFiltered = buff;
         buff = [];
      }

      if (selected[0] === 'Female') {
         heroFiltered.forEach(hero => {
            if (hero.gender) {
               if (hero.gender.toLowerCase() === 'female') {
                  buff.push(hero);
               }
            }
         });

         heroFiltered = buff;
         buff = [];
      }
      // *** Filter by GENDER

      // Filter by STATUS
      if (selected[1] === 'Deceased') {
         heroFiltered.forEach(hero => {
            if (hero.status) {
               if (hero.status.toLowerCase() === 'deceased') {
                  buff.push(hero);
               }
            }
         });

         heroFiltered = buff;
         buff = [];
      }

      if (selected[1] === 'Alive') {
         heroFiltered.forEach(hero => {
            if (hero.status) {
               if (hero.status.toLowerCase() === 'alive') {
                  buff.push(hero);
               }
            }
         });

         heroFiltered = buff;
         buff = [];
      }
      // *** Filter by STATUS

      // Filter by MOVIE
      heroFiltered.forEach(hero => {
         if (hero.movies) {
            for (let movie of hero.movies) {
               if (movie === selected[2]) {
                  buff.push(hero);
               }
            }
         }
      });

      if (buff.length != 0) {
         heroFiltered = buff;
      }
      buff = [];
      // *** Filter by MOVIE
      // *** FILTERS

      renderCard(heroFiltered);
   });
});
}
// *** HANDLER for filters block

// Remove selection from element
const removeSelection = (block) => {
   for (let item of block) {
      if (item.classList.contains('hold')) {
            item.classList.remove('hold');
      }
   }
}
// *** Remove selection from element


