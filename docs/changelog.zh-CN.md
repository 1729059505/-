# Arco Design Pro React v2.0

## v2.1.0

2022-01-19

### 🐛 bugfix

- 修复 `vite` 生产构建产物后，`lazy load module` 失败的 bug。
- 修复构建产物后登录多次重定向的 bug。

### 🆕 新增功能

- 新增 `权限控制` 功能。

## v2.2.0

2022-01-25

### 💅 样式调整

- 所有卡片区块的 `padding` 统一为 `20px`。

### 💎 功能优化

- 删除全局样式覆盖代码，引入 [Arco Pro 主题包](https://arco.design/themes/design/2207)
- 使用 [arco-vite-plugin](https://github.com/arco-design/arco-plugins/blob/main/packages/plugin-vite-react/README.md) 实现 `vite` 架构下按需加在及主题包引入功能。

## v2.3.0

2022-02-11

### 🆕 新增功能

- 支持创建最小 `simple` 模版。(**需要将 `@arco-design/arco-cli` 升级至 `1.25.0`**)

## v2.3.1

2022-02-24

### 🐛 bugfix

- 修复 `settings.themeColor` 在项目中无法生效的 `bug`。
- 修复 `cra` 和 `vite` 架构下，样式无法按需加载的 `bug` (原因是手动引入全量的样式包)
