import Vue from 'vue';
import Router from 'vue-router';
import VueResource from 'vue-resource';
import goods from '@/components/goods/goods';
import ratings from '@/components/ratings/ratings';
import seller from '@/components/seller/seller';

Vue.use(VueResource);
Vue.use(Router);

export default new Router({
  routes: [
    {
        path: '/', 
        redirect: 'goods'
    },
    {
        path: '/goods',
        name: 'goods',
        component: goods
    },
    {
        path: '/ratings',
        name: 'ratings',
        component: ratings
    },
    {
        path: '/seller',
        name: 'seller',
        component: seller
    }
  ],
  linkActiveClass: 'active' /* 默认link active classname */
});
