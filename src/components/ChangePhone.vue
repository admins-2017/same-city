<template>
	<div id="changePhone">
		<ul>
			<li v-if="veriftOldlPhone">
				<div class="phone-verify">
					<el-input placeholder="原始手机号" v-model="originalPhone" clearable>
					</el-input>
					<el-button type="info" icon="el-icon-chat-line-round" @click="veriftOriginalPhone" plain>发送验证码</el-button>
				</div>
				<div class="verify-code">
					<el-input placeholder="验证码" v-model="originalCode" clearable>
					</el-input>
					<el-button type="info" icon="el-icon-question" @click="verfiCode" plain>验证</el-button>
				</div>
			</li>
			<li v-if="veriftNewsPhone">
				<div class="phone-verify">
					<el-input placeholder="新手机号" v-model="newPhone" clearable>
					</el-input>
					<el-button type="info" icon="el-icon-chat-line-round" @click="veriftNewPhone" plain>发送验证码</el-button>
				</div>
				<div class="verify-code">
					<el-input placeholder="验证码" v-model="newCode" clearable>
					</el-input>
					<el-button type="info" icon="el-icon-question" @click="verfiNewCode" plain>验证</el-button>
				</div>
			</li>
			<li v-if="updatePhone">
				<div class="verify-button">
					<el-button type="success" icon="el-icon-edit-outline" @click="changePhoneNumber" plain>修改手机号</el-button>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		name: 'changePhone',
		data() {
			return {
				veriftOldlPhone: true,
				veriftNewsPhone: false,
				updatePhone: false,
				originalPhone: '',
				newPhone: '',
				originalCode: '',
				newCode: '',
				originalResult: '',
				newResult: ''
			}
		},
		methods:{
			veriftOriginalPhone(){
				axios({
					method: "get",
					url: "/api/detail/original/"+this.originalPhone,
					headers: {
						"Authorization":this.userDetail.token
					}
				}).then(res => {
					console.log(res)
					this.$message({
					          message: res.data.msg,
					          type: 'success'
					        });
					this.originalResult = res.data.data.uuid
				}).catch(err => {
					this.$message.error('服务器连接超时 请重试！');
				})
			},
			veriftNewPhone(){
				axios({
					method: "get",
					url: "/api/detail/new/"+this.newPhone,
					headers: {
						"Authorization":this.userDetail.token
					}
				}).then(res => {
					console.log(res)
					this.$message({
					          message: res.data.msg,
					          type: 'success'
					        });
					this.newResult = res.data.data.uuid
				}).catch(err => {
					this.$message.error('服务器连接超时 请重试！');
				})
			},
			verfiCode(){
				axios({
					method: "get",
					url: "/api/detail/verify/code",
					headers: {
						"Authorization":this.userDetail.token
					},
					params: {
						uuid: this.originalResult,
						code: this.originalCode
					}
				}).then(res => {
					console.log(res)
						if(res.data.status == 200){
							this.$message({
							          message: res.data.data,
							          type: 'success'
							        });
							this.veriftOldlPhone = false
							this.veriftNewsPhone =true
						}else {
							this.$message.error(res.data.msg);
						}
						
				}).catch(err => {
					this.$message.error('服务器连接超时 请重试！');
				})
			},
			verfiNewCode(){
				axios({
					method: "get",
					url: "/api/detail/verify/code",
					headers: {
						"Authorization":this.userDetail.token
					},
					params: {
						uuid: this.newResult,
						code: this.newCode
					}
				}).then(res => {
					console.log(res)
						if(res.data.status == 200){
							this.$message({
							          message: res.data.data,
							          type: 'success'
							        });
							this.veriftNewsPhone = false
							this.updatePhone =true
						}else {
							this.$message.error(res.data.msg);
						}
						
				}).catch(err => {
					this.$message.error('服务器连接超时 请重试！');
				})
			},
			changePhoneNumber(){
				axios({
					method: "post",
					url: "/api/detail/change/phone/"+this.newPhone,
					headers: {
						"Authorization":this.userDetail.token
					}
				}).then(res => {
					console.log(res)
					this.$message({
					          message: res.data.data,
					          type: 'success'
					        });
						this.updatePhone =false
						this.veriftOldlPhone =true	
				}).catch(err => {
					this.$message.error('服务器连接超时 请重试！');
					// this.$router.go(0);
				})
			}
		},
		created() {
			this.userDetail = JSON.parse(localStorage.getItem("user-information"));
		}
	}
</script>

<style lang="less">
	html,body {
		width: 100%;
		height: 100%;
		margin: 0px;
		padding: 0px;
	}
	#changePhone {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		> ul {
			width: 90%;
			padding: 0px;
			list-style: none;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			> li {
				width: 80%;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				.phone-verify {
					width: 80%;
					display: flex;
					justify-content: center;
					align-items: center;
					margin: 10px 0px;
					.el-input {
						width: 100%;
						margin-right: 10px;
					}
				}
				.verify-code {
					width: 80%;
					display: flex;
					justify-content: center;
					align-items: center;
					margin: 10px 0px;
					.el-input {
						margin-right: 10px;
					}
					.el-button {
						width: 54%;
					}
				}
				.verify-button{
					width: 80%;
					.el-button {
						width: 100%;
					}
				}
			}
		}
	}
</style>
