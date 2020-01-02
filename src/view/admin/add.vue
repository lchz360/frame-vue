<template>
  <div>
    <Form :model="formData" @submit.native.prevent="save" :label-width="80">
      <FormItem label="账号">
        <Input v-model="formData.account" />
      </FormItem>
      <FormItem label="密码">
        <Input v-model="formData.password" type="password" />
      </FormItem>
      <FormItem label="名称">
        <Input v-model="formData.name" />
      </FormItem>
      <FormItem label="是否禁用">
        <Select v-model="formData.is_disable">
          <Option
            v-for="item in is_disableList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="角色">
        <Select v-model="formData.group_id" multiple>
          <Option v-for="item in groupList" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
      </FormItem>

      <FormItem>
        <Button type="primary" html-type="submit" :loading="formLoading">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import addPage from "../../mixins/addPage";
export default {
  data() {
    return {
      formData: {
        account: "",
        password: "",
        name: "",
        is_disable: "",
        group_id: []
      },
      formLoading: false,
      is_disableList: [
        { value: 1, label: "禁用" },
        { value: 2, label: "正常" }
      ],
      groupList: [],
      addUrl: "/admin/admin/add"
    };
  },
  mixins: [addPage],
  created() {
    this.$axios.get("/admin/auth_group/getAll").then(res => {
      if (res.code == 1) {
        this.groupList = res.data;
      } else {
        this.$Message.error(res.msg);
      }
    });
  }
};
</script>