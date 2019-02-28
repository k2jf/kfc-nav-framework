<template>
  <p-layout class="container">
    <!--
    todo add collapse trigger
    <p-sider :width="224" class="md4x-menu" :collapsible="true" v-model="collapsed" :collapsed-width="0">-->
    <p-sider :width="224" class="md4x-menu">
      <!-- todo for demo use: It can be developed as a message hint. -->
      <!--<div style="text-align: center; margin: 8px 0; padding-right: 8px;">-->
        <!--<h1><Icon type="md-bulb" /> Eureka!</h1>-->
      <!--</div>-->
      <c-side-menu accordion="false" :menu-data="menuList"></c-side-menu>
    </p-sider>
    <p-content class="md4x-content">
      <i-book v-if="hiddenInside" style="height: 24px; margin: 16px 0 0 16px; padding-left: 0.5em;">
        <template v-for="(footprint, index) in path">
          <i-bookmark :key="footprint.name" v-if="index < path.length - 1"
                      :to="{name: footprint.name}" class="dry-footprint">
            {{ deMustache2(footprint.menu) }}
          </i-bookmark>
          <!-- question 使用deMustache会不会导致参数冲突？？比如两个:id这样的问题 -->
          <i-bookmark :key="footprint.name" v-else style="color: #3BA7FA;">{{ deMustache2(footprint.menu) }}</i-bookmark>
        </template>
      </i-book>
      <router-view :style="{height: hiddenInside ? 'calc( 100% - 40px )' : '100%'}" v-if="!refreshing"/>
      <i-spin fix size="large" v-if="!contentReady"></i-spin>
    </p-content>
  </p-layout>
</template>

<script>
  import {Layout, Sider, Content, Breadcrumb, BreadcrumbItem, Spin} from 'iview';
  import SideMenu from '../side-menu';
  import {getHidingPlace, translateNameToMenu} from '../../libs/menu-provider';
  import {deMustache} from "../../libs/utils";

  export default {
    name: "md4x-sub-frame",
    components: {
      'p-layout': Layout,
      'p-sider': Sider,
      'p-content': Content,

      'i-book': Breadcrumb,
      'i-bookmark': BreadcrumbItem,
      'i-spin': Spin,

      'c-side-menu': SideMenu,
    },
    data () {
      return {
        refreshing: false,
        contentReady: false, // when true, hide the spin and show the content
        collapsed: false
      }
    },
    computed: {
      region () {
        if (this.$route.matched.length < 1) {
          return '';
        }
        // 返回一级路由的name（是命名路由）
        return this.$route.matched[1].name;
      },
      menuList () {
        // note computed is more like `data` in usage -- call it by name without ().
        // i.link 也是命名路由（通过命名路由来跳转）
        if (!this.$bus.menu) {
          console.error('menu data has not been initiated! This is a bug!');
        }
        var menuData = this.$bus.menu.find(i => i.link === this.region) || {};
        return menuData;
      },
      hiddenInside () {
        return getHidingPlace(this.$route);
      },
      /**
       * 逐级向上查找具有hidden.inside的(最远的)页面
       * @returns {string[]}
       */
      path () {
        const matchingRoutes = this.$route.matched;
        const hidingPlace = getHidingPlace(this.$route);
        // console.log(matchingRoutes);
        let index = matchingRoutes.findIndex((i) => i.meta.hidden && i.meta.hidden.inside === hidingPlace);

        const result = matchingRoutes.slice(index).map(item => {
          return {
            name: item.name,
            menu: item.meta.menu,
          }
        });
        result.unshift({
          name: hidingPlace,
          menu: translateNameToMenu(hidingPlace, this.$router),
        });
        return result;
      }
    },
    methods: {
      deMustache2(template) {
        return deMustache(template, Object.assign({}, this.$route.query, this.$route.params));
      },
      reloadContent () {
        this.contentReady = false;
        this.refreshing = true;
        this.$nextTick(() => {
          this.refreshing = false;
          setTimeout(() => {
            this.contentReady = true;
          }, 1000);
        });
      }
    },
    mounted () {
      // when clicking on the same menuItem, reload the page
      this.$bus.$on('refresh', this.reloadContent);
      this.contentReady = true;
    },
    updated () {
      // when route ends here, summon a child view to show
      const routes = this.$route.matched;
      if (routes[routes.length - 1].components.default.name === 'md4x-sub-frame') {
        this.$bus.$emit('summon-child-view');
      }
    },
    beforeDestroy () {
      this.$bus.$off('refresh', this.reloadContent);
    }
  }
</script>

<style scoped>

  .container {
    height: 100%;
  }

  .md4x-menu {
    /* width: 300px; <-- this line doesn't work! */
    overflow-y: auto;
    background-color: #efefef;
    box-shadow: 1px 1px 1px 0 var(--edge-color);
  }
  .md4x-content {
    /*padding: 16px; this 16px margin gives to component 'Box' */
    position: relative;
  }

  /* hack for breadcrumb color */
  .dry-footprint >>> .ivu-breadcrumb-item-link {
    color: #AAAAAA;
  }
</style>
