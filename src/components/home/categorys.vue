<template>
	<div id="categorys">
		<div>
			<div>
				<el-button type="primary">主要按钮</el-button>
				<div>
					<el-button type="primary">主要按钮</el-button>
					<el-button type="primary">主要按钮</el-button>
				</div>
			</div>
			<div>
				<el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
					<el-tab-pane :label="item.classificationName" :name="item.classificationName" v-for="item in classificationList">
						<el-table :data="item.children" style="width: 100%" height="600">
							<el-table-column type="expand">
								<template slot-scope="props">
									<el-tag v-for="tagClassification in props.row.children">{{tagClassification.classificationId}}&#12288&#12288&#12288{{tagClassification.classificationName}}</el-tag>
								</template>
							</el-table-column>
							<el-table-column prop="classificationId" label="ID" >
							</el-table-column>
							<el-table-column prop="classificationName" label="分类名称" >
							</el-table-column>
							<el-table-column prop="classificationCode" label="分类编号">
							</el-table-column>
							<el-table-column prop="classificationLevel" label="分类等级">
							</el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		name: "categorys",
		data() {
			return {
				activeName: "食品/酒品/生鲜/特产",
				classificationList: [],
				tableData: [{
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '2016-05-04',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1517 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-03',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1516 弄'
				}]
			}
		},
		methods: {
			handleClick(tab, event) {
				console.log(tab, event);
			},
			getAllClassification() {
				axios({
						method: "get",
						url: "/api/classification",
						headers: {
							Authorization: this.userDetails.token,
						},
					})
					.then((res) => {
						console.log(res);
						this.classificationList = res.data.data;
					})
					.catch((err) => {
						console.log(err);
						this.$message.error("服务器连接超时 请重试！");
					});
			}
		},
		created() {
			this.userDetails = JSON.parse(localStorage.getItem("user-information"));
			this.getAllClassification();
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

	#categorys {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		>div {
			width: 98%;
			height: 98%;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: white;

			>div:nth-of-type(1) {
				width: 95%;
				margin: 10px 0px;
				display: flex;
				justify-content: space-between;
			}

			>div:nth-of-type(2) {
				width: 95%;
				.el-tag{
					margin-right: 10px;
				}
			}
		}
	}
</style>
