import Md4xFrame from './components/md4x-frames/md4x-frame';
import Md4xSubFrame from './components/md4x-frames/md4x-sub-frame';
import EmptyFrame from './components/md4x-frames/empty-frame';

import {getMenu} from "./libs/menu-provider";

export default {
  install (Vue, options) {

    // check dependency
    if (!Vue.prototype.$bus) {
      throw new Error('nav-framework: need $bus initialized before!');
    }
    if (!options.route) {
      throw new Error('nav-framework: need option "route" when installing, \n' +
        'like this: `Vue.use(NavFramework, {\n' +
        '  route: Route' +
        '})`');
    } else if (!options.route[0]) {
      throw new Error('nav-framework: route empty. need data');
    }

    // initialize menu data
    Vue.prototype.$bus.menu = getMenu(
      options.route[0].children,
      Vue.prototype.$bus.permissions
    );

  }
}
