<template>
    <div class="cartcontrol">
        <transition name="move">
            <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
                <span class="inner icon-remove_circle_outline"></span>
            </div>
        </transition>
        <div class="cart-count"  v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
    </div>
</template>

<script type="text/javascript">
    import Vue from 'vue';

    export default {
        props: {
            food: {
                type: Object
            }
        },
        created() {},
        methods: {
            addCart(event) {
                if (!this.food.hasOwnProperty('count')) {
                    Vue.set(this.food, 'count', 1);
                } else {
                    Vue.set(this.food, 'count', this.food.count + 1);
                }
                this.$emit('cartAdd', event.target);
            },
            decreaseCart() {
                if (this.food.count > 1) {
                    this.food.count--;
                } else {
                    this.food.count = 0;
                }
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .cartcontrol
        font-size: 0
        .cart-decrease, .cart-count, .cart-add
            display: inline-block
        .cart-decrease
            padding: 6px
            transition: all 0.4s linear
            .inner
                display: inline-block
                line-height: 24px
                font-size: 24px
                color: rgb(0, 160, 220)
            &.move-enter-active
                opacity: 1
                transform: translate3d(0, 0, 0)
                .inner
                    transition: all 0.5s linear
                    transform: rotate(0)
            &.move-enter,&.move-leave-to
                opacity: 0;
                transform: translate3d(24px, 0, 0)
                .inner
                    transition: all 0.5s linear
                    transform: rotate(180deg)
        .cart-add
            line-height: 24px
            font-size: 24px
            padding: 6px
            color: rgb(0, 160, 220)
        .cart-count
            vertical-align: top
            width: 12px
            padding-top: 7px
            line-height: 24px
            text-align: center
            font-size: 10px
            color: rgb(147, 153, 159)
</style>
