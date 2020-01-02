<template>
  <div>
    <Form :model="searchData" inline @submit.native.prevent="getData(1)" :label-width="80">
      <FormItem label="账号">
        <Input v-model="searchData.account" />
      </FormItem>
      <Row>
        <Col span="12">
          <Button icon="ios-add" v-auth to="/admin/add">添加</Button>
        </Col>
        <Col span="12">
          <div style="text-align:right">
            <Button type="primary" icon="ios-search" html-type="submit">搜索</Button>
          </div>
        </Col>
      </Row>
    </Form>
    <Table
      :columns="tableColumns"
      :data="tableData.data"
      :loading="tableLoading"
      style="margin-top:20px;"
    >
      <template slot-scope="{row}" slot="groupName">
        <span v-for="item in row.authgroup" :key="item.id" class="group-name">{{item.title}}</span>
      </template>
      <template slot-scope="{row}" slot="disable">{{row.is_disable==1?'禁用':'正常'}}</template>
      <template slot-scope="{ row }" slot="action">
        <Button type="primary" size="small" v-auth :to="'/admin/edit?id='+row.id">编辑</Button>
        <Button
          type="warning"
          size="small"
          v-if="row.is_disable==1"
          v-auth="'admin/enable'"
          @click="enable(row.id)"
        >启用</Button>
        <Button
          type="warning"
          size="small"
          v-else
          v-auth="'admin/disable'"
          @click="disable(row.id)"
        >禁用</Button>
        <Poptip
          v-auth="'admin/delete'"
          transfer
          confirm
          title="您确定要删除这条数据吗？"
          @on-ok="remove(row.id)"
          style="margin-left:5px"
        >
          <Button type="error" size="small">删除</Button>
        </Poptip>
      </template>
    </Table>
    <Page
      style="text-align:right;margin-top:20px"
      :total="tableData.total"
      :page-size="tableData.per_page"
      :current="tableData.current_page"
      show-total
      @on-change="getData"
    />
  </div>
</template>
<script>
import indexPage from "../../mixins/indexPage";
export default {
  data() {
    return {
      tableColumns: [
        { title: "ID", key: "id" },
        { title: "账号", key: "account" },
        { title: "名称", key: "name" },
        { title: "角色", key: "groupName", slot: "groupName" },
        { title: "状态", key: "is_disable", slot: "disable" },
        { title: "创建日期", key: "create_time" },
        { title: "操作", slot: "action", width: 180, align: "center" }
      ],
      indexUrl: "/admin/admin/index",
      deleteUrl: "/admin/admin/delete"
    };
  },
  mixins: [indexPage],
  methods: {
    enable(id) {
      this.$axios.put("/admin/admin/enable", { id: id }).then(res => {
        if (res.code == 1) {
          this.reload();
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    disable(id) {
      this.$axios.put("/admin/admin/disable", { id: id }).then(res => {
        if (res.code == 1) {
          this.reload();
        } else {
          this.$Message.error(res.msg);
        }
      });
    }
  }
};
</script>
<style scoped>
.group-name:nth-child(n + 2)::before {
  content: " / ";
}
</style>