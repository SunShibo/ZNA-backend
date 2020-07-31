import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import axios from '@/config/axios';
import ElementUI from 'element-ui';
import store from './store/index';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";

Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});


//全局过滤器
Vue.filter('FormatTime', val => {
    if (!val) return '无';
    const date = new Date(val.time);
    const year = date.getFullYear();
    const month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    return `${year}-${month}-${day}`;
});

//全局过滤器
Vue.filter('FormatDateTime', val => {
    if (!val) return '无';
    const date = new Date(val.time),
        year = date.getFullYear(),
        month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`,
        hh = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`,
        mm = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`,
        ss = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;
    return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
});


//格式化日期  格式 yyyy-MM-dd
let formatDate = (row, column) => {
    if (!row.createTime) return '无';
    const date = new Date(row.createTime.time),
        year = date.getFullYear(),
        month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    return `${year}-${month}-${day}`;
};

//格式化日期  格式 yyyy-MM-dd
let formatDateCommon = (row, column) => {
    if (!row) return '无';
    const date = new Date(row),
        year = date.getFullYear(),
        month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    return `${year}/${month}/${day}`;
};

//格式化日期  格式 yyyy-MM-dd hh:mm:ss
let formatTime = (row, column) => {
    if (!row.creationDate) return '无';
    const date = new Date(row.creationDate.time),
        year = date.getFullYear(),
        month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`,
        hh = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`,
        mm = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`,
        ss = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;
    return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
};

//格式化日期  格式 yyyy-MM-dd
let effectiveDate = (row, column) => {
    if (!row.effectiveDate) return '无';
    const date = new Date(row.effectiveDate.time),
        year = date.getFullYear(),
        month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    return `${year}-${month}-${day}`;
};

//格式化日期  格式 yyyy-MM-dd
let formatReleaseDate = (row, column) => {
    if (!row.releaseDate) return '无';
    const date = new Date(row.releaseDate.time),
        year = date.getFullYear(),
        month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    return `${year}-${month}-${day}`;
};
//格式化日期  格式 yyyy/MM/dd hh:mm:ss
let formatDateTime = (row) => {
    if (!row) return '无';
    const date = new Date(row),
        year = date.getFullYear(),
        month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`,
        hh = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`,
        mm = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`,
        ss = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;
    return `${year}/${month}/${day} ${hh}:${mm}:${ss}`;
};


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    //获取登录的uid
    let uid = sessionStorage.getItem('ms_uid');
    //当用户直接地址栏跳转进入后台时，进行判断
    //如果sessionStoragez中不存在当前的用户 直接跳转登录页 否则跳转404界面
    //判断to的页面不是login  防止死循环
    if (!uid && to.path !== '/login') {
        next({ path: '/login' });
    } else {
        next();
    }
});

Vue.prototype.$axios = axios;
Vue.prototype.formatDate = formatDate;
Vue.prototype.effectiveDate = effectiveDate;
Vue.prototype.formatReleaseDate = formatReleaseDate;
Vue.prototype.formatDateTime = formatDateTime;
Vue.prototype.formatTime = formatTime;
Vue.prototype.formatDateCommon = formatDateCommon;
Vue.prototype.closeOnClickModal = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')