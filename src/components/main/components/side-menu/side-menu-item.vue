<template>
  <Submenu  v-auth="parentItem.auth" :name="`${parentName}`">
    <template slot="title">
      <common-icon :type="parentItem.icon || ''" />
      <span>{{ parentItem.title }}</span>
    </template>
    <template v-for="item in children">
      <side-menu-item v-if="showChildren(item)" :key="`menu-${item.title}`" :parent-item="item"></side-menu-item>
      <menu-item v-auth="item.auth" v-else :to="item.to" :target="item.target" :name="item.to" :key="`menu-${item.title}`">
        <common-icon :type="item.icon || ''" />
        <span>{{ item.title }}</span>
      </menu-item>
    </template>
  </Submenu>
</template>
<script>
import mixin from "./mixin";
import itemMixin from "./item-mixin";
export default {
  name: "SideMenuItem",
  mixins: [mixin, itemMixin]
};
</script>
