import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Login',
		component: Login
	},
	{
		path: '/home',
		name: 'Home',
		component: Home,
		redirect: '/index',
		children: [{
				// 当 /user/:id/profile 匹配成功，
				// UserProfile 会被渲染在 User 的 <router-view> 中
				path: '/detail',
				component: () => import('../components/UserDetails.vue')
			},
			{
				path: '/index',
				component: () => import('../components/Index.vue')
			},
			{
				path: '/commoditys',
				component: () => import('../components/home/commoditys.vue')
			},
			{
				path: '/categorys',
				component: () => import('../components/home/categorys.vue')
			},
			{
				path: '/orders',
				component: () => import('../components/home/orders.vue')
			},
			{
				path: '/roles',
				component: () => import('../components/home/roles.vue')
			},
			{
				path: '/menus',
				component: () => import('../components/home/menus.vue')
			},
			{
				path: '/users',
				component: () => import('../components/home/users.vue')
			},
			{
				path: '/interfaces',
				component: () => import('../components/home/interfaces.vue')
			},
			{
				path: '/datasheets',
				component: () => import('../components/home/datasheets.vue')
			},
			{
				path: '/records',
				component: () => import('../components/home/records.vue')
			},
			{
				path: '/shops',
				component: () => import('../components/home/shops.vue')
			},
			{
				path: '/purchases',
				component: () => import('../components/home/purchases.vue')
			},
			{
				path: '/suppliers',
				component: () => import('../components/home/suppliers.vue')
			},
			{
				path: '/tasks',
				component: () => import('../components/home/tasks.vue')
			},
			{
				path: '/inventory',
				component: () => import('../components/home/inventory.vue')
			}
			,
			{
				path: '/client',
				component: () => import('../components/home/client.vue')
			}
		]
	},
	{
		path: '/find',
		name: 'Find',
		component: () => import('../views/Find.vue')
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
