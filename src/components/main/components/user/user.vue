<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Avatar>{{userAvator}}</Avatar>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="message">
          消息中心
          <Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import "./user.less";
import { mapMutations } from "vuex";
export default {
  name: "User",
  props: {
    userAvator: {
      type: String,
      default: ""
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapMutations(["setToken","setAuthList"]),
    logout() {
      this.$axios.get("/admin/login/logout").then(res => {
        if (res.code == 0) {
          this.$Message.error(res.msg);
        } else {
          this.setToken('');
          this.setAuthList([]);
          this.$router.replace({ name: "Login" });
        }
      });
    },
    message() {
      // this.$router.push({
      //   name: "message_page"
      // });
    },
    handleClick(name) {
      switch (name) {
        case "logout":
          this.logout();
          break;
        case "message":
          this.message();
          break;
      }
    }
  }
};
</script>
