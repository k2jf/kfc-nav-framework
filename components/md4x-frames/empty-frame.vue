<!--

 这是专门用于路由“中间路径”的组件。
 例如对于资源 http://localhost:8888/#/system-mgr/micro-service/count，
 这个路径： http://localhost:8888/#/system-mgr/micro-service 对应的空页面。
 它的作用是在路由表router/route.js中提供菜单条目。

 注意： 当这个view成为路由终点时，空窗口会被替换为WhereToGo，提供友好的提示。
 也就是说，当访问 http://localhost:8888/#/system-mgr/micro-service 路径时，会显示“下一步去哪儿？”并展示children的链接。

-->

<!-- render() -->
<script>
  export default {
    name: 'empty-frame',
    render: function(h) {
      var routes = this.$route.matched;
      // console.log(routes);
      if (routes[routes.length - 1].components.default.name === 'empty-frame') { // same as `name`
        // todo should be replaced by a `WhereToGo`.
        console.info(`user accidentally jumped to this path: ${this.$route.path}, which is empty.`)
        return h('h1', {
          style: {
            width: '300px',
            height: '200px',
            verticalAlign: 'center',
          },
        }, 'deliberately left empty.');
      } else {
        return h('router-view');
      }
    },
  };
</script>

<style scoped>

</style>
