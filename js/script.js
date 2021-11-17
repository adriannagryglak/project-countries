
//dark & ligth mode 
const modeChanger = document.querySelector('.mode-changer');
const modeChangerIcon = document.querySelector('.mode-changer icon');
const changingElements = document.querySelectorAll('.light');

modeChanger.addEventListener('click', function () {
    modeChangerIcon.classList.toggle('fa-moon');
    modeChangerIcon.classList.toggle('fa-sun');

    for (let element of changingElements) {
        element.classList.toggle('dark');
    }
});

//fetching countrie data

const btn = document.querySelector('button');
const input = document.querySelector('input');
const countries = document.querySelector('.countries')

btn.addEventListener('click', () => {
    
    while (countries.firstChild) {
        countries.removeChild(countries.lastChild);
    }
    getData();
});

async function getData() {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${input.value}`);
        const data = await response.json();
        for (let countrie of data) {
            let img = document.createElement('img');
            img.src = countrie.flags.png;
            countries.append(img);
            img.addEventListener('click', ()=>{
                showDetails(countrie);
                //pytanie- dlaczego wywołanie bez opakowania w f anonimową nie czeka na clicknięcie?
            });
        }
    } catch (e) {
        console.log(e);
    }
}

function showDetails(data){
    console.log(data.name.common);
    //create podgląd of countrie details
}