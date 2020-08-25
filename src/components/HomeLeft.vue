<template>
	<div id="homeleft">
		<div class="left-content">
			<el-row class="tac">
				<el-menu default-active="1" :collapse="!isCollapse" :style="!isCollapse?'width:64px':'width:150px'" class="el-menu-vertical-demo"
				 @open="handleOpen" @close="handleClose">
					<el-submenu :index="menu.menuId+''" v-for="(menu,index) in userMenu" :key="menu.name">
						<template slot="title">
							<i :class="menu.icon"></i>
							<span>{{menu.name}}</span>
						</template>
						<el-menu-item-group>
							<el-menu-item :index="child.menuId+''" v-for="(child,index) in menu.children" :key="child.name">
								<i :class="child.icon"></i>
								<router-link :to="'/'+child.path" @click.native="doSomething(child.path,child.name)" >{{child.name}}</router-link>
							</el-menu-item>
							<!-- <el-menu-item index="1-2">选项2</el-menu-item> -->
						</el-menu-item-group>
					</el-submenu>
				</el-menu>
			</el-row>
			<el-switch v-model="isCollapse" active-color="#13ce66" inactive-color="#ff4949">
			</el-switch>
		</div>
		<div class="left-main">
			<tags></tags>
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import tags from '../components/HomeTag.vue'
	export default {
		name: 'homeleft',
		props: [
			"userMenu"
		],
		components: {
			tags
		},
		data() {
			return {
				isCollapse: false,
				tags: [],
				isOk: true
			}
		},
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			doSomething(toUrl,name){
				this.tags = this.$store.state.homeTags
				for (var i = 0; i < this.tags.length; i++) {
					if(this.tags[i].name == name ){
						this.isOk = false
					}
				}
				if(this.isOk){
					this.$store.commit('saveHomeTags', {name: ''+name,type: '',path:'/'+toUrl})
					this.isOk = true
				}
			}
		}
	}
</script>

<style lang="less">
	html,
	body {
		width: 100%;
		height: 100%;
		margin: 0px;
		padding: 0px;
	}

	#homeleft {
		height: 100%;
		display: flex;
		justify-content: space-between;

		.left-content {
			height: 100%;
			overflow-y: auto;
			overflow-x: hidden;
			background-color: white;

			.el-menu-item-group__title {
				padding: 0px !important;
			}
			
			.el-submenu__icon-arrow {
				display: none;
			}
			
			.el-menu-item {
				padding-left: 40px !important;
				// text-align: center;
			}
			
			.el-switch {
				margin-top: 20px;
				width: 100%;
				display: flex;
				justify-content: center;
			}
		}

		.left-main {
			height: 100%;
			flex: 1;
			overflow-y: hidden;
			overflow-x: hidden;
			background-color: whitesmoke;
		}
	}
</style>
