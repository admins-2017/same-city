<template>
	<div id="users">
		<div>
			<div class="users-left">
				<div>
					<el-input placeholder="根据商铺名查询" prefix-icon="el-icon-search" v-model="input">
					</el-input>
				</div>
				<div>
					<el-tree :props="shops" :data="shopList" @node-click="handleCheckChange">
					</el-tree>
				</div>
			</div>
			<div class="users-right">
				<div>
					<div>
						<el-input placeholder="请输入用户名" prefix-icon="el-icon-search" v-model="queryName">
						</el-input>
						<el-button type="primary" plain @click="getUserByName">查询</el-button>
						<el-button type="primary" plain @click="clearQuery">取消</el-button>
					</div>
					<el-button type="primary" plain @click="dialogFormVisible = true">新增用户</el-button>
				</div>
				<div>
					<el-table :data="tableData" border :height="500">
						<el-table-column prop="userId" sortable label="用户id" width="175">
						</el-table-column>
						<el-table-column prop="username" label="姓名" width="85">
						</el-table-column>
						<el-table-column prop="userDetailsSex" label="性别" width="65" :filters="[{ text: '男', value: 1 }, { text: '女', value: 2 }]"
						 :filter-method="filterHandler" filter-placement="bottom-end">
							<template slot-scope="scope">
								<el-tag :type="'success'" disable-transitions v-if="scope.row.userDetailsSex === 1">男</el-tag>
								<el-tag :type="'primary'" disable-transitions v-else>女</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="userDetailsTel" label="联系方式" width="110">
						</el-table-column>
						<el-table-column prop="userDetailsAddr" label="家庭住址">
						</el-table-column>
						<el-table-column prop="roleName" label="角色" width="100">
						</el-table-column>
						<el-table-column prop="shopName" label="所属商铺" width="120">
						</el-table-column>
						<el-table-column prop="status" label="状态" width="70" :filters="[{ text: '正常', value: 'NORMAL' }, { text: '停用', value: 'PROHIBIT' }]"
						 :filter-method="filterHandler" filter-placement="bottom-end">
							<template slot-scope="scope">
								<el-tag :type="scope.row.status === 'NORMAL' ? 'success' : 'danger'" disable-transitions v-if="scope.row.status=='NORMAL'">正常</el-tag>
								<el-tag :type="scope.row.status === 'NORMAL' ? 'success' : 'danger'" disable-transitions v-else>停用</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="100">
							<template slot-scope="scope">
								<el-button type="text" @click="handleClick(scope.row)" size="small">编辑</el-button>
								<el-button type="text" size="small" @click="stopUser(scope.row.userId)" v-if="scope.row.status === 'NORMAL'">停用</el-button>
								<el-button type="text" size="small" @click="stopUser(scope.row.userId)" v-else>启用</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div>
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
					 :page-size="size" layout="total, prev, pager, next, jumper" :total="total">
					</el-pagination>
				</div>
				<div>
					<el-dialog title="新增用户" :visible.sync="dialogFormVisible" :width="dialogWidht" center>
						<el-form :model="form">
							<el-form-item label="用户名" :label-width="formLabelWidth">
								<el-input v-model="form.username" autocomplete="off" :class="textForm"></el-input>
							</el-form-item>
							<el-form-item label="初始密码" :label-width="formLabelWidth">
								<el-input :placeholder="'123456'" autocomplete="off" :class="textForm"></el-input>
							</el-form-item>
							<el-form-item label="联系方式" :label-width="formLabelWidth">
								<el-input v-model="form.userDetailsTel" autocomplete="off" :class="textForm"></el-input>
							</el-form-item>
							<el-form-item label="联系地址" :label-width="formLabelWidth">
								<el-input v-model="form.userDetailsAddr" autocomplete="off" :class="textForm"></el-input>
							</el-form-item>
							<el-form-item label="联系邮箱" :label-width="formLabelWidth">
								<el-input v-model="form.userDetailsMail" autocomplete="off" :class="textForm"></el-input>
							</el-form-item>
							<el-form-item label="性别" :label-width="formLabelWidth">
								<el-select v-model="form.userDetailsSex" placeholder="请选择">
									<el-option label="男" value="1"></el-option>
									<el-option label="女" value="2"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="所属商铺" :label-width="formLabelWidth">
								<el-select v-model="form.shopId" placeholder="请选择">
									<el-option :label="shop.shopName" :value="shop.shopId" v-for="shop in allShop" :key="shop"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="分配角色" :label-width="formLabelWidth">
								<el-select v-model="form.roleId" placeholder="请选择">
									<el-option :label="role.roleName" :value="role.roleId" v-for="role in roles" :key="role"></el-option>
								</el-select>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="insertUser">确 定</el-button>
						</div>
					</el-dialog>
				</div>
				<div>
					<el-dialog title="修改用户" :visible.sync="dialogFormVisible2" :width="dialogWidht" center>
						<el-form :model="updateUserFrom">
							<el-form-item label="用户名" :label-width="formLabelWidth">
								<el-input autocomplete="off" :disabled="true" :placeholder="userDetailsShow.username" :class="textForm2"></el-input>
							</el-form-item>
							<el-form-item label="联系地址" :label-width="formLabelWidth">
								<el-input v-model="updateUserFrom.userDetailsAddr" autocomplete="off" :placeholder="userDetailsShow.userDetailsAddr" :class="textForm2"></el-input>
							</el-form-item>
							<el-form-item label="联系邮箱" :label-width="formLabelWidth">
								<el-input v-model="updateUserFrom.userDetailsMail" autocomplete="off" :placeholder="userDetailsShow.userDetailsMail" :class="textForm2"></el-input>
							</el-form-item>
							<el-form-item label="性别" :label-width="formLabelWidth">
								<el-select v-model="updateUserFrom.userDetailsSex" :placeholder="1==userDetailsShow.userDetailsSex?'男':'女' ">
									<el-option label="男" value="1" :disabled="1==userDetailsShow.userDetailsSex ? true:false"></el-option>
									<el-option label="女" value="2" :disabled="2==userDetailsShow.userDetailsSex ? true:false"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="所属商铺" :label-width="formLabelWidth">
								<el-select v-model="updateUserFrom.shopId" :placeholder="userDetailsShow.shopName">
									<el-option :label="shop.shopName" :value="shop.shopId" v-for="shop in allShop" :key="shop" :disabled="shop.shopId==userDetailsShow.shopId ? true:false"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="分配角色" :label-width="formLabelWidth">
								<el-select v-model="updateUserFrom.roleId" :placeholder="userDetailsShow.roleName">
									<el-option :label="role.roleName" :value="role.roleId" v-for="role in roles" :key="role" :disabled="role.roleId==userDetailsShow.roleId ? true:false"></el-option>
								</el-select>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="updateUser">确 定</el-button>
							<el-button type="danger" @click="deleteUser(userDetailsShow.userId)">删 除</el-button>
						</div>
					</el-dialog>	
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		name: 'users',
		data() {
			return {
				shops: {
					label: 'name'
				},
				count: 1,
				input: '',
				queryName: '',
				currentPage4: 1,
				testTag: 'NORMAL',
				normal: '正常',
				stop: '停用',
				shopList: [{
						name: '学府康都店',
						id: '1'
					},
					{
						name: '包头九原店',
						id: '2'
					},
					{
						name: '上海虹桥店',
						id: '3'
					}
				],
				tableData: [],
				userDetails: {},
				total: 0,
				size: 10,
				page: 1,
				dialogFormVisible: false,
				dialogFormVisible2: false,
				form: {
					username: '',
					userDetailsSex: '',
					userDetailsAddr: '',
					userDetailsMail: '',
					userDetailsTel: '',
					shopId: '',
					roleId: ''
				},
				formLabelWidth: '100px',
				dialogWidht: '30%',
				textForm: 'test-form',
				textForm2: 'test-form2',
				roles: [],
				allShop: [],
				updateUserFrom: {
					userDetailsSex: '',
					userDetailsAddr: '',
					userDetailsMail: '',
					shopId: '',
					roleId: ''
				},
				userDetailsShow: {
					username: '',
					userDetailsAddr: '',
					userDetailsMail: '',
					userDetailsSex: 0,
					shopName: '',
					roleName: ''
				}
			}
		},
		methods: {
			handleCheckChange(data) {
				console.log(data.id);
			},
			handleNodeClick(data) {
				console.log(data);
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.page = val
				this.getUserList()
			},
			handleClick(value) {
				console.log(value)
				this.dialogFormVisible2 = true
				this.userDetailsShow = value
			},
			filterTag(value, row) {
				return row.tag === value;
			},
			filterHandler(value, row, column) {
				const property = column['property'];
				return row[property] === value;
			},
			getUserList() {
				axios({
					method: "get",
					url: "/api/user/all/" + this.page + "/" + this.size,
					headers: {
						"Authorization": this.userDetails.token
					}
				}).then(res => {
					console.log(res)
					this.total = res.data.data.total
					this.tableData = res.data.data.records
				}).catch(err => {
					this.$message.error('服务器连接超时 请重试！');
				})
			},
			getUserByName() {
				axios({
					method: "get",
					url: "/api/user/" + this.queryName + "/" + this.page + "/" + this.size,
					headers: {
						"Authorization": this.userDetails.token
					}
				}).then(res => {
					console.log(res)
					this.total = res.data.data.total
					this.tableData = res.data.data.records
				}).catch(err => {
					this.$message.error('服务器连接超时 请重试！');
				})
			},
			clearQuery() {
				this.queryName = ''
				this.getUserList()
			},
			getAllRole() {
				axios({
					method: "get",
					url: "/api/role",
					headers: {
						"Authorization": this.userDetails.token
					}
				}).then(res => {
					console.log(res)
					this.roles = res.data.data
				}).catch(err => {
					this.$message.error('服务器连接超时 请重试！');
				})
			},
			getAllShop() {
				axios({
					method: "get",
					url: "/api/shop",
					headers: {
						"Authorization": this.userDetails.token
					}
				}).then(res => {
					console.log(res)
					this.allShop = res.data.data
				}).catch(err => {
					this.$message.error('服务器连接超时 请重试！');
				})
			},
			stopUser(value) {
				console.log(value)
				axios({
					method: "put",
					url: "/api/user/stop/" + value,
					headers: {
						"Authorization": this.userDetails.token
					}
				}).then(res => {
					console.log(res)
					this.getUserList()
				}).catch(err => {
					this.$message.error('服务器连接超时 请重试！');
				})
			},
			startUser(value) {
				console.log(value)
				axios({
					method: "put",
					url: "/api/user/start/" + value,
					headers: {
						"Authorization": this.userDetails.token
					}
				}).then(res => {
					console.log(res)
					this.getUserList()
				}).catch(err => {
					this.$message.error('服务器连接超时 请重试！');
				})
			},
			updateUser() {
				console.log(this.form)
				let formData = new FormData();
				for (var key in this.updateUserFrom) {
					formData.append(key, this.updateUserFrom[key])
				}
				formData.append("userId",this.userDetailsShow.userId);
				axios({
					method: "put",
					url: "/api/user/",
					headers: {
						"Authorization": this.userDetails.token,
						"Content-Type": "multipart/form-data"
					},
					data: formData
				}).then(res => {
					console.log(res)
					// this.getUserList()
				}).catch(err => {
					this.$message.error('服务器连接超时 请重试！');
				})
			},
			deleteUser(value) {
				console.log(value)
				axios({
					method: "delete",
					url: "/api/user/" + value,
					headers: {
						"Authorization": this.userDetails.token
					}
				}).then(res => {
					console.log(res)
					// this.getUserList()
				}).catch(err => {
					this.$message.error('服务器连接超时 请重试！');
				})
			},
			insertUser() {
				console.log(this.form)
				let formData = new FormData();
				for (var key in this.form) {
					formData.append(key, this.form[key])
				}
				axios({
					method: "post",
					url: "/api/user/",
					headers: {
						"Authorization": this.userDetails.token,
						"Content-Type": "multipart/form-data"
					},
					data: formData
				}).then(res => {
					console.log(res)
					if (res.data.status == 200) {
						this.$message({
							message: '新增用户成功',
							type: 'success'
						});
						this.dialogFormVisible = false
						this.getUserList()
					} else {
						this.$message.error('新增用户错误：' + res.data.msg + ',请重试');
					}
				}).catch(err => {
					this.$message.error('服务器连接超时 请重试！');
				})
			}
		},
		created() {
			this.userDetails = JSON.parse(localStorage.getItem("user-information"));
			this.getUserList()
			this.getAllRole()
			this.getAllShop()
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

	#users {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		>div {
			width: 98%;
			height: 98%;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: white;

			.users-left {
				width: 20%;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;

				>div:nth-of-type(1) {
					margin-top: 20px;
					width: 90%;
				}

				>div:nth-of-type(2) {
					margin-top: 20px;
					width: 90%;
				}
			}

			.users-right {
				width: 80%;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;

				>div:nth-of-type(1) {
					margin-top: 20px;
					width: 95%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-left: 20px;

					>div:nth-of-type(1) {
						width: 80%;

						.el-input {
							width: 25%;
						}
					}
				}

				>div:nth-of-type(2) {
					margin-top: 20px;
					width: 95%;
					display: flex;
					align-items: center;
					padding-left: 20px;
				}

				>div:nth-of-type(3) {
					width: 95%;
					margin-top: 20px;
				}

				>div:nth-of-type(4) {
					.el-form-item {
						margin-bottom: 10px !important;
					}

					.test-form {
						width: 80% !important;
					}
				}
				
				>div:nth-of-type(5) {
					.el-form-item {
						margin-bottom: 10px !important;
					}
				
					.test-form2 {
						width: 75% !important;
						padding-right: 0px !important;
					}
					
					.el-input__inner{
						padding-right: 0px !important;
					}
				}
			}
		}
	}
</style>
