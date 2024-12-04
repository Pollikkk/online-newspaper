import { createRouter, createWebHistory  } from 'vue-router';
import MainPage from './components/MainPage.vue';
import LoginPage from './components/LoginPage.vue';
import AuthorizePage from './components/AuthorizePage.vue';

const router = createRouter({
	routes: [
		{
			path: '',
			redirect: {name: 'main'}
		},
		{
			name: 'main',
			path: '/main',
			component: MainPage
		},
		{
			name: 'login',
			path: '/login',
			component: LoginPage
		},
		{
			name: 'authorize',
			path: '/authorize',
			component: AuthorizePage
		},
	]
	,
	history: createWebHistory()
});

export default router;