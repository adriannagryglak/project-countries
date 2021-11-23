let lightModeOn = true;
const input = document.querySelector('input');
const countriesSection = document.querySelector('.countries');
const home = document.querySelector('.home');

lightDarkMode();
dataFetching();

function dataFetching(){
    const btn = document.querySelector('button');
    btn.addEventListener('click', () => {
        while (countriesSection.firstChild) {
            countriesSection.removeChild(countriesSection.lastChild);
        }
        getData();
    });
    
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
        this.createElement();
    }
    createElement() {
        const div = document.createElement('div');
        const img = document.createElement('img');
        img.src = this.data.flags.png;
        const title = document.createElement('p');
        title.innerText = this.data.name.common;
        adjusToMode(title, 'title');
        const details = document.createElement('p');
        details.innerText = 'click for details'
        adjusToMode(details, 'details');
        div.append(img, title, details);

        div.addEventListener('click', () => {
            const imgCopy = img.cloneNode();
            this.showModal(imgCopy);
            countriesSection.style.pointerEvents = "none";
        });
        countriesSection.append(div);
    }
    showModal(flag) {
        const modal = document.createElement('div');
        adjusToMode(modal, 'modal');
        document.querySelector('body').append(modal);
        const details = document.createElement('ul');
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-times');
        modal.append(flag, details, icon);
        const arr = ['currencies', 'prefix', 'region', 'subregion', 'language', 'borders', 'population'];

        for (let info of arr) {
            const li = document.createElement('li');
            if (info in this.data && typeof this.data[info] === 'object') {
                for (let currencie in this.data[info]) {
                    li.innerText = `currency : ${this.data[info][currencie].name}`;
                }
            } else if (info in this.data) {
                li.innerText = `${info} : ${(this.data[info])}`;
            }
            details.append(li);
        }

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
        }else{icon.style.opacity= "1"};

    
        icon.addEventListener('click', () => {
            modal.remove();
            countriesSection.style.pointerEvents = "all";
        });

    }
}

function adjusToMode(el, className){
    if (lightModeOn) {
        el.classList.add(className, 'light');
    } else {
        el.classList.add(className, 'light', 'dark');
    }
}

function lightDarkMode() {
    const modeChanger = document.querySelector('.mode-changer');
    const modeChangerIcon = document.querySelector('.mode-changer icon');

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
