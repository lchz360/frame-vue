<template>
  <div>
    <Form :model="searchData" inline @submit.native.prevent="getData(1)" :label-width="80">
      <FormItem label="角色名称">
        <Input v-model="searchData.title" />
      </FormItem>
      <Row>
        <Col span="12">
          <Button icon="ios-add" v-auth to="/auth_group/add">添加</Button>
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
      <template slot-scope="{ row }" slot="action">
        <Button type="primary" size="small" v-auth :to="'/auth_group/edit?id='+row.id">编辑</Button>
        <Poptip
          v-auth="'auth_group/delete'"
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
        { title: "", key: "id", width: 50 },
        { title: "角色名称", key: "title" },
        { title: "操作", slot: "action", width: 150, align: "center" }
      ],
      indexUrl: "/admin/auth_group/index",
      deleteUrl: "/admin/auth_group/delete"
    };
  },
  mixins: [indexPage]
};
</script>