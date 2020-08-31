<template>
	<div id="home">
		<top :userDetails="testVuex"></top>
		<left :userMenu="userMenu"></left>
	</div>
</template>

<script>
	import axios from 'axios'
	import left from '../components/HomeLeft.vue'
	import top from '../components/HomeTop.vue'
	export default {
		name: 'home',
		data() {
			return {
				testVuex: {},
				userMenu: []
			}
		},
		components: {
			top,
			left
		},
		methods: {
			getMenu(){
				axios({
					method: "get",
					url: "/api/menu/basisTree",
					headers: {
						"Authorization":this.testVuex.token
					}
				}).then(res => {
					if(res.data.status){
						this.userMenu = res.data.data
					}else{
						this.$message.error(res.data.msg);
					}
					
				}).catch(err => {
					console.log(err)
					this.$message.error('服务器连接超时 请重试！');
				})
			}
		},
		created() {
			this.testVuex = JSON.parse(localStorage.getItem("user-information"));
			this.getMenu()
		}
	}
</script>

<style lang="less">
	html,
	body {
		margin: 0px;
		padding: 0px;
		width: 100%;
		height: 100%;
		a{
			text-decoration: none;
			color: #000;
		}
	}

	#home {
		width: 100%;
		height: 100%;

		>#hometop {
			width: 100%;
			height: 8%;
		}

		>#homeleft {
			flex: 1;
		}

	}
</style>
