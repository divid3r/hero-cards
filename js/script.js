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
      const heroCard = document.createElement('div');
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
         renderCardBig(data, heroCard);
      });
      heroCards.appendChild(heroCard);
   });
}

const renderCardBig = (data, heroCard) => {
   heroPopup.innerHTML = `
      <div class="hero__card-big">
         <div class="hero__popup-close-btn"><img src="img/close.svg" alt="" /></div>
         <div class="arrow arrow-left"></div>
         <div class="arrow arrow-right"></div>
         <div class="hero__photo-big"><img src="db_heroes/${data[heroCard.id]['photo']}" alt="" /></div>
         <div class="hero__info">
            <div class="hero__big-name">${data[heroCard.id]['name']}<div>
            <div class="hero__big-realname">${data[heroCard.id]['realName']}<div>
            <div class="hero__big-species">${data[heroCard.id]['species']}<div>
            <div class="hero__big-actors">${data[heroCard.id]['actors']}<div>
            <div class="hero__big-status">${data[heroCard.id]['status']} (${data[heroCard.id]['birthDay']} - ${data[heroCard.id]['deathDay']}<div>
            <div class="hero__big-citizenship">${data[heroCard.id]['citizenship']}<div>
            <div class="hero__big-movies">${data[heroCard.id]['movies']}<div>
         </div>
      </div>
   `;
   heroPopup.addEventListener('click', (event) => {
      let target = event.target;

      if (target.closest('.hero__popup-close-btn') || !target.closest('.hero__card-big')) {
         heroPopup.style.display = 'none';
      }
   });
}


