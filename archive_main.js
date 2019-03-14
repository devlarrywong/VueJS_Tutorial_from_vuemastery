Vue.config.devtools = true

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img v-bind:src="image" :alt="altText" />
            </div>
            <div class="product-info">

                <h1>{{ title }}</h1>

                <!--<p>{{ description }}</p>-->

                <!--
                <p v-if="inventory > 10">In Stock</p>
                <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
                <p v-else="inStock">Out of Stock</p>
                -->
                <p v-if="inStock">In Stock</p>
                <p v-else="inStock" :class="{ outOfStock: !inStock }">Out of Stock</p>
                <p>Shipping: {{ shipping }}</p>

                <!--<span v-if="onSale" v-show="onSale">On Sale!</span>-->

                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <div v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    class="color-box"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)">
                </div>

                <!--
                <div v-for="size in sizes" :key="size.sizeId">
                    <p>{{ size.sizeName }}</p>
                </div>
                -->

                <button v-on:click="addToCart"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }">Add to Cart</button>

                <!--
                <button v-on:click="decrementCart(cart)"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }"
                        :style="decrementCartStyle">-</button>
                -->

                <button @click="removeFromCart">
                    Remove from cart
                </button>
            </div>

            <product-tabs :reviews="reviews"></product-tabs>

            <!--
            <div>
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are not reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>

            <product-review @review-submitted="addReview"></product-review>
            -->

        </div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            description: 'A pair of warm, fuzzy socks.',
            selectedVariant: 0,
            altText: 'A pair of socks',
            inventory: 100,
            //inStock: false,
            onSale: false,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants:[
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: './assets/vmSocks-green.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: './assets/vmSocks-blue.jpg',
                    variantQuantity: 5
                },
            ],
            sizes:[
                {
                    sizeId: 1,
                    sizeName: 'S'
                },
                {
                    sizeId: 2,
                    sizeName: 'M'
                },
                {
                    sizeId: 3,
                    sizeName: 'L'
                },
            ],
            decrementCartStyle: {
                backgroundColor: '#f44336',
                width: '40px',
            },
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        },
        removeFromCart: function() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        // addReview(productReview){
        //     this.reviews.push(productReview)
        // }
        // decrementCart(cart) {
        //     if(cart == 0){
        //         this.cart = 0
        //     }
        //     else{
        //         this.cart -= 1
        //     }
        // },
    },
    computed: {
        title(){
            return this.brand + ' ' + this.product
        },
        image(){
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping(){
            if(this.premium){
                return "Free"
            }
            return 2.99
        }
    }
})

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">

            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>

            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name">
            </p>

            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>

            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>

            <p>
                <input type="submit" value="Submit">
            </p>
        </form>
    `,
    data (){
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods:{
        onSubmit(){
            this.errors = []
            if(this.name && this.review && this.rating){
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            }
            else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }

        }
    }
})

Vue.component('product-tabs', {
    props:{
        reviews:{
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <div>
                <span class="tab"
                        :class="{ activeTab: selectedTab === tab }"
                        v-for="(tab, index) in tabs"
                        :key="index"
                        @click="selectedTab = tab">
                        {{ tab }}
                </span>
            </div>

            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul v-else>
                    <li v-for="(review, index) in reviews" :key="index">
                        <p>{{ review.name }}</p>
                        <p>Rating:{{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>

            <div v-show="selectedTab === 'Make a Review'">
                <product-review></product-review>
            </div>
        </div>
    `,
    data () {
        return {
            tabs: ['Reviews', 'Make a Reivew'],
            selectedTab: 'Reviews'
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: [],
    },
    methods:{
        updateCart(id){
            this.cart.push(id)
        },
        removeItem(id) {
            for(var i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                }
            }
        }
    }

})
