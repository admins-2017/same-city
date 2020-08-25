<template>
	<div id="index">
		<div class="index-nav">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="index-main">
			<div class="main-carousel">
				<el-carousel height="250px" indicator-position="outside">
					<el-carousel-item v-for="item in imgList" :key="item">
						<router-link to="/">
							<img :src="item" alt="" class="el-carousel-item-img">
						</router-link>
					</el-carousel-item>
				</el-carousel>
			</div>
			<div class="main-progress">
				<div>
					<el-progress type="circle" :percentage="0">
					</el-progress>
					<span>
						任务1
					</span>
				</div>
				<div>
					<el-progress type="circle" :percentage="25"></el-progress>
					<span>
						任务2
					</span>
				</div>
				<div>
					<el-progress type="circle" :percentage="100" status="success"></el-progress>
					<span>
						任务3
					</span>
				</div>
				<div>
					<el-progress type="circle" :percentage="70" status="warning"></el-progress>
					<span>
						任务4
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'index',
		data() {
			return {
				imgList: [
					'http://qf30yvzam.hn-bkt.clouddn.com/Fq3EhwTVIWrCm6wB3vekrEPormDR',
					'http://qf30yvzam.hn-bkt.clouddn.com/a',
					'http://qf30yvzam.hn-bkt.clouddn.com/b',
					'http://qf30yvzam.hn-bkt.clouddn.com/c',
				]
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

	#index {
		width: 100%;
		height: 100%;
		background-color: white;
		border-top: 2px solid red;
		border-left: 2px solid lawngreen;

		.index-nav {
			width: 100%;
			padding: 20px 40px;
		}

		.index-main {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;

			.main-carousel {
				padding-top: 10px;
				width: 80%;

				.el-carousel {
					width: 100%;

					.el-carousel__container {
						width: 100%;
						height: 100%;

						img {
							width: 100%;
							height: 100%;
						}

						.el-carousel-item {
							width: 80%;
							height: 80%;
						}

						.el-carousel__item:nth-child(2n) {
							background-color: #99a9bf;
						}

						.el-carousel__item:nth-child(2n+1) {
							background-color: #d3dce6;
						}
					}
				}
			}

			.main-progress {
				border-top: 1px solid red;
				width: 80%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				> div {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
				}
			}
		}
	}
</style>
