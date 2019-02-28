## dependencies
- need router's route as an object
- need this.$bus as global value store
- need iview

## how to install & use
### install
> to be done...
### use
it's a vue plugin, so inside `main.js`:
```js
    /* main.js */
    import NavFramework from '@/plugins/nav-framework';
    
    /* other initialization processes go here... */
    Vue.use(NavFramework, {
      route: route  // this is the router's route object
    });
    
```

... and then you have to import those components from the directory
```js
    /* route/index.js */
    import MainFrame from '@/plugins/nav-framework/components/md4x-frames/md4x-frame';
    import SubFrame from '@/plugins/nav-framework/components/md4x-frames/md4x-sub-frame';
    import EmptyFrame from '@/plugins/nav-framework/components/md4x-frames/empty-frame';
    
```

#### then you just weave in these there components to build up nav framework!
```js
    export default [
      {
        path: '/',
        name: 'Md4xFrame',
        component: Md4xFrame,
        redirect: '/index',
        children: [
          {
            path: '/index', // note in hash mode, corresponding to 
                            // `http://localhost:8888/#/index`
            name: 'Welcome page',
            component: (resolve) => require(['@/views/index'], resolve),
            meta: {
              title: '首页',
              menu: '首页', // 不写的话，默认是一个报错信息
            }
          },
          {
            path: '/demo',
            name: 'Demo Page',
            component: Md4xSubFrame,
            meta: {
              title: '起步示范',
              menu: '示范页'
            },
            children: [
              {
                path: 'vue-router', //  note in hash mode, corresponding to 
                                    // `http://localhost:8888/#/demo/vue-router`
                name: 'Vue Router Tutorial',
                component: EmptyFrame, // Empty Frame is like 'folder'.
                // remember to ALWAYS put child view inside EmptyFrame,
                // or it will shout at your carelessness... :)
                meta: {
                  // ***********************
                  //  see help below ...
                  // ***********************
                },
                children: [
                  {/* some other routes, namely A and B */}
                ]
              },
              {
                path: 'vue-bus',
                name: 'Bus.js demystify',
                component: BusIntroduction, // an actual .vue file
                meta: {
                  
                }
              }
            ]
          }
        ]
      },
    
      // =============================================================================================
      // note end of '/'. From now on, all pages are just hidden. 'meta.menu' is not required, either.
      // =============================================================================================
      {
        path: '/401',
        name: 'error_401',
        meta: {
          title: '401 - 权限不足',
        },
        component: Error401
      },
      {
        path: '/403',
        name: 'error_403',
        meta: {
          title: '403 - 操作被阻止'
        },
        component: Error403
      },
      {
        // note global catch-all route (404 not found)
        path: '*',
        name: 'error_404',
        meta: {
          title: '404 - 链接失效',
        },
        component: Error404
      }
    ]
```
#### so now your routes look like this:
```
- / (redirected to /index)               -- MainFrame
  - /index                               -- an actual page
  - /demo         ---- auto -------+     -- SubFrame, as Tab
    - /demo/vue-router             |     -- EmptyFrame, as Menu
      - /demo/vue-router/A      <--+     -- an actual page
      - /demo/vue-router/B               -- an actual page
    - /demo/vue-bus                      -- an actual page
------------ below are not shown in nav ('under the water')-------------------
  - /401
  - /403
  - /404 (all un-catched routes will finally go this way)
```

### what's inside `meta`?
```js
  meta_option = {
  
    access: ['user, p1'],      // 权限，若不指定，则为开放；若指定，则只有这些角色可以访问
    disabled: true,            // 禁用，将菜单项置灰（如果可见）。父节点上禁用，则子节点不会渲染
    icon: '',                  // 图标，请查阅https://www.iviewui.com/components/icon 获取图标名
    title: '',                 // 浏览器tab标题（需要自定义的 router-guard插件）
    menu: '数据完整度查询',      // 出现在菜单上的名称，二级路由的必要项（后期可能会引入locale.js）
    hidden: true               // 隐藏这个条目（以及所有子条目, 注意：这些隐藏页面仍可通过url访问）
                               // 或: hidden: {inside: 'Bus.js demystify'},
                               // 表示是另外一个页面的子页面，不出现在菜单里
  }


```









