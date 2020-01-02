<template>
  <div class="side-menu-wrapper">
    <slot></slot>
    <Menu ref="menu" v-show="!collapsed" :accordion="accordion" :theme="theme" width="auto">
      <template v-for="item in menuList">
          <side-menu-item v-if="showChildren(item)" :key="`menu-${item.title}`" :parent-item="item"></side-menu-item>
          <menu-item v-else :to="item.to"  v-auth="item.auth" :target="item.target" :name="item.to" :key="`menu-${item.title}`"><common-icon :type="item.icon || ''"/><span>{{ item.title }}</span></menu-item>
      </template>
    </Menu>
    <div class="menu-collapsed" v-show="collapsed" :list="menuList">
      <template v-for="item in menuList">
        <collapsed-menu v-if="item.children && item.children.length > 0" hide-title :root-icon-size="rootIconSize" :icon-size="iconSize" :theme="theme" :parent-item="item" :key="`drop-menu-${item.title}`"></collapsed-menu>
        <Tooltip transfer v-else :content="item.children && item.children[0] ? item.children[0].title : item.title" placement="right" :key="`drop-menu-${item.title}`">
          <router-link v-auth="item.auth" :to="item.to" :target="item.target" class="drop-menu-a" :style="{textAlign: 'center'}"><common-icon :size="rootIconSize" :color="textColor" :type="item.icon || (item.children && item.children[0].icon) || ''"/></router-link>
        </Tooltip>
      </template>
    </div>
  </div>
</template>
<script>
import SideMenuItem from './side-menu-item.vue'
import CollapsedMenu from './collapsed-menu.vue'
import mixin from './mixin'

export default {
  name: 'SideMenu',
  mixins: [ mixin ],
  components: {
    SideMenuItem,
    CollapsedMenu
  },
  props: {
    menuList: {
      type: Array,
      default () {
        return []
      }
    },
    collapsed: {
      type: Boolean
    },
    theme: {
      type: String,
      default: 'dark'
    },
    rootIconSize: {
      type: Number,
      default: 20
    },
    iconSize: {
      type: Number,
      default: 16
    },
    accordion: Boolean,
  },
  data () {
    return {
    }
  },
  computed: {
    textColor () {
      return this.theme === 'dark' ? '#fff' : '#495060'
    }
  },
}
</script>
<style lang="less">
@import './side-menu.less';
</style>
