import axios from 'axios';

export default class Search {
    constructor() {
            this.injectHTML();
            this.searchIcon = document.querySelector('.header-search-icon');
            this.searchOverlay = document.querySelector('.search-bar-2');
            this.resultOverlay = document.querySelector('.result-container');
            this.closeIcon = document.querySelector('.close-search');
            this.searchField = document.querySelector('#live-search-field');
            this.loaderIcon = document.querySelector('.loader-container');
            this.resultsArea = document.querySelector('.result');
            this.typingWaitTimer;
            this.previousValue = '';
            this.events();
    }

    events() {
        this.searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            this.openOverlay();
        });

        this.closeIcon.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeOverlay();
        });

        this.searchField.addEventListener('keyup', () => {
            //show loader icon
            this.keyPressHandler();
        });
    }



    //Methods
    openOverlay() {
        this.searchOverlay.classList.add('search-bar-2--visible');
        this.resultOverlay.classList.add('result-container--visible');
        setTimeout(() => this.searchField.focus(), 50);
    }

    closeOverlay() {
        this.searchOverlay.classList.remove('search-bar-2--visible');
        this.resultOverlay.classList.remove('result-container--visible');
        this.hideLoaderIcon();
        this.searchField.value = '';    
    }

    keyPressHandler() {
        let value = this.searchField.value;

        if(value == '') {
            clearTimeout(this.typingWaitTimer);
            this.hideLoaderIcon();
            this.removeResultsHTML();
        }

        if(value != '' && value != this.previousValue) {
            clearTimeout(this.typingWaitTimer);
            this.showLoaderIcon();
            this.removeResultsHTML();
            this.typingWaitTimer = setTimeout(() => {this.sendRequest()}, 750);
        }
        this.previousValue = value;
    }

    //sends a request to the server to search for products in the database with the provided search term
    sendRequest() {
        axios.post("/search", {searchTerm: this.searchField.value}).then((result) => {
            this.renderResultsHTML(result.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    showLoaderIcon() {
        this.loaderIcon.classList.add('loader-container--visible');
    }

    hideLoaderIcon() {
        this.loaderIcon.classList.remove('loader-container--visible');
    }

    renderResultsHTML(products) {
        this.hideLoaderIcon();
        if(products.length) {
            this.resultsArea.innerHTML =  `
            ${products.map(product => {
                return `<img src="${product.image}" alt="Product Image">
                <div class="product-info">
                    <h2>Product Title: ${product.title} </h2>
                    <p class="price">Product Info: ${product.price}</p>
                    <a href="/productDetails/${product._id}">View Details</a>
                </div>`
            }).join('')}
            `
        } else {
            this.resultsArea.innerHTML = "<p>No results found</p>";
        }
        this.addResultsHTML();
    }


    removeResultsHTML() {
        this.resultsArea.innerHTML = '';
        this.resultsArea.classList.remove('result--visible');
    }

    addResultsHTML() {
        this.resultsArea.classList.add('result--visible');
    }
    injectHTML() {
       document.body.insertAdjacentHTML('beforeend', 
        `<div class="search-bar-2 ">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search" id="live-search-field">
            <span class="close-search"><i class="fas fa-times-circle"></i></span>
        </div>
        <div class="result-container ">
            <div class="loader-container">
                <div class="loader"></div>
            </div>

            <div class="result">
            </div>
        </div>`);
    }

}

/*
<div class="result">
       <img src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b" alt="Product Image">
       <div class="product-info">
           <h2>Product Title: Product 2</h2>
           <p class="price">Product Info: $200</p>
           <p class="description">Product Description: This is a product description</p>
           <a href="/productDetails/2">View Details</a>
       </div>
</div>
 */