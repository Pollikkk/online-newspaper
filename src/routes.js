import { createRouter, createWebHistory  } from 'vue-router';
import MainPage from './components/MainPage.vue';
import LoginPage from './components/LoginPage.vue';
import RegisterPage from './components/RegisterPage.vue';

const router = createRouter({
	routes: [
		{
			path: '',
			redirect: {name: 'main'}
		},
		{
			name: 'main',
			path: '/',
			component: MainPage,
            /*meta: { 
                requiresAuth: true
            }*/
		},
		{
			name: 'login',
			path: '/login',
			component: LoginPage,
            /*meta: { 
                guest: true
            }*/
		},
		{
			name: 'register',
			path: '/register',
			component: RegisterPage,
            /*meta: { 
                guest: true
            }*/
		},
	]
	,
	history: createWebHistory()
});

/*router.beforeEach(async (to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('token') == null) {
            next({
                path: '/login',
                params: { nextUrl: to.fullPath }
            })
        } else {
            //let user = JSON.parse(localStorage.getItem('user'))
            next()
        }
    } else if(to.matched.some(record => record.meta.guest)) {
        if(localStorage.getItem('token') == null){
            next()
        }
        else{
            next({ name: 'main'})
        }
    }
});*/

export default router;