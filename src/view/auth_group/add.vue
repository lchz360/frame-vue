<template>
  <div>
    <Form :model="formData" @submit.native.prevent="save" :label-width="80">
      <FormItem label="角色名称">
        <Input v-model="formData.title" />
      </FormItem>
      <FormItem label="选择权限">
        <Tree
          :data="authList"
          ref="authTree"
          check-directly
          show-checkbox
        ></Tree>
      </FormItem>

      <FormItem>
        <Button type="primary" html-type="submit" :loading="formLoading">保存</Button>
        <Button @click="$router.go(-1);" style="margin-left:10px;">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      formData: { title: "", rules: "" },
      formLoading: false,
      authList: []
    };
  },
  created() {
    this.$axios.get("/admin/auth_rule/getAll").then(res => {
      if (res.code == 1) {
        this.authList = res.data;
      }
    });
  },
  methods: {
    ...mapMutations(["closeTag"]),
    save() {
      const selected = this.$refs.authTree.getCheckedAndIndeterminateNodes();
      let ids = [];
      selected.forEach(item => {
        ids.push(item.id);
      });
      this.formData.rules = ids;
      this.formLoading = true;
      this.$axios.post("/admin/auth_group/add").then(
        res => {
          this.formLoading = false;
          if (res.code == 1) {
            this.$Message.success("操作成功");
            this.closeTag(this.$route);
          } else {
            this.$Message.error(res.msg);
          }
        }
      );
    }
  }
};
</script>