# Web 快速建站 Checklist（AI 执行版）

> 关联文档：`docs/skill-rapid-web-frontend.md`
>
> 目标：让后续 AI 可以按勾选项直接完成“初始结构建立 + 统一性能 API 封装”。

---

## 使用说明

- 执行顺序：必须按阶段从上到下执行，不跳阶段。
- 勾选规则：每项任务完成后改为 `[x]`，并在“执行记录”写入变更文件路径。
- 验收规则：每个阶段全部勾选后，才允许进入下个阶段。

---

## Phase 0：前置约束

- [ ] 不实现具体业务功能，仅建设基础设施与示例骨架
- [ ] 页面/组件内禁止直接使用 `$fetch`，统一走 API 层
- [ ] 禁止硬编码主题色，统一使用 token / `var(--color-*)`
- [ ] 输出最终“统一性能验收清单”的逐项结果

**验收标准**

- 搜索代码不存在页面内直接 `$fetch(` 调用
- 新增样式中没有业务色值硬编码（演示页除外）

---

## Phase 1：目录与结构初始化

- [ ] 建立（或确认）目录结构
  - `src/components`
  - `src/composables`
  - `src/design`
  - `src/lang`
  - `src/modules/api/interceptors`
  - `src/modules/api/plugins`
  - `src/modules/api/methods`
  - `src/modules/api/schemas`
  - `src/utils`
  - `src/utils/request`
  - `docs`
- [ ] 确认 `nuxt.config.ts` 已挂载 i18n/UnoCSS/Pinia/Element Plus

**验收标准**

- 目录可见且命名一致
- `nuxt.config.ts` 模块可正常识别

---

## Phase 2：i18n 基础层

- [ ] 配置 `nuxt.config.ts` 的 `i18n`（`langDir/lazy/defaultLocale/strategy`）
- [ ] 确认语言包目录与文件（如 `src/lang/en.json`、`src/lang/zh-tw.json`）
- [ ] 建立/校验 `src/plugins/i18n.client.ts`
  - 浏览器语言识别
  - cookie 与 localStorage 持久化
  - 语言切换 hook 同步
- [ ] 提供一个最小多语示例页面或组件（只验证机制）

**验收标准**

- 切换语言后刷新页面仍保持用户选择
- 文案通过 `$t("key")` 渲染，不写死文本

---

## Phase 3：Design Token + Theme 基础层

- [ ] 建立/校验 `src/design/token.ts`
  - 至少包含 `spacing`、`fontSize`、`borderRadius`
  - 含 safelist 生成逻辑
- [ ] 在 `uno.config.ts` 注入 `DesignToken` 与 `TokenSafelist`
- [ ] 建立/校验 `src/assets/styles/theme/themes.scss`
  - 至少 `light`、`dark` 两套主题
- [ ] 建立/校验 `src/assets/styles/theme/index.scss`
  - `:root` 默认变量
  - `.vs-theme-{theme}` 变量覆盖
- [ ] 建立/校验 `src/composables/useTheme.ts`
  - 支持运行时切换
  - 支持本地持久化

**验收标准**

- 切换主题后颜色即时更新
- 新增页面可用语义色类（如 `text-maintext`、`bg-primary`）

---

## Phase 4：API 基础层（统一性能重点）

### 4.1 核心文件

- [ ] 建立/校验 `src/modules/api/plugins/api.ts`
- [ ] 建立/校验 `src/modules/api/ApiHelper.ts`
- [ ] 建立/校验 `src/modules/api/ApiResult.ts`
- [ ] 建立/校验拦截器：
  - `HeaderCommon`
  - `HeaderToken`
  - `HeaderSign`
  - `ResponseBase`

### 4.2 性能基线（强制）

- [ ] 默认超时：`timeout = 10000ms`
- [ ] 默认网络重试：`retry = 2`、`retryDelay = 1000ms`
- [ ] 业务重试：仅允许特定业务码，且有最大重试次数
- [ ] 请求去重：同 key 的 in-flight 请求复用 Promise
- [ ] 查询类缓存：支持短缓存（建议 5-30s，可配置）
- [ ] 变更类接口：默认禁用缓存
- [ ] 支持取消请求（`AbortController` 或等效能力）

### 4.3 可观测性（强制）

- [ ] 请求日志包含：
  - `requestId`
  - `url`
  - `duration`
  - `retryCount`
  - `resultCode`
- [ ] 开发环境慢请求告警（建议阈值 `>1500ms`）
- [ ] 测试环境支持日志开关（runtimeConfig）

### 4.4 方法工厂规范（强制）

- [ ] 每个接口必须使用 `makeMethod(name, url)` 生成
- [ ] 页面层只消费 `ApiResult` 的 `ok/data/msg`
- [ ] 页面层禁止处理 token/sign/retry 细节

**验收标准**

- 全局搜索页面层无 `$fetch(` 直接请求
- 同参数高频触发不出现重复并发风暴
- 接口失败重试行为可从日志追踪

---

## Phase 5：高复用 utils 基础集

- [ ] 建立/校验互斥工具：`src/utils/mutexLock.ts`
- [ ] 建立/校验请求管理：`src/utils/batchRequest/*`
- [ ] 建立/校验事件总线：`src/utils/eventBus.ts`
- [ ] 建立/校验时间格式化：`src/utils/timer/format.ts`
- [ ] 建立/校验唯一 ID：`src/utils/uniqueId.ts`

**验收标准**

- utils 不依赖业务 store
- 函数输入输出清晰，可在多个页面复用

---

## Phase 6：高复用 composables 基础集

- [ ] `src/composables/useAuth.ts`
- [ ] `src/composables/useRedirect.ts`
- [ ] `src/composables/useInnerRoute.ts`
- [ ] `src/composables/useLanguage.ts`
- [ ] `src/composables/useDeviceType.ts`
- [ ] `src/composables/useTheme.ts`
- [ ] `src/composables/useCopyToClipboard.ts`
- [ ] `src/composables/useKeepAlive.ts`

**验收标准**

- 命名统一 `useXxx`
- 单一职责，不耦合具体业务页面

---

## Phase 7：高复用基础组件骨架

- [ ] `src/components/InfiniteScrollView.vue`
- [ ] `src/components/Base/VsDialog.vue`
- [ ] `src/components/TableEmptyData.vue`
- [ ] `src/components/SearchOptions/index.vue`

**验收标准**

- 组件 API 清晰（props/emits/slots）
- 组件内不直接耦合业务接口

---

## Phase 8：统一性能验收清单（最终必须输出）

- [ ] 请求是否全部经过 `makeMethod` / `$api`
- [ ] 是否实现了请求去重（同 key）
- [ ] 查询接口是否具备缓存能力
- [ ] 慢请求是否可被发现并告警
- [ ] 重试是否只在允许场景生效
- [ ] 页面层是否仅处理 `ok/data/msg`
- [ ] 主题与多语切换是否可持久化

**建议指标（测试环境）**

- [ ] 首屏关键 API 总耗时 P95 < 1200ms
- [ ] 高频点击操作不产生并发风暴

---

## 执行记录（给 AI 填写）

### 1）本次新增/修改文件

- [ ] `path/to/file-a`
- [ ] `path/to/file-b`

### 2）风险与未完成项

- [ ] 无
- [ ] 有（请列出）

### 3）验收结论

- [ ] 通过（可进入业务开发）
- [ ] 不通过（需回到对应阶段修复）

