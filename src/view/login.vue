<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions, mapMutations } from "vuex";
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(["getUserInfo", "getAuthList"]),
    ...mapMutations(["setToken", "setUserInfo"]),
    handleSubmit({ userName, password }) {
      this.$axios
        .post("/admin/login/login.html", {
          username: userName,
          password: password
        })
        .then(res => {
          if (res.code == 1) {
            this.setToken(res.data.token);
            this.setUserInfo(res.data);
            this.getAuthList({ reload: true });
            this.$router.replace({
              name: this.$config.homeName
            });
          } else {
            this.$Message.error(res.msg);
          }
        });
    }
  }
};
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/login-bg.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
  &-con {
    position: absolute;
    right: 160px;
    top: 50%;
    transform: translateY(-60%);
    width: 300px;
    &-header {
      font-size: 16px;
      font-weight: 300;
      text-align: center;
      padding: 30px 0;
    }
    .form-con {
      padding: 10px 0 0;
    }
    .login-tip {
      font-size: 10px;
      text-align: center;
      color: #c3c3c3;
    }
  }
}
</style>
