let lightModeOn = true;
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
lightDarkMode();

//fetching countrie data
const btn = document.querySelector('button');
const input = document.querySelector('input');
const countries = document.querySelector('.countries');
const section = document.querySelector('.countries');
const body = document.querySelector('body');

btn.addEventListener('click', () => {
    while (countries.firstChild) {
        countries.removeChild(countries.lastChild);
    }
    getData();
});

input.addEventListener("keyup", (e)=>{
  if (e.code === 'Enter') {
   btn.click();
  }
});

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

        if(lightModeOn){
            title.classList.add('title', 'light');
        }else{
            title.classList.add('title', 'light', 'dark');
        }

        title.innerText = this.data.name.common;
        div.append(img, title);
        div.addEventListener('click', () => {
            const imgCopy = img.cloneNode();
            this.showModal(imgCopy);
            countries.style.pointerEvents = "none";
        });
        section.append(div);
    }
    showModal(flag) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        body.append(modal);
        const details = document.createElement('ul');
        const icon = document.createElement('i');
        icon.classList.add('fas','fa-times');
        modal.append(details, flag, icon);
        const arr = ['currencies', 'prefix', 'region', 'subregion', 'language', 'borders', 'population'];
        for (let info of arr) {
            const li = document.createElement('li');
            if (info in this.data && typeof this.data[info] === 'object') {
                for (let currencie in this.data[info]){
                    li.innerText = `currency : ${this.data[info][currencie].name}`;
                }    
            } else if (info in this.data) {
                li.innerText = `${info} : ${(this.data[info])}`;
            }
            details.append(li);
        }
        modal.addEventListener('mousemove', ()=>{
            icon.style.opacity = "1";
        });
        modal.addEventListener('mouseleave', ()=>{
            icon.style.opacity = "0";
        });

        icon.addEventListener('click',()=>{
            modal.remove();
            countries.style.pointerEvents = "all";
        });
    }
}


