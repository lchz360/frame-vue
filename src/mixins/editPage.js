import { mapMutations } from "vuex";
import { objEqual } from '../libs/tools'
export default {
    data() {
        return {
            formLoading: false,
            routeName: '',
            routeQuery: null
        };
    },
    activated() {
        if (this.routeQuery == null || !objEqual(this.routeQuery, this.$route.query)) {
            this.getData();
            this.routeName = this.$route.name;
            this.routeQuery = this.$route.query
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
        ...mapMutations(["closeTag"]),
        getData() {
            this.$axios
                .get(this.editUrl, {
                    id: this.$route.query.id
                })
                .then(res => {
                    if (res.code == 1) {
                        this.formData = res.data.data;
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
        },
        save() {
            this.formLoading = true;
            this.$axios.post(this.editUrl, this.formData).then(res => {
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