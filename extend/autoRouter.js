const Glob = require('glob')
const pify = require('pify')
const path = require('path')
const fs = require('fs')
const chokidar = require('chokidar')
const glob = pify(Glob)
const yaml = require('yamljs')

let isRunning = false;

/**
 * 扫描文件
 */
generateRoutesAndFiles = async () => {
  const files = {};

  (await glob(`view/**/{*.vue,*.js,meta.yml}`, {
    cwd: path.resolve(process.cwd(), './src'),
    ignore: ['**/*.test.*', '**/*.spec.*', '**/-*.*']
  })).forEach((f) => {
    const key = f.replace(/\.(js|vue)$/, '')
    if (/\.vue$/.test(f) || !files[key]) {
      files[key] = f.replace(/('|")/g, '\\$1')
    }
  })

  return createRoutes(
    Object.values(files),
    'view'
  )
}
/**
 * 根据文件生成路由
 * @param {*} files
 * @param {*} pagesDir
 */
function createRoutes(files, pagesDir) {
  const routes = []
  const main = {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: 'Main',
    children: []
  }
  routes.push(main);
  files.forEach((file) => {
    if (path.extname(file) === '.yml') {
      return;
    }
    const keys = file
      .replace(RegExp(`^${pagesDir}`), '')
      .replace(/\.(vue|js)$/, '')
      .replace(/\/{2,}/g, '/')
      .split('/')
      .slice(1)

    const component = file
      .replace(RegExp(`^${pagesDir}`), '')
      .replace(/\/{2,}/g, '/')
      .split('/')
      .slice(1)

    const route = {
      name: '',
      path: '/' + component.slice(0, component.length - 1).join('/'),
      component: `() => import('../${file}')`
    }

    let parent = main.children;

    //处理meta数据
    const fileName = path.basename(file, '.vue');
    const ymlFile = path.dirname(file) + '/meta.yml';
    if (files.indexOf(ymlFile) >= 0) {
      //如果存在对应meta.yml文件
      const ymlStr = fs.readFileSync('./src/' + ymlFile, 'utf8');
      const ymlObj = yaml.parse(ymlStr);
      if (ymlObj !== null && ymlObj[fileName]) {
        //如果meta.yml里存在文件名对应的键
        route.meta = ymlObj[fileName]
        if (!route.meta.breadcrumb) {
          //如果没有面包屑数据
          route.meta.breadcrumb = [];
          if (fileName !== 'index' && ymlObj.index && ymlObj.index.title) {
            if (ymlObj.index.breadcrumb) {
              //父页面设置了面包屑，直接用
              route.meta.breadcrumb = ymlObj.index.breadcrumb
              route.meta.breadcrumb[route.meta.breadcrumb.length - 1].to = route.path;
            } else if (ymlObj.index.title) {
              //添加父页面数据
              route.meta.breadcrumb = [{ title: ymlObj.index.title, to: route.path }];
            }
          }
          if (route.meta.title) {
            //添加当前页
            route.meta.breadcrumb.push({ title: route.meta.title })
          }
        }
        if (route.meta.notInMain) {
          parent = routes;
        }
      }
    }

    if (fileName != 'index') {
      route.path += '/' + fileName
    }


    keys.forEach((key) => {
      route.name += key.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    })
    parent.push(route)
  })
  sortRoutes(routes)
  return {
    'routes': cleanChildrenRoutes(routes),
  }
}

const DYNAMIC_ROUTE_REGEX = /^\/(:|\*)/;

function sortRoutes(routes) {
  routes.sort((a, b) => {
    if (!a.path.length) {
      return -1
    }
    if (!b.path.length) {
      return 1
    }
    if (a.path === '/') {
      return DYNAMIC_ROUTE_REGEX.test(b.path) ? -1 : 1
    }
    if (b.path === '/') {
      return DYNAMIC_ROUTE_REGEX.test(a.path) ? 1 : -1
    }

    let i
    let res = 0
    let y = 0
    let z = 0
    const _a = a.path.split('/')
    const _b = b.path.split('/')
    for (i = 0; i < _a.length; i++) {
      if (res !== 0) {
        break
      }
      y = _a[i] === '*' ? 2 : _a[i].includes(':') ? 1 : 0
      z = _b[i] === '*' ? 2 : _b[i].includes(':') ? 1 : 0
      res = y - z
      // If a.length >= b.length
      if (i === _b.length - 1 && res === 0) {
        // unless * found sort by level, then alphabetically
        res = _a[i] === '*' ? -1 : (
          _a.length === _b.length ? a.path.localeCompare(b.path) : (_a.length - _b.length)
        )
      }
    }

    if (res === 0) {
      res = _a[i - 1] === '*' && _b[i] ? 1 : (
        _a.length === _b.length ? a.path.localeCompare(b.path) : (_a.length - _b.length)
      )
    }
    return res
  })

  routes.forEach((route) => {
    if (route.children) {
      sortRoutes(route.children)
    }
  })

  return routes
}

function cleanChildrenRoutes(routes, isChild = false) {
  let start = -1
  const routesIndex = []
  routes.forEach((route) => {
    if (/Index$/.test(route.name) || route.name === 'Index') {
      const res = route.name.split('-')
      const s = res.indexOf('Index')
      start = start === -1 || s < start ? s : start
      routesIndex.push(res)
    }
    route.path = route.path.replace(/\/{2,}/g, '/');
  })
  routes.forEach((route) => {
    route.path = isChild ? route.path.replace('/', '') : route.path
    route.name = route.name.replace(/Index$/, '')
    if (route.children) {
      if (route.children.find(child => child.path === '')) {
        delete route.name
      }
      route.children = cleanChildrenRoutes(route.children, true)
    }
  })
  return routes
}

let creatRouter = (flag = false) => {
  if (flag) return
  generateRoutesAndFiles().then(res => {
    let string = `/* eslint-disable */\n`

    string += `import Main from '../components/main';\n`

    string += `export default ${JSON.stringify(res.routes, null, 2)};`
      .replace(/"component": "(.*?)"/g, `"component": $1`)
      .replace(/"(\w+?)":/g, '$1:')
    fs.mkdir(path.resolve(process.cwd(), './src/router'), () => {
    })
    fs.writeFile(path.resolve(process.cwd(), './src/router/route.js'), string, () => {
      console.log('\n╭(￣▽￣)╯╭(￣▽￣)╯')
      console.log('router文件写入完毕')
      isRunning = false;
    })
  })
}

const root = process.cwd();

module.exports = (api) => {
  api.configureWebpack(() => {
    if (process.env.NODE_ENV !== 'production') {
      let watcher = chokidar.watch(`${root}/src/view`, { persistent: true });
      watcher.on('raw', event => {
        if (event === 'modified' || isRunning) {
          return;
        }
        isRunning = true;
        creatRouter.call(this, false);
      });
    }
    creatRouter(false)
  })
}
