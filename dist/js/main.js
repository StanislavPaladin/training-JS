window.addEventListener('DOMContentLoaded', (e) => {
    //tabs
    const tabs = document.querySelectorAll('.tabcontent');
    const tabItem = document.querySelectorAll('.tabheader__item');
    const tabcontainer = document.querySelector('.tabcontainer');

    tabcontainer.addEventListener('click', (e) => {
        let target = e.target;
        if (target.matches('.tabheader__item')) {
            tabItem.forEach(item => {
                item.classList.remove('tabheader__item_active');
            });
            tabs.forEach(i => {
                i.classList.add('hidden');
            });
            target.classList.add('tabheader__item_active');
            for (let i = 0; i < 5; i++) {
                if (target == tabItem[i]) {
                    tabs[i].classList.remove('hidden');
                }
            }
        }
    });

    //modal windows
    const modal = document.querySelector('.modal');
    const modalClose = document.querySelector('.modal__close');
    const dataModal = document.querySelectorAll('[data-modal]');
    const body = document.querySelector('body');

    function showModal() {
        modal.style.display = 'block';
        clearInterval(timerID);

    }
    body.addEventListener('click', (e) => {
        let target = e.target;
        clearInterval(timerID);
        if (target == dataModal[0] || target == dataModal[1]) {
            modal.style.display = 'block';

        }
        if (target == modalClose || target == modal) {
            modal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', e => {
        if (e.code === 'Escape') {
            modal.style.display = 'none';
        }
    });
    const timerID = setTimeout(showModal, 300000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    //timer
    const deadLine = '2021-09-22';

    function getTimeRemaining(endTime) {
        const t = Date.parse(endTime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor(t / (1000 * 60 * 60) % 24),
            minutes = Math.floor(t / (1000 * 60) % 60),
            seconds = Math.floor(t / 1000 % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endTime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endTime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadLine);
    //cards

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelecotr) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.transfer = 27;
            this.price = price;
            this.parent = document.querySelector(parentSelecotr);
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
            <div class="menu__item">
            <img src="${this.src}" alt="${this.alt}">
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
            `;
            this.parent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        `Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!`,
        9,
        '.menu .container'

    ).render();
    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        `“Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.`,
        11,
        '.menu .container'

    ).render();
    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню "Элитное"',
        `В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!`,
        14,
        '.menu .container'

    ).render();
});