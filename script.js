document.addEventListener('DOMContentLoaded', () => {

    let products;
    let cart = [];
    let cartWrapper = document.getElementById('cart-wrapper').addEventListener('click', () => showCart());
    let closeCartBtn = document.getElementById('close-cart-btn').addEventListener('click', () => closeCart());

    // submit form notification
    let contactSubmit = document.querySelector('.contact-form .send-form-btn');
    let successMessage = document.querySelector('.contact-form .alert-success');
    let formCloseBtn = document.querySelector('.contact-form .btn-close');
    
    contactSubmit.addEventListener('click', () => {
        successMessage.classList.add('visible'); 
    })

    formCloseBtn.addEventListener('click', () => {
        successMessage.classList.remove('visible');
        document.getElementById('contact-form').reset();
    })

    function loadCartFromSessionStorage() {
        counter = document.querySelector('#cart-items-counter');
        let storageData = sessionStorage.getItem('cart');
        if (storageData != null && storageData != '') {
            let parsedData = JSON.parse(storageData);
            parsedData.forEach(obj => {
                cart.push(obj);
            });
        }
        counter.innerText = cart.length;
        renderCart();
    }

    function addToCart(obj) {
        cart.push(obj);
        counter.innerText = cart.length;
        sessionStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    function removeFromCart(obj){
        cart.splice(cart.indexOf(obj), 1);
        counter.innerText = cart.length;
        sessionStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    function renderCart() {
        cartContent = document.getElementById('load-cart-here');
        cartContent.replaceChildren();
        cartTotal = document.getElementById('cart-total');
        let priceSum = 0;
        cart.forEach(el => {
            cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            title = document.createElement('span');
            title.innerText = el.title;
            price = document.createElement('span');
            if (el.discountPercentage) {
                newPrice = (el.price - (el.discountPercentage / 100) * el.price).toFixed(2);
                price.innerText = `$ ${newPrice}`;
                priceSum += parseFloat(newPrice);
            } else {
                priceSum += parseFloat(el.price);
                price.innerText = `$ ${el.price}`;
            }
            
            let removeItemBtn = document.createElement('div');
            removeItemBtn.classList.add('remove-cart-item-btn');
            removeItemBtn.innerText= 'x';
            removeItemBtn.addEventListener('click', () => {
                removeFromCart(el);
            })

            cartItem.appendChild(title);
            price.appendChild(removeItemBtn);
            cartItem.appendChild(price);
            cartContent.appendChild(cartItem);
        });
        cartTotal.innerText= `$ ${priceSum.toFixed(2)}`;
    }

    function showCart() {
        let cartContent = document.getElementsByClassName('cart-content')[0];
        cartContent.classList.toggle('active');
    }
    
    function closeCart() {
        console.log("closing cart")
        let cartContent = document.getElementsByClassName('cart-content')[0];
        cartContent.classList.remove('active');        
    }

    async function getData() {
        await fetch('https://dummyjson.com/products')
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong');
            })
            .then(data => products = data.products)
            .catch((error) => {
                console.log(error)
            });
    }

    function fillTable() {
        let table = document.getElementById('items-table');

        for (let i = 0; i < 3; i++) {
            const prod = products[i];
            let tr = document.createElement('tr');
            let title = document.createElement('td');
            title.innerText = prod.title;
            let desc = document.createElement('td');
            desc.innerText = prod.description;
            let price = document.createElement('td');
            if (prod.discountPercentage) {
                let newPrice = (prod.price - (prod.discountPercentage / 100) * prod.price).toFixed(2);
                price.innerText = "$" + newPrice + ',00';
            } else {
                price.innerText = "$" + prod.price + ',00';
            }
            tr.appendChild(title);
            tr.appendChild(desc);
            tr.appendChild(price);
            table.appendChild(tr);
        }

        console.log(products);
    }

    function fillCarousel() {
        let carousel = document.getElementById('carousel-items');
        let carouselItem;

        for (let i = 0; i < 3; i++) {
            // get product
            const prod = products[i];

            // create carousel item
            carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');

            // create background text
            bgTextWrapper = document.createElement('div');
            bgTextWrapper.classList.add('carousel-bg-text-wrapper');
            bgText = document.createElement('p');
            bgText.classList.add('carousel-bg-text');
            bgText.innerText = prod.brand;
            bgTextWrapper.appendChild(bgText);
            carouselItem.appendChild(bgTextWrapper);

            // create container for the slider content
            let container = document.createElement('div');
            container.classList.add('container-fluid', 'container-lg', 'w-100', 'h-100', 'position-relative');

            // create slide content wrapper
            contentWrapper = document.createElement('div');
            contentWrapper.classList.add('slide-content-wrapper');

            // set first carousel item as active
            if (i == 0) {
                carouselItem.classList.add('active');
            }

            // create product details container
            let productDetails = document.createElement('div');
            productDetails.classList.add('product-details');

            // set product title
            let title = document.createElement('h4');
            title.innerText = prod.title;
            title.classList.add('product-title');
            productDetails.appendChild(title);

            // set product price
            let priceWrapper = document.createElement('div');
            priceWrapper.classList.add('price-wrapper');
            let price = document.createElement('p');
            price.classList.add('product-price');
            price.innerText = "$" + prod.price + ',-';
            if (prod.discountPercentage) {
                let discountPrice = document.createElement('p');
                discountPrice.classList.add('product-discount-price');
                let newPrice = (prod.price - (prod.discountPercentage / 100) * prod.price).toFixed(2);
                discountPrice.innerText = "$" + newPrice + ',-';
                price.classList.add('strikethrough');
                priceWrapper.appendChild(price);
                priceWrapper.appendChild(discountPrice);
            } else {
                priceWrapper.appendChild(price);
            }
            productDetails.appendChild(priceWrapper);

            // set image product
            let img = document.createElement('img');
            img.setAttribute('src', prod.images[0]);
            img.setAttribute('alt', prod.title);
            img.classList.add('d-block');
            contentWrapper.appendChild(img);

            // create add to cart button for the product
            let btn = document.createElement('div');
            btn.innerText = "Add to cart";
            let icon = document.createElement('i');
            icon.classList.add('bi', 'bi-plus', 'add-to-cart-icon');
            btn.prepend(icon);
            // let text = document.createElement('span');
            // text.innerText = "Add to cart";
            // btn.appendChild(text);
            btn.classList.add('add-to-cart-btn');
            btn.addEventListener('click', () => {
                addToCart(prod);
            })
            productDetails.appendChild(btn);

            contentWrapper.appendChild(productDetails);
            container.appendChild(contentWrapper);
            carouselItem.appendChild(container);
            carousel.appendChild(carouselItem);
        }
    }


    async function renderData() {
        await getData();
        fillCarousel();
        fillTable();
    }

    renderData();
    loadCartFromSessionStorage();

})