import { mapMutations } from "vuex";
export default {
    data() {
        return {
            formLoading: false,
            routeName: '',
            addUrl: ''
        };
    },
    activated() {
        this.routeName = this.$route.name;
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
        save() {
            this.formLoading = true;
            this.$axios.post(this.addUrl, this.formData).then(res => {
                this.formLoading = false;
                if (res.code == 1) {
                    this.$Message.success("操作成功");
                    this.closeTag(this.$route);
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
    }
};