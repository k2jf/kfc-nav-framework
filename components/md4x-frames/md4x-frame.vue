<template>
  <div>
    <p-layout class="md4x-layout">
      <p-header class="md4x-header">
        <!-- note use :active-name, not plain prop. -->
        <p-menu mode="horizontal" theme="dark" :active-name="activeMenuName">
          <slot name="left">
            <div class="md4x-logo" @click="handleGoIndex"></div>
          </slot>

          <!-- in order to float right, this div should be put here -->
          <div class="personal-info">
            <slot name="right">
              <i-poptip trigger="click" transfer popper-class="personal-info-poptip-wrapper">
                <i-button ghost class="user-name">{{userName}} <Icon type="ios-arrow-down" /></i-button>
                <i-cellGroup slot="content">
                  <i-cell title="修改密码" @click.native="$emit('nav-passwd')"/>
                  <!-- todo add news pop -->
                  <!--<i-cell title="系统消息">
                    <Badge :count="10" slot="extra" />
                  </i-cell>-->
                  <!-- note 'native' is needed for this to work -->
                  <i-cell title="退出" @click.native="$emit('nav-exit')"/>
                </i-cellGroup>
              </i-poptip>
              <!--<i-button size="small" ghost class="header-log-out" @click="logout">退出</i-button>-->
            </slot>
          </div>

          <!-- menu-item -->
          <div class="md4x-nav">
            <c-hori ref="hori" class="nav-scroll">
              <p-menu-item v-for="(item, index) in menuItems" :key="index"
                           class="md4x-nav-item"
                           :name="item.link"
                           :to="{name: item.link}">
                <Icon v-if="item.icon" :type="item.icon" size="16"
                      style="margin-right: 0;"></Icon>
                <!-- index is 0-based -->
                {{item.menu}}
              </p-menu-item>
            </c-hori>
          </div>

        </p-menu>
      </p-header>
      <p-content class="md4x-off-header">
        <router-view/>
      </p-content>
    </p-layout>
  </div>
</template>

<script>
  import {Layout, Header, Content, Menu, MenuItem, Poptip, CellGroup, Cell, Button} from 'iview';
  import HorizontalScrollWrapper from '../horizontal-scroll-wrapper';

  export default {
    name: 'md4x-frame',
    components: {
      'p-layout': Layout,
      'p-header': Header,
      'p-content': Content,
      'p-menu': Menu,
      'p-menu-item': MenuItem,

      'i-button': Button,
      'i-poptip': Poptip,
      'i-cellGroup': CellGroup,
      'i-cell': Cell,

      'c-hori': HorizontalScrollWrapper,
    },
    props: {
      userName: {
        type: String,
        default: 'welcome!'
      }
    },
    data () {
      return {
        menuItems: [],
      }
    },
    computed: {
      activeMenuName() {
        // console.log(this.$route);
        var cascade = this.$route.matched;
        if (cascade.length > 1) {
          return cascade[1].name;
        } else {
          console.warn('Md4xFrame: I cannot resolve top level route, ' +
          'maybe it does not exist. Current route object is: %o', this.$route);

          return '';
        }
      }
    },
    methods: {
      handleGoIndex() {
        // note index page should always be pointed to '/'
        this.$router.push("/");
      }
    },
    created() {
      // note you should save a copy of $bus.menu, or vue will modify it.
      this.menuItems = this.$bus.menu.map(i => {
        return {
          menu: i.menu,
          link: i.link,
          icon: i.icon,
        }
      });
    }
  }
</script>

<style scoped>

    .md4x-header {
      height: 60px;
      padding: 0 20px;
      background-color: var(--layout-header-bc);
    }

    /* hack to customize the header-background-color */
    .md4x-header .ivu-menu-dark {
      background: none;
      overflow-y: hidden;
    }

    .md4x-logo {
      float: left;
      width: 136px;
      height: 29px;
      position: relative;
      top: 15px;
      color: var(--layout-header-fc);
      font-weight: bold;
      font-size: 24px;
      line-height: 29px;
      background: no-repeat center / contain url("../../assets/nav-framework-logo.png");
      cursor: pointer;
    }

    .md4x-nav {
      /* margin-left for logo */
      margin-left: 150px;
      margin-right: 10em;
      height: 100%;
      text-align: center;
    }

    .nav-scroll {
      width: 100%;
      margin: 0 auto;
    }

    .md4x-nav-item {
      /* tweak: make tab un-selectable */
      user-select: none;
      padding-left: 1.5em;
      padding-right: 1.5em;
    }

    /* hack for divider between nav */
    .md4x-nav-item:not(:first-child):before {
      content: '│';
      display: inline-block;
      position: absolute;
      left: -5px;
      color: rgba(255, 255, 255, 0.3);
    }

    .md4x-nav-item.ivu-menu-item-selected:after {
      content: ' ';
      display: block;
      width: 2em;
      height: 2px;
      background-color: var(--layout-header-fc);
      position: absolute;
      top: 50px;
      left: 50%;
      margin-left: -1em;
    }

    .md4x-off-header {
      height: calc( 100vh - 60px );
      overflow-y: auto;
    }
    .personal-info {
      float: right;
    }
    .personal-info .user-name {
      color: var(--layout-header-fc-light);
      margin-right: 8px;
      margin-left: 16px;
      border-radius: 5px;
      border-color: transparent;
      box-shadow: none;
    }
    .header-log-out {
      color: var(--layout-header-fc-light);
      border-color: var(--layout-header-fc-light);
    }
    .header-log-out:hover {
      background-color: var(--layout-header-bc-light);
    }

</style>
<style> /* global style! */

  .personal-info-poptip-wrapper {
    min-width: 8em;
  }

  /* note since this poptip is 'transfer'ed, it's not within any component that possesses hash.
    so you should use :popper-class and apply css on global style to customize this style.
   */
  .personal-info-poptip-wrapper .ivu-poptip-body {
    padding: 0;
  }
</style>
