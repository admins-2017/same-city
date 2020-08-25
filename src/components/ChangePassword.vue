<template>
	<div id="changePasswrod">
		<ul class="change-ul">
			<li>
				<span>原始密码:</span>
				<el-input placeholder="请输入密码" v-model="userPass.oldPassword" show-password></el-input>
			</li>
			<li>
				<span>新密码:</span>
				<el-input placeholder="请输入密码" v-model="userPass.newPassword" show-password></el-input>
			</li>
			<li>
				<span>确认密码:</span>
				<el-input placeholder="请输入密码" v-model="userPass.verifyPass" show-password></el-input>
			</li>
			<li>
				<div class="change-ul-bottom">

					<el-button slot="reference" type="success" @click="verify" circle>
						提交
					</el-button>
					<el-button slot="reference" type="info" @click="cancel" circle>
						取消
					</el-button>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		name: 'changePassword',
		data() {
			return {
				userPass: {
					oldPassword: '',
					newPassword: '',
					verifyPass: ''
				},
				userDetail: {}
			}
		},
		methods: {
			changePass() {
				let formData = new FormData();
				for (var key in this.userPass) {
					formData.append(key, this.userPass[key])
				}
				axios({
					method: "put",
					url: "/api/detail/pass",
					headers: {
						"Authorization": this.userDetail.token,
						"Content-Type": "multipart/form-data"
					},
					data: formData
				}).then(res => {
					if(res.data.status == 200){
						this.$message({
						          message: '密码已修改',
						          type: 'success'
						        });
						this.cancel()
					}else {
						this.$message.error('修改密码失败 请重试');
					}
				}).catch(err => {
					this.$message.error('原始密码错误 请重试');
					// this.$router.go(0);
				})
			},
			verify(){
				if(this.userPass.oldPassword == this.userPass.newPassword){
					this.$message.error('新密码和旧密码不能相同');
				}
				if (this.userPass.newPassword != this.userPass.verifyPass){
					this.$message.error('俩次密码不相同');
				}else{
					this.changePass()
				}
			},
			cancel(){
				this.userPass.oldPassword = ''
				this.userPass.newPassword = ''
				this.userPass.verifyPass = ''	
			}
		},
		created() {
			this.userDetail = JSON.parse(localStorage.getItem("user-information"));
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

	}

	#changePasswrod {
		width: 80%;
		height: 80%;
		display: flex;
		justify-content: center;
		align-items: center;

		.change-ul {
			list-style: none;
			padding: 0px;
			width: 100%;

			>li {
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 20px 0px;

				>span {
					width: 15%;
					margin: 10px;
				}

				.el-input {
					width: 60%;
				}

				.change-ul-bottom {
					margin-top: 30px;
					width: 40%;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
			}
		}
	}
</style>
