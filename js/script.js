'use strict'

const heroCards = document.querySelector('.hero__cards'),
      heroPopup = document.getElementById('heroPopup');

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
   })
   .catch((error) => {
      console.log(error);
   });

// render hero card
const renderCard = (data) => {
   let i = 0;

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
               } else index--;

               renderCardBig(data, index);
            }

            // #arrowRight move slider to the right
            if (target.closest('#arrowRight')) {
               if (index === data.length - 1) {
                  index = data.length - 1;
               } else index++;

               renderCardBig(data, index);
            }
         });
      });

      heroCards.appendChild(heroCard);
   });
}

// render modal window with additional info of hero
const renderCardBig = (data, index) => {
   heroPopup.innerHTML = `
      <div class="hero__card-big">
         <div class="hero__popup-close-btn"><img src="img/close.svg" alt="" /></div>
         <div class="arrow arrow-left" id="arrowLeft"></div>
         <div class="arrow arrow-right" id="arrowRight"></div>
         <div class="hero__photo-big"><img src="db_heroes/${data[index]['photo']}" alt="" /></div>
         <div class="hero__info">
            <div class="hero__big-name">${data[index]['name']}<div>
            <div class="hero__big-realname">${data[index]['realName']}<div>
            <div class="hero__big-species">${data[index]['species']}<div>
            <div class="hero__big-actors">${data[index]['actors']}<div>
            <div class="hero__big-status">(${data[index]['birthDay']} - ${data[index]['deathDay']})<div>
            <div class="hero__big-citizenship">${data[index]['citizenship']}<div>
            <div class="hero__big-movies">${data[index]['movies']}<div>
         </div>
      </div>
   `;
}


