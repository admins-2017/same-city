<template>
	<div id="roles">
		<div>
			<div>
				<div>
					<el-input placeholder="请输入角色名" prefix-icon="el-icon-search" v-model="queryName"></el-input>
					<el-button type="primary" plain @click="getRoleByName">查询</el-button>
					<el-button type="primary" plain @click="clearQuery">取消</el-button>
				</div>
				<el-button type="primary" plain @click="insertDialogFormVisible = true">新增用户</el-button>
			</div>
			<div>
				<el-table :data="tableData" border style="width: 100%">
					<el-table-column fixed prop="roleId" label="角色id" width="170"></el-table-column>
					<el-table-column prop="roleName" label="角色名称" width="170"></el-table-column>
					<el-table-column prop="roleDescription" label="角色简介"></el-table-column>
					<el-table-column prop="roleCode" label="角色编码" width="180"></el-table-column>
					<el-table-column label="默认角色" width="100" prop="defaultRole">
						<template slot-scope="scope">
							<el-tag type="success" v-if="scope.row.defaultRole">默认角色</el-tag>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="150">
						<template slot-scope="scope">
							<el-button @click="updateRole(scope.row)" type="text" size="small">编辑</el-button>
							<el-button type="text" size="small" @click="delRoleById(scope.row.roleId)" v-if="!scope.row.defaultRole">删除</el-button>
							<el-button @click="updateDefaultRole(scope.row.roleId)" type="text" size="small" v-if="!scope.row.defaultRole">设为默认</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div>
				<el-pagination @current-change="handleCurrentChange" :page-size="size" layout="total, prev, pager, next, jumper"
				 :total="total"></el-pagination>
			</div>
			<div>
				<el-dialog title="新增角色" :visible.sync="insertDialogFormVisible" :width="dialogWidht" center>
					<div class="insert-role-from">
						<div>
							<el-input v-model="insertForm.roleName" prefix-icon="el-icon-user-solid" placeholder="请输入角色名称"></el-input>
							<el-input v-model="insertForm.roleCode" prefix-icon="el-icon-info" placeholder="请输入角色编码(请勿输入汉字)"></el-input>
							<el-input v-model="insertForm.roleDescription" prefix-icon="el-icon-document" placeholder="请输入角色简介"></el-input>
						</div>
						<div>
							<span>权限列表</span>
							<el-tree :data="treeData" show-checkbox node-key="menuId" ref="tree" :props="defaultProps"></el-tree>
							<!-- <el-button @click="getCheckedKeys">通过 key 获取</el-button> -->
						</div>
					</div>
					<div slot="footer" class="dialog-footer">
						<el-button @click="insertDialogFormVisible = false">取 消</el-button>
						<el-button type="primary" @click="insertNewRole">确 定</el-button>
					</div>
				</el-dialog>
			</div>
			<div>
				<el-dialog title="角色详情" :visible.sync="updateDialogFormVisible" :width="dialogWidht" center>
					<div class="update-role-from">
						<div>
							<!-- <el-input v-model="updateForm.roleId" :placeholder="'角色id: ' +roleDetails.roleId" disabled></el-input> -->
							<el-input v-model="updateForm.roleName" prefix-icon="el-icon-user-solid" :placeholder="roleDetails.roleName"></el-input>
							<el-input v-model="updateForm.roleCode" prefix-icon="el-icon-info" :placeholder="roleDetails.roleCode"></el-input>
							<el-input v-model="updateForm.roleDescription" prefix-icon="el-icon-document" :placeholder="roleDetails.roleDescription"></el-input>
						</div>
						<div>
							<span>权限列表</span>
							<el-tree :data="treeData" show-checkbox node-key="menuId" ref="tree" :default-checked-keys="roleMenuList" :props="defaultProps"></el-tree>
							<!-- <el-button @click="getCheckedKeys">通过 key 获取</el-button> -->
						</div>
					</div>
					<div slot="footer" class="dialog-footer">
						<el-button @click="cancelUpdateDialog">取 消</el-button>
						<el-button type="primary" @click= "updateRoleDetails(roleDetails.roleId)">确 定</el-button>
					</div>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from "axios";
	export default {
		name: "roles",
		data() {
			return {
				tableData: [],
				userDetails: {},
				buttonClass: "operating-class",
				page: 1,
				size: 10,
				total: 0,
				queryName: "",
				updateDialogFormVisible: false,
				insertDialogFormVisible: false,
				dialogWidht: "30%",
				formLabelWidth: "100px",
				insertForm: {
					roleName: "",
					roleDescription: "",
					roleCode: "",
				},
				updateForm: {
					roleName: "",
					roleDescription: "",
					roleCode: "",
				},
				roleDetailsClass: "role-details-class",
				treeData: [],
				defaultProps: {
					children: "children",
					label: "name",
				},
				roleDetails: {},
				roleMenuList: [],
			};
		},
		methods: {
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.page = val;
				this.getAllRole();
			},
			getAllRole() {
				axios({
						method: "get",
						url: "/api/role/" + this.page + "/" + this.size,
						headers: {
							Authorization: this.userDetails.token,
						},
					})
					.then((res) => {
						console.log(res);
						this.total = res.data.data.total;
						this.tableData = res.data.data.records;
					})
					.catch((err) => {
						console.log(err);
						this.$message.error("服务器连接超时 请重试！");
					});
			},
			getRoleByName() {
				axios({
						method: "get",
						url: "/api/role/like/" +
							this.queryName +
							"/" +
							this.page +
							"/" +
							this.size,
						headers: {
							Authorization: this.userDetails.token,
						},
					})
					.then((res) => {
						console.log(res);
						this.total = res.data.data.total;
						this.tableData = res.data.data.records;
					})
					.catch((err) => {
						console.log(err);
						this.$message.error("服务器连接超时 请重试！");
					});
			},
			clearQuery() {
				this.queryName = "";
				this.getAllRole();
			},
			delRoleById(value) {
				console.log(value);
				axios({
						method: "delete",
						url: "/api/role/" + value,
						headers: {
							Authorization: this.userDetails.token,
						},
					})
					.then((res) => {
						console.log(res);
						if (res.data.status == 200) {
							this.$message({
								message: res.data.data,
								type: "success",
							});
							this.getAllRole();
						} else {
							this.$message.error("删除角色出错 请重试！");
						}
					})
					.catch((err) => {
						console.log(err);
						this.$message.error("服务器连接超时 请重试！");
					});
			},
			handleClick(value) {
				console.log(value);
			},
			updateRole(value) {
				this.updateDialogFormVisible = true;
				this.roleDetails = value
				console.log(value);
				this.getMenuByRole(value.roleId);
			},
			updateDefaultRole(value) {
				console.log(value);
				axios({
						method: "put",
						url: "/api/role/default/" + value,
						headers: {
							Authorization: this.userDetails.token,
						},
					})
					.then((res) => {
						console.log(res);
						if (res.data.status == 200) {
							this.$message({
								message: res.data.data,
								type: "success",
							});
							this.getAllRole();
						} else {
							this.$message.error("修改默认角色出错 请重试！");
						}
					})
					.catch((err) => {
						console.log(err);
						this.$message.error("服务器连接超时 请重试！");
					});
			},
			getMenuTree() {
				axios({
						method: "get",
						url: "/api/menu/all",
						headers: {
							Authorization: this.userDetails.token,
						},
					})
					.then((res) => {
						console.log(res);
						if (res.data.status == 200) {
							this.treeData = res.data.data;
						} else {
							this.$message.error("获取权限列表失败 请重试！");
						}
					})
					.catch((err) => {
						console.log(err);
						this.$message.error("服务器连接超时 请重试！");
					});
			},
			getCheckedKeys() {
				this.insertForm.menuList = this.$refs.tree.getCheckedKeys();
				console.log(this.checkMenu);
			},
			getMenuByRole(value) {
				axios({
					method: "get",
					url: "/api/menu/role/" + value,
					headers: {
						"Authorization": this.userDetails.token
					}
				}).then(res => {
					if (res.data.status) {
						this.roleMenuList = res.data.data
						console.log(this.roleMenuList)
					} else {
						this.$message.error(res.data.msg);
					}
				}).catch(err => {
					console.log(err)
					this.$message.error('服务器连接超时 请重试！');
				})
			},
			insertNewRole() {
				let formData = new FormData();
				for (var key in this.insertForm) {
					formData.append(key, this.insertForm[key]);
				}
				console.log(this.$refs.tree.getCheckedKeys())
				formData.append("menuList", this.$refs.tree.getCheckedKeys());
				axios({
						method: "post",
						url: "/api/role/",
						headers: {
							Authorization: this.userDetails.token,
							"Content-Type": "multipart/form-data",
						},
						data: formData,
					})
					.then((res) => {
						if (res.data.status == 200) {
						  this.$message({
						    message: res.data.data,
						    type: "success",
						  });
						  this.insertForm = {
						    roleName: "",
						    roleCode: "",
						    roleDescription: "",
						  };
						  this.insertDialogFormVisible = false;
						  this.$refs.tree.setCheckedKeys([])
						  this.getAllRole();
						} else {
						  this.$message.error("删除失败 请重试！");
						}
						console.log(res)
					})
					.catch((err) => {
						console.log(err);
						this.$message.error("服务器连接超时 请重试！");
					});
			},
			updateRoleDetails(val){
				console.log(val)
				let formData = new FormData();
				formData.append("roleId", val);
				for (var key in this.updateForm) {
					formData.append(key, this.updateForm[key]);
				}
				console.log()
				console.log(this.$refs.tree.getCheckedKeys())
				if(this.$refs.tree.getCheckedKeys().length!=0){
					formData.append("menuList", this.$refs.tree.getCheckedKeys());
				}
				axios({
						method: "put",
						url: "/api/role/",
						headers: {
							Authorization: this.userDetails.token,
							"Content-Type": "multipart/form-data",
						},
						data: formData,
					})
					.then((res) => {
						console.log(res)
						if (res.data.status == 200) {
						  this.$message({
						    message: res.data.data,
						    type: "success",
						  });
						  this.updateForm = {
						    roleName: "",
						    roleCode: "",
						    roleDescription: "",
						  };
						  this.updateDialogFormVisible = false;
						  this.$refs.tree.setCheckedKeys([])
						  this.getAllRole();
						} else {
						  this.$message.error("删除失败 请重试！");
						}
					})
					.catch((err) => {
						console.log(err);
						this.$message.error("服务器连接超时 请重试！");
					});
			},
			cancelUpdateDialog(){
				this.updateDialogFormVisible = false
				// this.roleMenuList = []
				this.$refs.tree.setCheckedKeys([])
				console.log(this.roleMenuList)
			}
		},
		created() {
			this.userDetails = JSON.parse(localStorage.getItem("user-information"));
			this.getAllRole();
			this.getMenuTree();
		},
	};
