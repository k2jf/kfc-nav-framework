import SideMenu from './side-menu';

/**
 * side menu 是侧边栏目录，目前只实现最基本的展示功能。
 *
 * prop：
 * - menu-data -> 一个对象，里面包含：
 *    - icon -> 图标的type值
 *    - link -> 路由链接
 *    - menu -> 菜单条目的文字
 *    - href -> 应用外链接
 *    - children -> 一个数组，里面是子菜单
 * - width -> 没有px的宽度值，默认是100%宽
 * - accordion -> “true” 时，只能同时展开一个子菜单，“false” 时不控制，“none” 时强制全部展开
 *         （注意： 这个值是一个字符串，而且不适合动态化，也就是说，不应该传一个变量）
 *
 * event：
 * 暂时不开放
 */
export default SideMenu;
