'use strict'

const heroCards = document.querySelector('.hero__cards')

fetch('../db_heroes/dbheroes.json')
   .then((response) => {
      if (response.status !== 200) {
         throw new Error('status network not 200')
      }
      return response.json()
   })
   .then((data) => {
      renderCard(data);
   })
   .catch((error) => {
      console.log(error)
   })

const renderCard = (data) => {
   data.forEach(elem => {
      const heroCard = document.createElement('div')
      heroCard.classList.add('hero__card')
      heroCard.innerHTML = `
         <div class="hero__photo"><img src="db_heroes/${elem['photo']}" alt="" /></div>
         <div class="hero__name">${elem['name']}</div>
         <div class="hero__real-name">${elem['realname']}</div>  
      `
      heroCards.appendChild(heroCard)
   });
}


