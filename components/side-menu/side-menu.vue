<!-- use render() as template -->
<script>
  // note pay attention to this `Submenu` import! Case must match!
  import {Menu, MenuItem, Submenu, MenuGroup, Icon} from 'iview';
  import {getHidingPlace, translateNameToMenu} from '../../libs/menu-provider'

  export default {
    name: 'side-menu',
    props: {
      menuData: {
        type: Object,
        // note Object/Array should make default of a function
        default: () => {},
      },
      widthInPx: {
        type: Number,
        default: 0,
      },
      accordion: {
        type: String,
        default: 'false',
      },
    },
    components: {
      Menu,
      MenuItem,
      Submenu,
      MenuGroup,
      Icon,
    },
    data() {
      return {
        // this default value is tricky! it cannot be set inside mounted()
        openedNames: this.getActiveFolders(),
        // the default page (route's name) for current menu
        scapegoat: ''
      }
    },
    render: function(h) {

      const that = this;
      // initialize the menu-item container
      let content = [h(MenuItem, {
        style: {
          textAlign: 'center',
          height: '3em',
          lineHeight: '3em !important',
          borderBottom: '1px solid #e5e5e5',
        },
        props: {
          name: 'exceptional-case-no-content',
          // to: '/index',   // 传一个字符进去也可以（代表path）
          to: {              // note 传一个对象进去，对象中的name代表命名路由
            name: 'Dashboard',
          },
          replace: true
        },
      }, '- 回到首页 -')];

      /**
       * a recursive function taking menu-data and generate a submenu.
       * Starting from the 'children' of the top level.
       * - menu
       * - href
       * - icon
       * - link
       * - disabled
       * - children []  <-- this one!
       */
      function populateSubMenu(menuObjArr, useMenuGroupInsteadOfMenuSub, recur = 0) {

        const result = [];
        const menuIconSize = 18;
        for (let i = 0; i < menuObjArr.length; i++) {
          let entry = menuObjArr[i];

          // short circuit: if disabled, then just show an empty grey menuItem
          if (entry.disabled) {
            // if (for whatever reason) this item is disabled
            result.push(h(MenuItem, {
              class: ['item-disabled'],
              props: {
                name: entry.link,
              },
              // choose to show icon if exists.
            }, entry.icon ? [h(Icon, {
              props: {
                type: entry.icon,
                size: menuIconSize,
              }
            }), entry.menu] : entry.menu));

            continue;
          }

          if (!(entry.children && entry.children.length > 0)) {
            // case 1: no children -> menu-item
            // console.log('recursion level: %d, entry name: %s', recur, entry.menu);
            if (!that.scapegoat) {
              that.scapegoat = entry.link;
              // console.log('populateMenu: the default page name is: %s', that.scapegoat);
            }

            result.push(h(MenuItem, {
              class: {
                'item-inside': recur > 0,
                'group-mode': useMenuGroupInsteadOfMenuSub,
                'submenu-mode': !useMenuGroupInsteadOfMenuSub,
                'item-clickable': true,
              },
              props: {
                // note this `name` is the key for router back-reference, which should be identical to link!
                name: entry.link,
                to: {
                  // fixme: if href is provided, override this!
                  name: entry.link,
                }
              },
            }, [].concat(
              // 1.Icon on the left (optional)
              entry.icon ? h(Icon, {props: {type: entry.icon, size: menuIconSize}}) : [],
              // 2.Menu Text in the middle, and when clicked, refresh the page
              h('span', {
                on: {
                  click () {
                    if (that.$route.name === entry.link) { // only when clicking on the current active item...
                      that.$bus.$emit('refresh');
                    }
                  }
                }
              }, entry.menu)
            )) // end of MenuItem
            );

          } else {
            // case 2: has children -> sub-menu or menu-group
            if (!useMenuGroupInsteadOfMenuSub) {

              // case 2a: sub-menu, using slot['title']
              // note a slot of div will spoil the style!! use 'template' instead.
              let slot = h('template', {slot: 'title'}, entry.icon ? [h(Icon, {
                props: {
                  type: entry.icon,
                  size: menuIconSize,
              }}), entry.menu] : entry.menu);
              result.push(h(Submenu, {
                props: {
                  name: entry.link,
                }
              }, [slot, ...populateSubMenu(entry.children, useMenuGroupInsteadOfMenuSub, recur + 1)]));

            } else {

              // case 2b: menu-group, using :title
              result.push(h(MenuGroup, {
                props: {
                  title: entry.menu,
                  // fixme menuGroup doesn't have a way to add icon
                }
              }, populateSubMenu(entry.children, useMenuGroupInsteadOfMenuSub, recur + 1)));
            }
          }

          // add extra after the menuItem/menuSub
          if (entry.extra) {
            result.push(h('div', {domProps: {
              // fixme innerHTML may lead to XSS attack! Be aware of that and find better solution!
                innerHTML: '' + entry.extra
              }, style: {
                display: that.$route.name === entry.link ? 'block' : 'none'
              }}));
          }

        }
        return result;
      }

      const subMenu = populateSubMenu(this.menuData.children || [], this.accordion === 'none'); // the return value must be an array.
      if (subMenu.length > 0) {
        // if subMenu is not empty, then replace the content.
        content = subMenu;
      }

      // the top-level composition
      return h(Menu, {

        class: ['side-menu'],
        style: {
          // outline: '3px solid rgba(255, 0, 0, 0.3)', // for debug use
          minHeight: '100%',
        },
        props: {
          width: this.widthInPx === 0 ? 'auto' : this.widthInPx + 'px',
          accordion: this.accordion === 'true',
          activeName: this.activeName,
          // todo implment openNames logic. openNames is a one-time prop which has to use
          // updateOpened() to stay sync.
          openNames: this.openedNames,
        },
        ref: 'menu',
      }, content)
    },
    methods: {
      getActiveFolders() {
        const name = getHidingPlace(this.$route);
        const route = name ? this.$router.resolve({name}).route : this.$route;
        return route.matched.map(item => item.name).slice(2, -1);
      },
      openDefaultPage () {
        this.$router.replace({name: this.scapegoat});
      }
    },
    computed: {
      activeName() {
        /* tweak: to accommodate in-page sub-route (compared to 'in-menu' sub-route),
         * a work-around method is used where in route.js, specifying 'inside' as the parent route name in meta
         * and put that page inside a hidden folder which is inside the same 'level-2 route' path.
         */
        return getHidingPlace(this.$route) || this.$route.name;
      },
    },
    watch: {
      activeName () {
        if (this.accordion === 'true') {
          this.openedNames = this.getActiveFolders();
        } else {
          var internalMenuState = this.$refs.menu.$data.openedNames;
          this.openedNames = Array.from(new Set([...internalMenuState, ...this.getActiveFolders()]));
          // console.log(this.openedNames);
        }
        this.$nextTick(() => {
          this.$refs.menu.updateActiveName();
          this.$refs.menu.updateOpened();
        });
      },
      menuData() {
        // clear the cache
        this.openedNames = this.getActiveFolders();
        // clear the default page
        this.scapegoat = '';
      }
    },
    mounted () {
      this.$bus.$on('summon-child-view', this.openDefaultPage);
    },
    beforeDestroy () {
      this.$bus.$off('summon-child-view');
    }
  };
</script>

<style scoped>
    .item-clickable, .ivu-menu-item-group, .ivu-menu-submenu {         /* 折叠在里面的menu-item */
      border-bottom: 1px solid var(--divider-color);
    }
    .ivu-menu-opened {
      border-bottom: none;
    }
    .item-clickable {
      margin-right: 1px;
    }
    .item-clickable:hover,        /* 外面的menu-item的hover */
    .side-menu >>> .ivu-menu-submenu-title:hover {    /* 外面submenu的hover */
      background-color: #F0FAFF;
    }

    .item-clickable.item-inside.group-mode {
      padding-left: 40px;
      border-bottom: none;
    }
    .item-clickable.group-mode {
      padding-left: 28px;
    }
    .item-inside.submenu-mode {
      background-color: #F9F9F9;
    }

    .item-disabled {
      background-color: #eeeeee !important;
      color: #999999 !important;
      border-right: 1px solid var(--edge-color);
    }
    .side-menu >>> .ivu-menu-item-active.item-disabled:after {
      background-color: grey;
    }
</style>
