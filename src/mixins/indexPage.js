import clone from "clone";
const indexPage = {
    data() {
        return {
            searchData: {},
            tableLoading: false,
            indexUrl: '',
            deleteUrl: '',
            tableData: {
                total: 0,
                per_page: 0,
                current_page: 1,
                last_page: 1,
                data: []
            },
            routeName: ''
        }
    },
    watch: {
        navList(value) {
            const res = value.some(item => item.name == this.routeName);
            if (!res) {
                this.$destroy();
            }
        }
    },
    computed: {
        navList() {
            return this.$store.state.app.tagNavList;
        }
    },
    methods: {
        getData(page) {
            if (this.indexUrl.length <= 0) {
                return;
            }
            this.tableLoading = true;
            let data = clone(this.searchData);
            data.page = page;
            this.$axios.get(this.indexUrl, data).then(res => {
                this.tableData = res.data;
                this.tableLoading = false;
            });
        },
        reload() {
            let page = Math.ceil(this.tableData.total / this.tableData.per_page);
            if (page >= this.tableData.current_page) {
                page = this.tableData.current_page;
            }
            this.getData(page);
        },
        remove(id) {
            if (this.deleteUrl.length <= 0) {
                return;
            }
            this.$axios.get(this.deleteUrl, {
                id: id,
            }).then(res => {
                this.$Modal.remove();
                if (res.code == 1) {
                    this.$Message.info("删除成功");
                    this.tableData.total--;
                    this.reload();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        }
    },
    activated() {
        this.getData(this.tableData.current_page);
        this.routeName = this.$route.name;
    }
}
export default indexPage