'use strict';

const $hasChild = function (obj) {
  return obj.children && obj.children.length && obj.children.length !== 0;
}

/**
 * check if user with `roles` has access to `item`
 * @param {Object | Array} roles
 * @param {Object} item containing access control (which should be an array)
 * @returns {boolean} permitting access or not
 */
export const $hasAccessTo = function (roles, item) {
  if (item.meta && item.meta.access && item.meta.access.length) {
    // exist access control
    const access = item.meta.access;
    return hasInCommon(access, roles);
  } else {
    // no valid access control
    return true
  }
}

/**
 * test whether these two things has something in common
 * @param {Array} arrayNotEmpty
 * @param {Array | Object} iterable. Note when giving object, keys will be used
 * @returns {boolean} has something in common or not
 */
const hasInCommon = function (arrayNotEmpty, iterable) {
  if (iterable instanceof Array) {
    // array
    return arrayNotEmpty.some(i => iterable.indexOf(i) > -1);
  } else if (typeof iterable === 'object') {
    // object: compare against its keys
    return arrayNotEmpty.some(i => Object.keys(iterable).indexOf(i) > -1);
  } else {
    // treat as entity
    return arrayNotEmpty.includes(iterable);
  }
}

/**
 * 通过路由表得到菜单列表。菜单列表用于生成侧边栏层级菜单。
 * 参考iview-admin 项目代码： https://github.com/iview/iview-admin/blob/master/src/libs/util.js
 *
 * @param {Array} routes 路由表
 * @param {Array} roles 角色列表
 */
export const getMenu = (routes, roles) => {
  let result = [];
  for (let i = 0; i < routes.length; i++) {
    let item = routes[i];
    if (item.meta && !item.meta.hidden) {
      if ($hasAccessTo(roles, item)) {
        let obj = {
          icon: item.meta.icon || '',
          // 菜单的名字（可能与title不同，所以没有复用）
          menu: item.meta.menu || '<please-specify-menu-name>',
          disabled: item.meta.disabled,
          link: item.name, // 通过命名路由（name）来进行跳转
          // todo add href implementation in App.vue#beforeCreate and side-menu.vue#populateSubMenu
          href: item.meta.href || '', // 如果有href，将进行应用外跳转，效果会覆盖link
          extra: item.extra // extra html AFTER the menuItem
        }
        if ($hasChild(item)) {
          obj.children = getMenu(item.children, roles);
        }

        // in case when all children are banned
        if (obj.children && obj.children.length === 0) {
          // no-op
        } else {
          result.push(obj);
        }
      }
    }
  }
  return result;
}

/**
 * 通过路由查找当前页面藏在了哪里
 * @param route this.$route
 * @returns {{inside: string}|undefined} Nearest Route entry whose 'hidden.inside' is not blank.
 */
export const getHidingPlace = (route) => {
  if (!route) return;
  return (route.meta.hidden && route.meta.hidden.inside) || getHidingPlace(route.parent);
}

export const translateNameToMenu = (name, router) => {
  const resolved = router.resolve({name});
  const meta = resolved.route.meta;
  if (meta && meta.menu) {
    return meta.menu;
  } else {
    console.warn('component of name [%s] doesn\'t have proper meta.menu specified, which is a bug!');
    return '返回上一级';
  }
}
