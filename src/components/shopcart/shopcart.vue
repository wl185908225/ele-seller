<template>
    <div>
        <div class="shopcart">
            <div class="content" @click="toggleList">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{'highlight' : totalCount>0}">
                            <i class="icon-shopping_cart" :class="{'highlight' : totalCount>0}"></i>
                        </div>
                        <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                    </div>
                    <div class="price" :class="{'highlight' : totalPrice>0}">￥{{totalPrice}}</div>
                    <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
                </div>
                <div class="content-right" @click.stop="toPay">
                    <div class="pay" :class="payClass">{{payDesc}}</div>
                </div>
                <div class="ball-container">
                    <transition-group   name="drop" 
                                        @before-enter="beforeEnter" 
                                        @enter="enter"
                                        @after-enter="afterEnter">
                        <div class="ball" v-for="(ball, index) in balls" :key="index" v-show="ball.show">
                            <div class="inner inner-hook"></div>
                        </div>
                    </transition-group>
                </div>
            </div>
            <transition name="fold">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="emptySelectFoods">清空</span>
                    </div>
                    <div class="list-content" ref="listcontent">
                        <ul>
                            <li class="food" v-for="(food, index) in selectFoods" :key="index">
                                <span class="name">{{food.name}}</span>
                                <div class="price">
                                    <span>￥{{food.price * food.count}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol @cartAdd="addFood"  :food="food"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="mask">
            <div class="list-mask" v-show="listShow" @click="hideList"></div>
        </transition>
    </div>
  
</template>

<script type="text/javascript">
    import Vue from 'vue';
    import BScroll from 'better-scroll';
    import cartcontrol from '@/components/cartcontrol/cartcontrol';

    export default {
        props: {
            selectFoods: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            deliveryPrice: {
                type: Number,
                default: function () {
                    return 0;
                }
            },
            minPrice: {
                type: Number,
                default: function () {
                    return 0;
                }
            }
        },
        components: {
            cartcontrol
        },
        data() {
            return {
                balls: [
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    }
                ],
                dropBalls: [],
                fold: true
            };
        },
        watch: {
            selectFoods: function(newFoods, oldFoods) {
                if (newFoods.length === 0) {
                    this.fold = true;
                }
            }
        },
        computed: {
            listShow() {
                if (this.totalCount === 0) {
                    return false;
                } 
                if (this.totalCount > 0 && !this.fold) { 
                    let that = this;
                    Vue.nextTick(function () {
                        // 初始化, 不存在实例化，否则
                        if (!that.scroll) {
                            that.scroll = new BScroll(that.$refs.listcontent, {
                                click: true,
                                mouseWheel: true
                            });
                        } else {
                            that.scroll.refresh();
                        }
                    });

                    return true;
                }
                return false;
            },
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach(function(food) {
                    total += food.price * food.count;
                });
                return total;
            },
            totalCount() {
                let count = 0;
                this.selectFoods.forEach(function(food) {
                    count += food.count;
                });
                return count;
            },
            payDesc() {
                if (this.totalPrice === 0) {
                    return '￥' + this.minPrice + '元起送';
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return '还差￥' + diff + '元起送';
                } else {
                    return '去结算';
                }
            },
            payClass() {
                if (this.totalPrice >= this.minPrice) {
                    return 'enough';
                } else {
                    return 'not-enough';
                }
            }
        },
        methods: {
            drop(el) {
                // 父组件传递过来的
                // 触发一次事件就会将所有小球进行遍历
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.show) { // 将false的小球放到dropBalls
                        ball.show = true;
                        ball.el = el; // 设置小球的el属性为一个dom对象
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            addFood(target) {
                this.drop(target);
            },
            toggleList() {
                if (this.totalCount === 0) {
                    return false;
                }  
                this.fold = !this.fold;
            },
            emptySelectFoods() {
                this.selectFoods.forEach(function (food) {
                    food.count = 0;
                });
            },
            hideList() {
                this.fold = true;
            },
            toPay() {
                if (this.totalPrice < this.minPrice) {
                    return;
                }
                window.alert(`需要支付${this.totalPrice}元`);
            },
            beforeEnter(el) {
                // 这个方法的执行是因为这是一个vue的监听事件
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if (ball.show) {
                        let rect = ball.el.getBoundingClientRect(); // 获取小球的相对于视口的位移(小球高度)
                        let x = rect.left - 32;
                        let y = -(window.innerHeight - rect.top - 22); // 负数,因为是从左上角往下的的方向
                        el.style.display = ''; // 清空display
                        el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
                        el.style.transform = `translate3d(0, ${y}px, 0)`;
                        // 处理内层动画
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
                        inner.style.transform = `translate3d(${x}px, 0, 0)`;
                    }
                }
            },
            enter(el, done) { // 这个方法的执行是因为这是一个vue的监听事件
                /* eslint-disable no-unused-vars */
                let rf = el.offsetHeight; // 触发重绘html
                Vue.nextTick(function () { // 让动画效果异步执行,提高性能
                    el.style.webkitTransform = 'translate3d(0, 0, 0)';
                    el.style.transform = 'translate3d(0, 0, 0)';
                    // 处理内层动画
                    let inner = el.getElementsByClassName('inner-hook')[0]; // 使用inner-hook类来单纯被js操作
                    inner.style.webkitTransform = 'translate3d(0, 0, 0)';
                    inner.style.transform = 'translate3d(0, 0, 0)';
                    el.addEventListener('transitionend', done); // Vue为了知道过渡的完成，必须设置相应的事件监听器。
                });
            },
            afterEnter(el) { // 这个方法的执行是因为这是一个vue的监听事件
                let ball = this.dropBalls.shift(); // 完成一次动画就删除一个dropBalls的小球
                if (ball) { 
                    ball.show = false;
                    el.style.display = 'none'; // 隐藏小球
                }
            }
        }
      };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin"

    .shopcart
        position: fixed
        left: 0
        bottom: 0
        width: 100%
        height: 46px
        z-index: 50
        .content
            display: flex
            background-color: #141d27
            font-size: 0
            color: rgba(255, 255, 255, 0.4)
            .content-left
                flex: 1
                .logo-wrapper
                    display: inline-block
                    position:relative
                    top: -10px
                    margin: 0 12px
                    padding: 6px
                    width: 56px
                    height: 56px
                    box-sizing: border-box
                    vertical-align: top
                    border-radius: 50%
                    background-color: #141d27
                    .logo
                        width: 100%
                        height:100%
                        border-radius: 50%
                        text-align: center
                        background-color: #2b343c
                        &.highlight
                            background-color: rgb(0, 160, 220)
                        .icon-shopping_cart
                            line-height: 44px
                            font-size: 24px
                            color: #80858a
                            &.highlight
                                color: #fff
                    .num
                        position: absolute
                        top: 0
                        right: 0
                        width: 24px
                        height: 16px
                        line-height: 16px
                        text-align: center
                        border-radius: 16px
                        font-size: 9px
                        font-weight: 700
                        color: #fff
                        background-color: rgb(240, 20, 20)
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
                .price
                    display: inline-block
                    vertical-align: top
                    margin-top: 12px
                    line-height: 24px
                    padding-right: 12px
                    box-sizing: border-box
                    border-right: 1px solid rgba(255, 255, 255, 0.1)
                    font-size: 16px
                    font-weight: 700
                    &.highlight
                        color: #fff
                .desc
                    display: inline-block
                    vertical-align: top
                    line-height: 24px
                    margin: 12px 0 0 12px
                    font-size: 10px
                    font-weight: 700
            .content-right
                flex: 0 0 105px
                width: 105px
                .pay
                    height: 48px
                    line-height: 48px
                    text-align: center
                    font-size: 12px
                    font-weight: 700
                    background-color: #2b333b
                    &.not-enough
                        background-color: #2b333b
                    &.enough
                        background-color: #00b43c
                        color: #fff
        .ball-container
            .ball
                position: fixed
                left: 32px
                bottom: 22px
                z-index: 200
                &.drop-enter-active
                    transition: all 0.5s cubic-bezier(0.49, -0.29, 0.75, 0.41)
                    .inner
                        width: 16px
                        height: 16px
                        border-radius: 50%
                        background-color: rgb(0, 160, 220)
                        transition: all 0.5s linear
        .shopcart-list
            position: absolute
            left: 0
            top: 0
            width: 100%
            z-index: -1
            transform: translate3d(0, -100%, 0) // 整个列表相对于当前自身的高度做一个偏移
            &.fold-enter-active, &.fold-leave-active
                transition: all 0.5s linear
                transform: translate3d(0, -100%, 0) // 整个列表相对于当前自身的高度做一个偏移
            &.fold-enter,&.fold-leave-to
                transform: translate3d(0, 0, 0)
            .list-header
                height: 40px
                line-height: 40px
                padding: 0 18px
                background-color: #f3f5f7;
                border-bottom: 1px solid rgba(7, 17, 27, 0.1)
                .title
                    float: left
                    font-size: 14px
                    color: rgb(7, 17, 27)
                .empty
                    float: right
                    font-size: 12px
                    color: rgb(0, 160, 260)
            .list-content
                padding: 0 18px
                max-height: 217px
                overflow: hidden
                background-color: #fff
                .food
                    position: relative
                    padding: 12px 0
                    box-sizing: border-box
                    border-1px(rgba(7, 17, 27, 0.1))
                    .name
                        line-height: 24px
                        font-size: 14px
                        color: rgb(7, 17, 27)
                    .price
                        position: absolute
                        right: 90px
                        bottom: 12px
                        line-height: 24px
                        font-size:14px
                        font-weight: 700
                        color: rgb(240, 20, 20)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 6px
    .list-mask
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: 40
        backdrop-filter: blur(10px) 
        background-color: rgba(7, 17, 27, 0.6)
        opacity: 1
        transition: all 0.4s linear
        &.mask-enter,&.mask-leave-to
            opacity: 0
            background-color: rgba(7, 17, 27, 0)
</style>
