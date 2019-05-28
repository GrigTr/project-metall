"use strict";

document.addEventListener("DOMContentLoaded", function(event){
    event.stopPropagation(0);
    const pageInfo = (function(){
        window.windowInfo = {
            width:document.documentElement.clientWidth,
            currentScroll: window.pageYOffset || document.documentElement.scrollTop,
            tabletScreenMinWidth: 768,
            desktopMinWidth: 1024
        }

        const setScroll = function(){
            windowInfo.currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        };

        const setWidth = function(){
            windowInfo.width = document.documentElement.clientWidth;
        }
        
        window.addEventListener("scroll",setScroll);
        window.addEventListener("resize", setWidth);

    }());

    const showCurrentDate = (function(){
        const dateEl = document.getElementById("c-date");
        const monthEl = document.getElementById("c-month");
        const yearEl = document.getElementById("c-year");

        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        let currentDate = new Date();
        dateEl.innerText = currentDate.getDate();
        monthEl.innerText = months[currentDate.getMonth()];
        yearEl.innerText = currentDate.getFullYear();
    }());
    
    const isInViewport = function(element, padding){
        if(!padding) padding =0;
        let position = element.getBoundingClientRect();
        return (
            position.bottom >= 0 + padding && position.top <= (window.innerHeight || document.documentElement.clientHeight)
        )
    };
    const manupulateClass = function(element, className, status){
        switch(status){
            case 'remove': element.classList.remove(className);
            break;
            case 'add': element.classList.add(className);
            break;
            case 'toggle': element.classList.toggle(className);
            break;
        }
    };

    const changeBlock =(function(){
        const block = document.querySelector(".navigation");
        const targetScroll = 15;
        return function(screenWidth, scroll){
            if (screenWidth < windowInfo.desktopMinWidth) {
                return;
            }
            if(scroll > targetScroll) {
                manupulateClass(block, 'white', 'add');
            } else {
                manupulateClass(block, 'white','remove');
            }
        }
    }());

    window.addEventListener("scroll",function(){
        changeBlock(windowInfo.width, windowInfo.currentScroll);
    });
    window.addEventListener('resize', function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        changeBlock(windowInfo.width, windowInfo.currentScroll);
    });

  const AnimateElementOnLoad = function(element, dataAtr, padding){
      if(isInViewport(element, padding)){
          if (element.getAttribute(dataAtr)){
              element.src = element.getAttribute(dataAtr);
              element.removeAttribute(dataAtr);

              element.addEventListener('load', function(event){
                  event.preventDefault();
                  event.stopPropagation();

                  if(element.classList.contains('unvisible')) { 
                    manupulateClass(element, 'unvisible', 'remove');
                    manupulateClass(element, 'visible', 'add');
                  }
              });
          }
      }
  };

  const car = document.querySelector('.about-us__big-car');


  window.addEventListener('scroll', function(event){
      event.preventDefault();
      event.stopPropagation();
      AnimateElementOnLoad(car, 'data-src', 0);
  });


  const smoothScrollingToElement = (function(){
        const links = document.querySelectorAll('.link');
        const buttons = document.querySelectorAll('.button-to-form');
        
        const getPadding = function(selector){
            return document.querySelector(selector).offsetHeight;
        }
        const elmYPosition = function(eID) {
          let elm = document.getElementById(eID);
          let y = elm.offsetTop;
          let node = elm;
          while (node.offsetParent && node.offsetParent != document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
          }
          return y;
        };
    
        const smoothScroll = function(eID, selector) {
          let startY = self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
          let padding = 0;
          if (windowInfo.width >= windowInfo.desktopMinWidth) padding = getPadding(selector);
          let stopY = elmYPosition(eID) - padding;
          let distance = stopY > startY ? stopY - startY : startY - stopY;
          if (distance < 100) {
            scrollTo(0, stopY); return;
          }
          let speed = Math.round(distance / 100);
          if (speed >= 20) speed = 20;
          let step = Math.round(distance / 25);
          let leapY = stopY > startY ? startY + step : startY - step;
          let timer = 0;
          if (stopY > startY) {
            for ( let i=startY; i<stopY; i+=step ) {
              setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
              leapY += step;
              if (leapY > stopY) leapY = stopY;
              timer++;
            } return;
          }
          for ( let i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step;
            if (leapY < stopY) leapY = stopY;
            timer++;
          }
        };
    
        for (let i =0; i < links.length; i++) {
          links[i].addEventListener('click', function(event){
              event.preventDefault();
              event.stopPropagation();
              let id = "" + event.target.dataset.target;
              smoothScroll(id,".navigation__list");
           });
        }
        buttons.forEach((button)=>{
            button.addEventListener('click', function(event){
                event.preventDefault();
                event.stopPropagation();
                const id = "page-form";
                smoothScroll(id,".navigation__list");
            });
        })
    }());

    

    const postAjax = function(url) {
        let request,
            loader = document.querySelector('.form-loader'),
            h = document.querySelector('.forma__title'),
            form = document.querySelector('.page-form'),
            popUp = document.querySelector('.form-popup');

            const startPreloader = function(loaderClass){
                
                loader.classList.add(loaderClass);
                
                h.style.display = "none";
                form.style.display = "none";
               
            }

            const showError = function(){
               
                if (loader.classList.contains("open")){
                    loader.classList.remove("open");
                }
                popUp.children[2].textContent = 'Ошибка! Повторите отправку данных';
                popUp.classList.add('open');

                setTimeout(function(){
                    h.style.display = "block";
                    form.style.display = "flex";
                    popUp.classList.remove('open');
                }, 1500);
                
            }

            const showCompleate = function(){
                h.style.display = "none";
                popUp.classList.add('open');
                popUp.classList.add('sucsess');
                popUp.children[2].textContent = 'Спасибо за заявку';
                
            }

        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
            request = new XMLHttpRequest();
            if (request.overrideMimeType) {
                request.overrideMimeType('text/xml');
            }
        } else if (window.ActiveXObject) { // IE
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }

        request.addEventListener("readystatechange",function(event){
            event.stopPropagation();
            if (request.readyState == "4") {
                if (request.status == 200) {
                    if (loader.classList.contains("open")){
                        loader.classList.remove("open");
                    }
                    console.log("УСпешно");
                    showCompleate();
                } else {
                    showError();
                }
            } else if (request.readyState == "1"){
                startPreloader('open');
            }
        });

        request.open('POST', url, true);
        request.setRequestHeader('accept', 'application/json'); //accept
        let formData = new FormData(form);
	    request.send(formData);
    };

    const isInputsValidate = function(){
        let result = false;
        const inputs = document.querySelectorAll('.form__input');
        inputs.forEach((input)=>{
            if(input.value != ""){
                result = true;
            } 
            if (input.name == "contacts"){
                const regMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                const regTel = /^((\+7|7|8)+([0-9]){10})$/gm;
                if (regMail.test(input.value) || regTel.test(input.value)){
                    result = true;
                } else {
                    result = false;
                }
            }
        });
        return result;
    }

    let form = document.querySelector(".page-form");
    let checkBox = document.querySelector('input[name="license"]');
    form.addEventListener("submit", function(event){
        event.preventDefault();
        event.stopPropagation();

        if(isInputsValidate() && checkBox.checked){
            postAjax('send.php');
        }
    });
});