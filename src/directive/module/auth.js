import store from '@/store'
import router from '@/router'
export default {
    inserted: function (el, binding, vnode) {
        let url = '';
        if (typeof binding.value === 'string' && binding.value.length > 0) {
            //设置了字符串且不为空
            url = binding.value;
        } else {
            if (typeof vnode.componentOptions.propsData.to === 'undefined') {
                //没有设置跳转，不处理
                return;
            }
            //获取跳转的路由path
            let route = router.resolve(vnode.componentOptions.propsData.to);
            url = route.route.path;

            url = url.trim('/');
            if (url.length <= 0) {
                //url为空，不处理
                return;
            }
            if (url.indexOf('/') < 0) {
                //如果没有action，拼上index
                url += '/index';
            }
        }

        url = url.toLowerCase();

        store.dispatch('getAuthList').then(res => {
            //获取权限列表
            if (res.super) {
                //超级管理员不验证权限
                return;
            }
            if (res.auth.indexOf(url) < 0) {
                //如果没有权限，移除这个元素
                el.parentNode && el.parentNode.removeChild(el)
            }
        });
    }
};