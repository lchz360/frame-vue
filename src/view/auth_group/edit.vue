<template>
  <div>
    <Form :model="formData" @submit.native.prevent="save" :label-width="80">
      <FormItem label="角色名称">
        <Input v-model="formData.title" />
      </FormItem>
      <FormItem label="选择权限">
        <Tree :data="authList" ref="authTree" show-checkbox check-directly></Tree>
      </FormItem>

      <FormItem>
        <Button type="primary" html-type="submit" :loading="formLoading">保存</Button>
        <Button @click="$router.go(-1);" style="margin-left:10px;">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import editPage from "../../mixins/editPage";
export default {
  data() {
    return {
      formData: { title: "", rules: "" },
      formLoading: false,
      authList: []
    };
  },
  mixins: [editPage],
  methods: {
    getData() {
      this.$axios
        .get("/admin/auth_group/edit", {
          id: this.$route.query.id
        })
        .then(res => {
          if (res.code == 1) {
            this.formData = res.data.data;
            this.$axios.get("/admin/auth_rule/getAll").then(res => {
              if (res.code == 1) {
                this.dealCheck(res.data, this.formData.rules);
                this.authList = res.data;
              }
            });
          } else {
            this.$Message.error(res.msg);
          }
        });
    },
    dealCheck(items, checked) {
      items.forEach(item => {
        if (checked.indexOf(item.id + "") >= 0) {
          item.checked = true;
        }
        if (typeof item.children === "object") {
          this.dealCheck(item.children, checked);
        }
      });
    },
    save() {
      const selected = this.$refs.authTree.getCheckedAndIndeterminateNodes();
      let ids = [];
      selected.forEach(item => {
        ids.push(item.id);
      });
      this.formData.rules = ids;
      this.formLoading = true;
      this.$axios.post("/admin/auth_group/edit", this.formData).then(res => {
        this.formLoading = false;
        if (res.code == 1) {
          this.$Message.success("操作成功");
          this.closeTag(this.$route);
        } else {
          this.$Message.error(res.msg);
        }
      });
    }
  }
};
</script>