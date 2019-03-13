Vue.component('product', {
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

                <button v-on:click="decrementCart(cart)"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }"
                        :style="decrementCartStyle">-</button>

                <div class="cart">
                    <p>Cart({{ cart }})</p>
                </div>
            </div>

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
                    variantQuantity: 0
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
            cart: 0,
            decrementCartStyle: {
                backgroundColor: '#f44336',
                width: '40px',
            },
        }
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        },
        decrementCart(cart) {
            if(cart == 0){
                this.cart = 0
            }
            else{
                this.cart -= 1
            }
        },
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
        }
    }
})

var app = new Vue({
    el: '#app',

})
