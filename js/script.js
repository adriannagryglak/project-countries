//global vars
let lightModeOn = true;
const input = document.querySelector('input');
const countriesSection = document.querySelector('.countries');
const home = document.querySelector('.home');

lightDarkMode();
dataFetching();

function dataFetching() {
    const btn = document.querySelector('button');
    btn.addEventListener('click', () => {
        //removing previous finds
        while (countriesSection.firstChild) {
            countriesSection.removeChild(countriesSection.lastChild);
        }
        getData();
    });
    //searching by clicking Enter
    input.addEventListener("keyup", (e) => {
        if (e.code === 'Enter') {
            btn.click();
        }
    });
}

async function getData() {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${input.value}`);
        const data = await response.json();
        for (let countrie of data) {
            new Countrie(countrie);
        }
    } catch (e) {
        console.log(e);
    }
}

class Countrie {
    constructor(data) {
        this.data = data;
        this.showResaults();
    }
    showResaults() {
        const div = document.createElement('div');
        const img = document.createElement('img');
        img.src = this.data.flags.png;
        const title = document.createElement('p');
        title.innerText = this.data.name.common;
        adjustToMode(title, 'title');
        const details = document.createElement('p');
        details.innerText = 'click for details'
        adjustToMode(details, 'details');
        div.append(img, title, details);
        countriesSection.append(div);

        //create modal after click
        div.addEventListener('click', () => {
            const imgCopy = img.cloneNode();
            this.createModal(imgCopy);
            countriesSection.style.pointerEvents = "none";
        });
    }
    createModal(flag) {
        const modal = document.createElement('div');
        adjustToMode(modal, 'modal');
        document.querySelector('body').append(modal);
        const details = document.createElement('ul');
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-times');
        modal.append(flag, details, icon);
        
        //show resaults for this data in modal
        const arr = ['currencies', 'prefix', 'region', 'subregion', 'language', 'borders', 'population'];
        for (let info of arr) {
            const li = document.createElement('li');

            if (info in this.data && typeof this.data[info] === 'object') {
  
                for (let object in this.data[info]) {
                    if (this.data[info][object].name) {
                        //works for nested values like names 
                        li.innerText = `${info} : ${this.data[info][object].name}`;
                    }else{
                        //works for multiple values e.g. in array
                        li.innerText = `${info} : ${this.data[info]}`;
                    }
                }
            } else if (info in this.data) {
                li.innerText = `${info} : ${this.data[info]}`;
            }
            details.append(li);
        }
        //before them insert country name
        const title = document.createElement('li');
        title.innerText = `${this.data.name.common}`;
        details.insertAdjacentElement('afterbegin', title)

        //media-query for modal removing
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        if (mediaQuery.matches) {
            modal.addEventListener('mousemove', () => {
                icon.style.opacity = "1";
            });
            modal.addEventListener('mouseleave', () => {
                icon.style.opacity = "0";
            });
        } else { icon.style.opacity = "1" };

        icon.addEventListener('click', () => {
            modal.remove();
            countriesSection.style.pointerEvents = "all";
        });

    }
}

//adjusting elements created dynamically to chosen mode
function adjustToMode(el, className) {
    if (lightModeOn) {
        el.classList.add(className, 'light');
    } else {
        el.classList.add(className, 'light', 'dark');
    }
}

//finding elements that are sensitive to mode change, handling mode button.  
function lightDarkMode() {
    const modeChanger = document.querySelector('.mode-changer');
    const modeChangerIcon = document.querySelector('.mode-changer i');

    modeChanger.addEventListener('click', function () {
        const changingElements = document.querySelectorAll('.light');
        modeChangerIcon.classList.toggle('fa-moon');
        modeChangerIcon.classList.toggle('fa-sun');
        lightModeOn = !lightModeOn;
        for (let element of changingElements) {
            element.classList.toggle('dark');
        }
    });
}
