<template>
  <Menu v-on="$listeners" v-bind="$attrs">
    <template v-for="menu in $attrs.menus">
      <Submenu
        v-bind="menu"
        :index="menu.url"
        v-if="menu.children"
        :key="menu.url"
      >
        <template slot="title">
          <i :class="menu.icon" v-if="menu.icon"></i>
          <span slot="title">{{ menu.name }}</span>
        </template>
        <MenuItem
          v-if="subMenu in menu.children"
          v-bind="menu"
          :index="subMenu.url"
        >
          <i :class="menu.icon" v-if="menu.icon"></i>
          <span slot="title">{{ menu.name }}</span>
        </MenuItem>
      </Submenu>
      <MenuItem v-else v-bind="menu" :index="menu.url" :key="menu.url">
        <i :class="menu.icon" v-if="menu.icon"></i>
        <span slot="title">{{ menu.name }}</span>
      </MenuItem>
    </template>
  </Menu>
</template>

<script lang="js">
import { Menu, MenuItem, Submenu } from "element-ui";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    Menu, MenuItem, Submenu
  }
})
</script>
<style lang="scss"></style>
