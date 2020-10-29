'use strict'

const heroCards = document.querySelector('.hero__cards'),
      heroPopup = document.getElementById('heroPopup'),
      heroFilterBtn = document.getElementById('heroFilterBtn'),
      heroMoviesFilter = document.getElementById('heroMoviesFilter'),
      heroAllFilters = document.getElementById('heroAllFilters'),
      heroGenderFilter = document.getElementById('heroGenderFilter'),
      heroStatusFilter = document.getElementById('heroStatusFilter'),
      heroSpeciesFilter = document.getElementById('heroSpeciesFilter');
let movies = [],
    species = [];

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

      // Open all filters
      heroFilterBtn.addEventListener('click', () => {
         heroAllFilters.classList.toggle('show');

         heroMoviesFilter.innerHTML = '';
         heroGenderFilter.innerHTML = '';
         heroStatusFilter.innerHTML = '';
         heroSpeciesFilter.innerHTML = '';
         movies = [];

         // Make the <select> element for a list of movies
         const moviesItems = document.createElement('select');
         moviesItems.classList.add('hero__movie-items');
         heroMoviesFilter.appendChild(moviesItems);

         // Get the list of movies from .json file
         data.forEach(hero => {
            if (hero.movies) {
               for (let movie of hero.movies) {
                  movies = movies.concat(movie); // Unite repeated movies
               }
            }
         });

         // Make an elements (movies) for the <select> element
         movies.forEach((movie, index) => {
            const moviesItem = document.createElement('option');

            if (index === 0) {
               moviesItem.classList.add('hero__movie-item');
               moviesItem.value = '';
               moviesItem.innerText = `Choose a movie ...`;
               moviesItems.appendChild(moviesItem);
            } else {
               moviesItem.classList.add('hero__movie-item');
               moviesItem.value = movie;
               moviesItem.innerText = movie;
               moviesItems.appendChild(moviesItem);
            }
         });

         // Make an elements for the gender selection
         heroGenderFilter.innerHTML = `
            <select class="hero__gender-items">
               <option class="hero__gender-item" value="">Choose a gender</option>
               <option class="hero__gender-item" value="male">male</option>
               <option class="hero__gender-item" value="female">female</option>
            </select>
         `;

         // Make an elements for the status selection
         heroStatusFilter.innerHTML = `
            <select class="hero__status-items">
               <option class="hero__status-item" value="">Choose a status</option>
               <option class="hero__status-item" value="deceased">deceased</option>
               <option class="hero__status-item" value="alive">alive</option>
            </select>
         `;


         // Make an elements for the species selection
         data.forEach(hero => {
            if (hero.species) {
               species.push(hero.species);
            }
         });

         species = [... new Set(species)]; // Unite the same values
         const heroSpeciesItems = document.createElement('select'); // Make <select> element
         heroSpeciesItems.classList.add('hero__species-items');
         heroSpeciesFilter.appendChild(heroSpeciesItems);

         // Add an <option> elements to <select>
         const heroSpeciesItem = document.createElement('option');
         heroSpeciesItem.classList.add('hero__species-item');
         heroSpeciesItem.value = '';
         heroSpeciesItem.innerText = 'Choose a species';
         heroSpeciesItems.insertBefore(heroSpeciesItem, heroSpeciesItems.firstChild);

         species.forEach((elem, index) => {
            const heroSpeciesItem = document.createElement('option');
            heroSpeciesItem.classList.add('hero__species-item');
            heroSpeciesItem.value = elem;
            heroSpeciesItem.innerText = elem;
            heroSpeciesItems.appendChild(heroSpeciesItem);
         });

         
         // Filter's handler
         let selected = [0, 0, 0, 0, 0], // Arrya of selected filters
             heroFiltered = [],
             buff = [];

         heroAllFilters.addEventListener('change', (event) => {
            let target = event.target;
            heroFiltered = [];

            if (target.matches('.hero__movie-items')) {
               if (target.value === '') {
                  selected[0] = 0;
               } else {
                  selected[0] = target.value;
               }
            }

            if (target.matches('.hero__gender-items')) {
               if (target.value === '') {
                  selected[1] = 0;
               } else {
                  selected[1] = target.value;
               }
            }

            if (target.matches('.hero__status-items')) {
               if (target.value === '') {
                  selected[2] = 0;
               } else {
                  selected[2] = target.value;
               }
            }

            if (target.matches('.hero__species-items')) {
               if (target.value === '') {
                  selected[3] = 0;
               } else {
                  selected[3] = target.value;
               }
            }

            // Filter by movie
            if (selected[0] === 0) {
               heroFiltered = data;
            } else {
               data.forEach(hero => {
                  if (hero.movies) {
                     for (let movie of hero.movies) {
                        if (movie === selected[0]) {
                           heroFiltered.push(hero);
                        }
                     }
                  }
               });
            }

            // Filter by gender
            if (selected[1] === 'male') {
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

            if (selected[1] === 'female') {
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

            // Filter by status
            if (selected[2] === 'deceased') {
               heroFiltered.forEach(hero => {
                  if (hero.status) {
                     if (hero.status === 'deceased') {
                        buff.push(hero);
                     }
                  }
               });

               heroFiltered = buff;
               buff = [];
            }

            if (selected[2] === 'alive') {
               heroFiltered.forEach(hero => {
                  if (hero.status) {
                     if (hero.status === 'alive') {
                        buff.push(hero);
                     }
                  }
               });

               heroFiltered = buff;
               buff = [];
            }

            // Filter by species
            // heroFiltered.forEach(hero => {
            //    if (hero.species) {
            //       if (hero.species === selected[3]) {
            //          buff.push(hero);
            //       }
            //    }
            // });

            // if (buff.length !== 0) {
            //    heroFiltered = buff;
            //    buff = [];
            // }

            renderCard(heroFiltered);
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


