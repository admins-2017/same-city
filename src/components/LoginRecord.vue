<template>
	<div id="loginRecord">
		<div>
			<div class="record-table">
				<el-table :data="tableData" style="width: 100%" height="400" :stripe="true">
					<el-table-column fixed prop="recordId" label="id" width="150">
					</el-table-column>
					<el-table-column fixed prop="recordTime" label="登录时间" width="150">
					</el-table-column>
					<el-table-column prop="recordIp" label="请求地址" width="120">
					</el-table-column>
					<el-table-column prop="recordAddr" label="地址" width="300">
					</el-table-column>
					<el-table-column prop="recordAddr" label="运营商" width="120">
					</el-table-column>
				</el-table>
			</div>
			<el-pagination background layout="prev, pager, next" :current-page="page" :page-size="size" :total="total" @current-change="handleCurrentChange">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		name: 'loginRecord',
		data() {
			return {
				tableData: [],
				total: 0,
				page: 1,
				size: 10,
				userDetail: {}	
			}
		},
		methods: {
			handleEdit(index, row) {
				console.log(index, row);
			},
			handleDelete(index, row) {
				console.log(index, row);
			},
			getRecord(){
				axios({
					method: "get",
					url: "/api/detail/"+this.page+"/"+this.size,
					headers: {
						"Authorization":this.userDetail.token
					}
				}).then(res => {
					console.log(res)
					this.total = res.data.data.total
					this.tableData =res.data.data.records
				}).catch(err => {
					this.$message.error('服务器连接超时 请重试！');
					// this.$router.go(0);
				})
			},
			handleCurrentChange(val){
				console.log(val)
				// 保存页码
				this.page = val
				// 重新获取数据
				this.getRecord()
			}
		},
		created() {
			this.userDetail = JSON.parse(localStorage.getItem("user-information"));
			this.getRecord()
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

	#loginRecord {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		>div {
			width: 90%;
			height: 90%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.record-table{
				width: 100%;
				height: 100%;
				.el-table {
					width: 100%;
					height: 100%;
				}
				
			}
			.el-pagination {
				margin-top: 20px;
			}
			
		}
	}
</style>
