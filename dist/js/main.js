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

    function closeModal() {
        modal.style.display = 'none';
    }
    body.addEventListener('click', (e) => {
        let target = e.target;
        clearInterval(timerID);
        if (target == dataModal[0] || target == dataModal[1]) {
            modal.style.display = 'block';

        }
        if (target == modalClose || target == modal || target.getAttribute('data-close') == '') {
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


    const getResources = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };
    getResources('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({
                img,
                altimg,
                title,
                descr,
                price
            }) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    //XMLHttpRequest
    const forms = document.querySelectorAll('form');
    const message = {
        loading: './img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };


    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    form.reset();
                    statusMessage.remove();
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();
                });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hidden');
        showModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add = ('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>x</div>
            <div class="modal__title">${message}</div>
        </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hidden');
            closeModal();
        }, 4000);
    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));

    //slider

    const slides = document.querySelectorAll('.offer__slide');
    const prev = document.querySelector('.offer__slider-prev');
    const next = document.querySelector('.offer__slider-next');
    const total = document.querySelector('#total');
    const current = document.querySelector('#current');
    const slidesWrapper = document.querySelector('.offer__slider-wrapper');
    const slidesField = document.querySelector('.offer__slider-inner');
    const width = window.getComputedStyle(slidesWrapper).width;
    const slider = document.querySelector('.offer__slider');

    let slideIndex = 1;
    let offSet = 0;
//первичные настройки нумерации слайдов
    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }


    slidesField.style.width = slides.length * 100 + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol');
    const dots = [];

    indicators.classList.add('carousel-indicators');

    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');

        if (i == 0) {
            dot.style.opacity = 1;
        }

        indicators.append(dot);
        dots.push(dot);
    }

    next.addEventListener('click', () => {
        if (offSet == +width.slice(0, width.length - 2) * (slides.length - 1)) {
            offSet = 0;
        } else {
            offSet += +width.slice(0, width.length - 2);
        }
        setSlidesFieldTransition();
        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }
        slidesLengthCheck();
        setDotStyle();
    });
    prev.addEventListener('click', () => {
        if (offSet == 0) {
            offSet = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offSet -= +width.slice(0, width.length - 2);
        }

        setSlidesFieldTransition();
        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }
        slidesLengthCheck();
        setDotStyle();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offSet = +width.slice(0, width.length - 2) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offSet}px)`;

            slidesLengthCheck();
            setDotStyle();

        });
    });

    const slidesLengthCheck = function () {
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    };

    const setDotStyle = function () {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    };

    const setSlidesFieldTransition = function () {  
        slidesField.style.transform = `translateX(-${offSet}px)`;
    };
});