</script>

<style lang="less">
	html,
	body {
		width: 100%;
		height: 100%;
		margin: 0px;
		padding: 0px;
	}

	#roles {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		>div {
			width: 98%;
			height: 98%;
			background-color: white;
			display: flex;
			flex-direction: column;
			align-items: center;

			>div:nth-of-type(1) {
				width: 94%;
				margin-top: 20px;
				padding: 0px 20px;
				display: flex;
				justify-content: space-between;

				>div:nth-of-type(1) {
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}

			>div:nth-of-type(2) {
				margin-top: 20px;
				width: 94%;
			}

			>div:nth-of-type(3) {
				margin-top: 30px;
				width: 94%;
			}

			>div:nth-of-type(4) {
				background-color: whitesmoke;

				.el-dialog {
					.el-dialog__body {
						.insert-role-from {
							display: flex;
							flex-direction: column;

							>div:nth-of-type(1) {
								display: flex;
								justify-content: center;
								flex-direction: column;
								align-items: center;

								.el-input {
									width: 70%;
									margin: 10px 0px;
								}
							}

							>div:nth-of-type(2) {
								margin-top: 10px;
								display: flex;
								justify-content: center;
								flex-direction: column;
								align-items: center;

								>span {
									color: rgba(42, 116, 161, 0.493);
									font-size: 20px;
									margin-bottom: 10px;
								}

								.el-tree {
									width: 70%;
								}
							}
						}
					}
				}
			}

			>div:nth-of-type(5) {
				background-color: whitesmoke;

				.el-dialog {
					.el-dialog__body {
						.update-role-from {
							display: flex;
							flex-direction: column;

							>div:nth-of-type(1) {
								display: flex;
								justify-content: center;
								flex-direction: column;
								align-items: center;

								.el-input {
									width: 70%;
									margin: 10px 0px;
								}
							}

							>div:nth-of-type(2) {
								margin-top: 10px;
								display: flex;
								justify-content: center;
								flex-direction: column;
								align-items: center;

								>span {
									color: rgba(42, 116, 161, 0.493);
									font-size: 20px;
									margin-bottom: 10px;
								}

								.el-tree {
									width: 70%;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
