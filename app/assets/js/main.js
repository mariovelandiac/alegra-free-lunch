/**
* Template Name: Yummy
* Updated: Mar 10 2023 with Bootstrap v5.2.3
* Template URL: https://bootstrapmade.com/yummy-bootstrap-restaurant-website-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

const API = "https://1dobvidpv4.execute-api.sa-east-1.amazonaws.com/alegra-test/api";
document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Sticky header on scroll
   */
  const selectHeader = document.querySelector('#header');
  if (selectHeader) {
    document.addEventListener('scroll', () => {
      window.scrollY > 100 ? selectHeader.classList.add('sticked') : selectHeader.classList.remove('sticked');
    });
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = document.querySelectorAll('#navbar a');

  function navbarlinksActive() {
    navbarlinks.forEach(navbarlink => {

      if (!navbarlink.hash) return;

      let section = document.querySelector(navbarlink.hash);
      if (!section) return;

      let position = window.scrollY + 200;

      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navbarlinksActive);
  document.addEventListener('scroll', navbarlinksActive);

  /**
   * Mobile nav toggle
   */
  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');

  document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
    el.addEventListener('click', function(event) {
      event.preventDefault();
      mobileNavToogle();
    })
  });

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavShow.classList.toggle('d-none');
    mobileNavHide.classList.toggle('d-none');
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navbar a').forEach(navbarlink => {

    if (!navbarlink.hash) return;

    let section = document.querySelector(navbarlink.hash);
    if (!section) return;

    navbarlink.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach(el => {
    el.addEventListener('click', function(event) {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('dropdown-active');

        let dropDownIndicator = this.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    })
  });

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    scrollTop.addEventListener('click', window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }));
  }

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate pURE cOUNTER
   */
  new PureCounter();

  /**
   * Init swiper slider with 1 slide at once in desktop view
   */
  new Swiper('.slides-1', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  /**
   * Init swiper slider with 3 slides at once in desktop view
   */
  new Swiper('.slides-3', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 40
      },

      1200: {
        slidesPerView: 3,
      }
    }
  });

  /**
   * Gallery Slider
   */
  new Swiper('.gallery-slider', {
    speed: 400,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      640: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      992: {
        slidesPerView: 5,
        spaceBetween: 20
      }
    }
  });


  const infoDishQueue = document.querySelector("#dish-queue-ul");
  setInterval(() => {
    fetch(`${API}/kitchen/dish-queue`)
    .then(res => res.json())
    .then(data => {
      let viewDishQueue = [];
      data.body.forEach(item => {
        viewDishQueue.push(`<li>${item.name}</li>`);
      });
      infoDishQueue.innerHTML = viewDishQueue.join('');
    }).catch(e => console.error(e))
  }, 100);

  const infoStock = document.querySelector("#stock-ul");
  setInterval(() => {
    fetch(`${API}/warehouse/stock`)
    .then(res => res.json())
    .then(data => {
      let ingredient = Object.keys(data.body.stock);
      let value = Object.values(data.body.stock);
      let viewStock = [];
      ingredient.forEach((item, iterator) => {
        viewStock.push(`<li>Cantidad Disponible de ${item}: ${value[iterator]}</li>`);
      });
      infoStock.innerHTML = viewStock.join('');
    }).catch(e => console.error(e))
  }, 5000);

  const requestDish = document.querySelector("#make-dish");
  const info = document.querySelector("#new-dish")
  requestDish.addEventListener('click', () => {
    fetch(`${API}/kitchen/make-dish`)
    .then(res => res.json())
    .then(data => {
      info.textContent = data.body.dish
    }).catch(e => console.error(e))
  });

  const requestDishHistory = document.querySelector("#dish-history-button");
  const dishHistory = document.querySelector("#dish-history-ul");
  requestDishHistory.addEventListener('click', () => {
    fetch(`${API}/kitchen/dish-history`)
    .then(res => res.json())
    .then(data => {
      let viewDishHistory = [];
        data.body.forEach((item) => {
          let ingredientArray = [];
          let ingredient = Object.entries(item.ingredients);
          ingredient.forEach((element) => {
            ingredientArray.push(`<li>${element[0]}: ${element[1]}</li>`)
          })
          viewDishHistory.push(`<ul>
          <b>Nombre: ${item.name}</b>
          <li>Id: ${item.id}</li>
          <ul>Ingredientes: ${ingredientArray.join('')}</ul>
          <li>Entregado: ${item.delivered}</li>
          </ul>`);
        });
        dishHistory.innerHTML = viewDishHistory.join('');
      }).catch(e => console.error(e))
    });

  const requestOrderHistory = document.querySelector("#orders-history-button");
  const orderHistory = document.querySelector("#orders-history-ul");
  requestOrderHistory.addEventListener('click', () => {
    fetch(`${API}/warehouse/orders-history`)
    .then(res => res.json())
    .then(data => {
      let viewOrderHistory = [];
        data.body.forEach((item) => {
          viewOrderHistory.push(`<ul>
          <b>Nombre: ${item.name}</b>
          <li>Id de la compra: ${item.id}</li>
          <li>Cantidad Vendida: ${item.quantitySold}</li>
          <li>Compra exitosa: ${item.purchased}</li>
          </ul>`);
        });
        orderHistory.innerHTML = viewOrderHistory.join('');
      }).catch(e => console.error(e))
    });


  const menu = document.querySelector("#menu-ul");
  fetch(`${API}/kitchen/menu`)
  .then(res => res.json())
  .then(data => {
    let viewMenu = [];
      data.body.forEach((item) => {
        let menuArray = [];
        let menu = Object.entries(item.ingredients);
        menu.forEach((element) => {
          menuArray.push(`<li>${element[0]}: ${element[1]}</li>`)
        })
        viewMenu.push(`<ul>
        <b>Nombre: ${item.name}</b>
        <ul>Ingredientes: ${menuArray.join('')}</ul>
        </ul>`);
      });
      menu.innerHTML = viewMenu.join('');
    }).catch(e => console.error(e))


  /**
   * Animation on scroll function and init
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

  window.addEventListener('load', () => {
    aos_init();
  });



});






