import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },

        {
            path: '/home',
            name: 'home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            redirect: '/home/user',
            children: [
                {
                    path: '/home/user',
                    name: 'user',
                    component: resolve => require(['../components/page/system/user.vue'], resolve),
                    meta: {title: '用户列表', permission: true, index: 'user'} /* 已修改 */
                },
                {
                    path: '/home/homeBanner',
                    name: 'homeBanner',
                    component: resolve => require(['../components/page/dy_home.vue'], resolve),
                    meta: {title: '首页Banner', permission: true, index: 'homeBanner'}  /* 已修改 */
                },
                {
                    path: '/home/homeModel',
                    name: 'homeModel',
                    component: resolve => require(['../components/page/dy_model.vue'], resolve),
                    meta: {title: '首页模块', permission: true, index: 'homeModel'}  /* 已修改 */
                },
                {
                    path: '/home/usBanner',
                    name: 'usBanner',
                    component: resolve => require(['../components/page/dy_us_banner.vue'], resolve),
                    meta: {title: '关于我们Banner', permission: true, index: 'usBanner'}  /* 已修改 */
                },
                {
                    path: '/home/usHistory',
                    name: 'usHistory',
                    component: resolve => require(['../components/page/dy_us_history.vue'], resolve),
                    meta: {title: '历史封面', permission: true, index: 'usHistory'}  /* 已修改 */
                }
                ,{
                    path: '/home/history',
                    name: 'history',
                    component: resolve => require(['../components/page/history.vue'], resolve),
                    meta: {title: '历史模块', permission: true, index: 'history'}
                },
                {
                    path: '/home/cooperation',
                    name: 'cooperation',
                    component: resolve => require(['../components/page/cooperation.vue'], resolve),
                    meta: {title: '合作伙伴', permission: true, index: 'cooperation'}  /* 已修改 */
                } ,
                {
                    path: '/home/usServe',
                    name: 'usServe',
                    component: resolve => require(['../components/page/dy_us_serve.vue'], resolve),
                    meta: {title: '关于我们服务', permission: true, index: 'usServe'}  /* 已修改 */
                }
                ,
                {
                    path: '/home/company',
                        name: 'company',
                    component: resolve => require(['../components/page/dy_us_company.vue'], resolve),
                    meta: {title: '公司介绍', permission: true, index: 'company'}  /* 已修改 */
                }
                ,
                {
                    path: '/home/project',
                    name: 'project',
                    component: resolve => require(['../components/page/dy_project.vue'], resolve),
                    meta: {title: '项目配置', permission: true, index: 'project'}  /* 已修改 */
                }  ,
                {
                    path: '/home/projectType',
                    name: 'projectType',
                    component: resolve => require(['../components/page/project_type.vue'], resolve),
                    meta: {title: '项目分类', permission: true, index: 'projectType'}  /* 已修改 */
                },
                {
                    path: '/home/office',
                    name: 'office',
                    component: resolve => require(['../components/page/office.vue'], resolve),
                    meta: {title: '办公室配置', permission: true, index: 'office'}  /* 已修改 */
                }
                ,
                {
                    path: '/home/recruitment',
                    name: 'recruitment',
                    component: resolve => require(['../components/page/recruitment.vue'], resolve),
                    meta: {title: '人才招聘', permission: true, index: 'recruitment'}  /* 已修改 */
                }
                ,
                {
                    path: '/home/station',
                    name: 'station',
                    component: resolve => require(['../components/page/station.vue'], resolve),
                    meta: {title: '在招岗位', permission: true, index: 'station'}  /* 已修改 */
                }
                ,
                {
                    path: '/home/news',
                    name: 'news',
                    component: resolve => require(['../components/page/news.vue'], resolve),
                    meta: {title: '发布动态', permission: true, index: 'news'}  /* 已修改 */
                }
                ,
                {
                    path: '/home/team',
                    name: 'team',
                    component: resolve => require(['../components/page/team.vue'], resolve),
                    meta: {title: '核心团队', permission: true, index: 'team'}  /* 已修改 */
                }
                ,
                {
                    path: '/home/information',
                    name: 'information',
                    component: resolve => require(['../components/page/information.vue'], resolve),
                    meta: {title: '联系方式', permission: true, index: 'information'}  /* 已修改 */
                }
               ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve),
            meta: {title: '登录'}  /* 已修改 */
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
