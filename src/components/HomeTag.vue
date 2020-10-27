<template>
	<div id="hometag">
		<el-tag v-for="tag in tags" :key="tag.name" :closable="tag.name=='主页'?false:true" :disable-transitions="false" @close="handleClose(tag)">
			<i class="el-icon-location" :style="'color: seagreen'"></i>
			<router-link :to="tag.path">{{tag.name}}</router-link>
		</el-tag>
	</div>
</template>

<script>
	export default {
		name: 'hometag',
		data() {
			return {
				tags: []
			}
		},
		methods: {
			handleClose(tag) {
				console.log(tag)
				// if
				this.tags.splice(this.tags.indexOf(tag), 1);
			}
		},
		created() {
			this.tags = this.$store.state.homeTags
			console.log(this.tags)
		},
		watch: {
			// val 监听到的值
			'$store.state.homeTags'(val) {
				this.tags = val
			}
		}
	}
</script>

<style lang="less">
	html,
	body {
		width: 100%;
		height: 100%;
		padding: 0px;
		margin: 0px;
	}
	#hometag{
		background-color: white;
		width: 100%;
		padding-left: 10px;
		position: relative;
		border-bottom: 1px solid whitesmoke;
		z-index: 1000;
		.el-tag{
			border: 0px;
			border-radius: 0px;
			border-right: 1px solid silver;
			background-color: white;
			color: black;
			
			a{
				margin-right: 5px;
				margin-left: 10px;
			}
		}
	}
</style>
