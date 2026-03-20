# Skill: Web 前端网站快速构建（业务无关）

## 目标

在当前 Nuxt3 项目内沉淀一套可快速复用的建站方案，不绑定具体业务域，优先复用现有基础设施与工程模式。

## 适用范围

- 适用于中后台/内容型/营销型 Web 站点
- 默认 SPA（`ssr: false`），可按需扩展 SSR
- 技术栈：Nuxt3 + Vue3 + Pinia + UnoCSS + Element Plus + i18n

---

## 一、快速起盘骨架（建议 1 天内完成）

1. 保留当前 `nuxt.config.ts` 的核心模块：
   - `@unocss/nuxt`
   - `@element-plus/nuxt`
   - `@pinia/nuxt`
   - `@vueuse/nuxt`
   - `@nuxtjs/i18n`
2. 建立目录边界（沿用现状）：
   - `src/components`：通用组件
   - `src/composables`：跨页面逻辑
   - `src/utils`：纯工具函数
   - `src/modules/api`：请求层
   - `src/design` + `src/assets/styles/theme`：设计令牌与主题
3. 优先接入“可横向复用能力”，业务页面后置。

---

## 二、高复用基础组件方案

### 推荐保留组件（可作为脚手架默认组件）

- `src/components/InfiniteScrollView.vue`
  - 场景：分页加载、空态、加载态、多语言切换后重载
  - 复用价值：列表页面几乎可直接接入
- `src/components/Base/VsDialog.vue`
  - 场景：统一弹窗样式、挂载策略（`appendToBody`）、销毁策略
  - 复用价值：减少每个页面重复配置 `ElDialog`
- `src/components/SearchOptions/index.vue`
  - 场景：筛选栏（日期/下拉/标签）组合
  - 复用价值：作为“筛选面板”标准实现
- `src/components/TableEmptyData.vue` / `src/components/Base/VsLoadingIcon.vue`
  - 场景：空态、加载态统一
  - 复用价值：全站视觉一致

### 组件规范建议

- 组件输入只暴露 `props + emits + slots`
- 网络请求与业务状态放到 composable，不耦合在通用组件
- 通用组件保留“样式主题能力”（使用 `var(--color-*)`）

---

## 三、多国语（i18n）方案

### 现有可复用方案

- 配置入口：`nuxt.config.ts`
  - `langDir: "lang/"`、`lazy: true`、`strategy: "no_prefix"`
  - 语言切换 Cookie：`detectBrowserLanguage.cookieKey = "pro_i18n"`
- 首次语言初始化与持久化：`src/plugins/i18n.client.ts`
  - 优先级：Cookie > 浏览器语言 > 本地存储
  - 通过 hook `i18n:localeSwitched` 同步存储

### 推荐落地步骤

1. 保留 `lang` 目录按语言拆分（如 `en.json` / `zh-tw.json`）
2. 新页面文案只使用 `$t("key")`
3. 统一通过 composable（如 `useLanguage`）处理语言切换后的副作用刷新

---

## 四、API 调用方案

### 现有可复用分层

- 请求插件：`src/modules/api/plugins/api.ts`
  - 基于 `$fetch.create`，统一 `baseURL/timeout/retry`
  - 统一拦截：`HeaderCommon`、`HeaderToken`、`HeaderSign`、`ResponseBase`
  - 支持业务级重试（特定 code）
- 方法工厂：`src/modules/api/ApiHelper.ts`
  - `makeMethod(name, url)` 统一生成接口方法
  - 支持 response/body/options 自定义拦截
  - 提供 `fetch` 与 `asyncData` 两种调用形态
- 接口组织：`src/modules/api/methods/**`
  - 每个接口一个目录/文件，便于检索与 mock 对照

### 推荐约定

- 页面和组件不直接写 `$fetch`，统一通过 `makeMethod` 产物调用
- token、签名、错误码处理必须在拦截器层集中处理
- 返回结构统一为 `ApiResult<T>`，页面层只处理 `ok/data/msg`

---

## 五、Design Token 方案

### 现有可复用实现

- Token 定义：`src/design/token.ts`
  - `spacing`、`fontSize`、`borderRadius`
- UnoCSS 注入：`uno.config.ts`
  - `theme: { ...DesignToken }`
  - 生成 `TokenSafelist`，避免动态类名被 tree-shaking 清掉

### 推荐扩展

1. Token 分类扩展到：
   - `shadow`
   - `zIndex`
   - `opacity`
2. 保持 token 命名语义化（`xs/sm/md/lg`），避免业务命名
3. 统一由 token 反向生成 safelist，不手写魔法类名

---

## 六、主题色方案

### 现有可复用实现

- 主题色源：`src/assets/styles/theme/themes.scss`
  - `light/dark` 双主题 map
- CSS 变量下发：`src/assets/styles/theme/index.scss`
  - `:root` 默认 light
  - `.vs-theme-{theme}` 覆盖变量
- 运行时切换：`src/composables/useTheme.ts`
  - 将主题 class 写入 `document.documentElement`
  - 本地持久化 `vs-theme`
- 业务使用：`uno.config.ts` 中 `colors -> var(--color-*)`

### 推荐约定

- 页面禁止写死颜色值，统一使用 `bg-primary` / `text-subtext` 等语义色
- 新主题只改 `themes.scss`，不改组件逻辑
- 主题切换入口统一走 `useTheme().setTheme()`

---

## 七、高复用 utils 函数方案

### 建议纳入基础工具集

- `src/utils/mutexLock.ts`
  - 用途：防抖外的并发互斥，防止重复触发异步任务
- `src/utils/batchRequest/*`
  - 用途：请求合并 + 缓存，降低高频碎片请求成本
- `src/utils/eventBus.ts`
  - 用途：轻量跨模块事件通信
- `src/utils/timer/format.ts`
  - 用途：时间格式化基础函数
- `src/utils/uniqueId.ts`
  - 用途：前端本地唯一标识（临时数据/追踪）

### 工具函数准入标准

- 与业务模型解耦（不引用页面 store）
- 输入输出稳定（纯函数优先）
- 有单独示例或注释说明边界场景

---

## 八、高复用 composables 方案

### 建议纳入基础 composable 集

- `src/composables/useAuth.ts`
  - 用途：权限判断统一口径
- `src/composables/useRedirect.ts`
  - 用途：登录/登出跳转能力收敛
- `src/composables/useInnerRoute.ts`
  - 用途：内部路由栈与回退策略
- `src/composables/useLanguage.ts`
  - 用途：语言切换订阅（含 keep-alive 生命周期）
- `src/composables/useDeviceType.ts`
  - 用途：响应式设备类型判断
- `src/composables/useTheme.ts`
  - 用途：主题切换与持久化
- `src/composables/useCopyToClipboard.ts`
  - 用途：复制能力封装（含兼容与 toast）
- `src/composables/useKeepAlive.ts`
  - 用途：页面缓存组件名单管理

### composable 设计约定

- 命名统一 `useXxx`
- 单一职责，一个 composable 只解决一类问题
- 对外返回最小能力（方法 + 必需状态）

---

## 九、最小交付清单（可复用站点模板）

新建站点时，至少交付以下内容：

1. 基础组件：分页列表、弹窗、空态、筛选栏
2. i18n：语言包 + 初始化插件 + 切换持久化
3. API：请求插件 + 拦截器 + 方法工厂 + 统一返回体
4. Design Token：spacing/fontSize/radius + safelist 生成
5. Theme：light/dark 变量 + 切换 composable
6. Utils：互斥锁、请求合并、事件总线、时间工具
7. Composables：auth、redirect、language、theme、device、route

---

## 十、推荐执行顺序（团队实践）

1. 先搭基础设施（i18n/api/token/theme）
2. 再落地通用组件（列表/弹窗/空态/筛选）
3. 然后抽 composables 与 utils
4. 最后再接业务页面，避免后期大规模返工

> 这份 skill 的核心是：先把“稳定可复用层”做好，再接业务，保证项目在不同站点间快速复制。

---

## 十一、AI 可执行建站协议（可直接照做）

以下协议用于“后续 AI 按文档直接创建初始结构”，请严格按顺序执行，不跳步。

### Step 0：约束

- 不接入任何业务页面逻辑
- 仅创建基础设施与示例页
- 所有网络请求必须经过 `src/modules/api`，禁止在页面内直接调用 `$fetch`
- 主题与颜色必须使用 token / css var，禁止硬编码颜色

### Step 1：目录初始化（若缺失则创建）

```text
src/
  components/
    base/
  composables/
  design/
  lang/
  modules/
    api/
      interceptors/
      plugins/
      methods/
      schemas/
  stores/
  utils/
    request/
docs/
```

### Step 2：能力底座初始化顺序

1. i18n（`nuxt.config.ts` + `src/plugins/i18n.client.ts`）
2. API 基础层（`plugins` + `interceptors` + `ApiHelper`）
3. design token（`src/design/token.ts` + `uno.config.ts`）
4. 主题（`themes.scss` + `useTheme.ts`）
5. utils/composables（最小高复用集合）
6. 基础组件（弹窗/分页列表/空态）

### Step 3：AI 自检（每步完成后）

- 是否新增了绕过 API 层的直接请求？如有，必须回滚
- 是否有硬编码颜色值？如有，改为语义色
- 是否有不可复用的业务命名？如有，泛化命名

---

## 十二、API 封装统一性能规范（重点）

本节是统一性能的核心要求，后续 AI 创建 API 层时必须 100% 满足。

### 1）统一入口

- 单一入口：`src/modules/api/plugins/api.ts`
- 单一工厂：`src/modules/api/ApiHelper.ts` 的 `makeMethod`
- 单一返回体：`ApiResult<T>`

### 2）性能基线（默认值）

- `timeout`: `10000ms`
- 网络重试：`retry = 2`，`retryDelay = 1000ms`
- 业务重试：仅对可重试业务码（如 `SystemErrorApiCode`），最多 `3` 次
- 并发控制：对“同 key 重复请求”启用请求去重（in-flight dedupe）
- 缓存策略：
  - GET/查询类接口默认支持短缓存（建议 `5-30s`）
  - 变更类接口（create/update/delete）默认不缓存
- 取消策略：
  - 路由切换或组件卸载时可取消未完成请求（AbortController）

### 3）稳定性要求

- Header 注入统一在拦截器（token/sign/common）
- 错误转换统一在 `ResponseBase`，页面层不解析底层错误结构
- 日志采集统一埋点：
  - `requestId`
  - `url`
  - `duration`
  - `retryCount`
  - `resultCode`

### 4）可观测性要求

- 在开发环境输出慢请求告警（例如 `duration > 1500ms`）
- 在测试环境可开关请求日志（通过 runtimeConfig）
- 对重试请求打印结构化日志，便于定位重试风暴

### 5）方法层标准形态

每个接口方法均遵循：

1. `makeMethod(name, url)` 创建
2. 可选 `setBodyInterceptors`（参数预处理）
3. 可选 `setOptionsInterceptors`（超时、缓存、重试策略覆盖）
4. `fetch/asyncData` 二选一或同时暴露

---

## 十三、AI 生成 API 时的强制模板

后续 AI 创建新接口时，必须按以下模板，不得自由发挥风格。

```ts
// src/modules/api/methods/<Domain>/<Action>/index.ts
export const XxxMethod = makeMethod<ReqType, ResType>(
  "XxxMethod",
  "/api/xxx",
);

XxxMethod.setOptionsInterceptors((options) => ({
  ...options,
  timeout: 10000,
  retry: 2,
}));
```

```ts
// 组件/页面内调用（示意）
const result = await XxxMethod.fetch({
  body: payload,
});

if (!result?.ok) {
  useSingle().Alert(result?.msg || "Request error");
  return;
}
```

### 禁止事项

- 禁止在页面里写 `$fetch(...)`
- 禁止在页面里拼 token/sign header
- 禁止每个页面自行处理重试策略

---

## 十四、统一性能验收清单（AI 完成后必须验证）

- [ ] 全项目请求是否全部经过 `makeMethod` / `$api`
- [ ] 是否存在重复请求未去重（同参数同时间窗口）
- [ ] 查询接口是否具备可配置缓存
- [ ] 慢请求是否可被日志发现
- [ ] 失败重试是否只对允许重试的场景生效
- [ ] 页面层代码是否只消费 `ok/data/msg`

建议基准（非强制）：

- 首屏关键 API 总耗时 P95 < 1200ms（测试环境）
- 单页面重复点击同操作，不出现并发风暴

---

## 十五、给后续 AI 的直接执行指令（复制可用）

将以下文本直接给 AI，可按本 skill 自动创建初始结构：

```text
请按 docs/skill-rapid-web-frontend.md 执行初始化，不做业务功能：
1) 先完成 i18n、API、design token、theme 四层基础设施；
2) API 必须走 src/modules/api/plugins/api.ts + ApiHelper.makeMethod；
3) 严格满足“API 封装统一性能规范”章节中的 timeout/retry/去重/缓存/日志要求；
4) 再补齐高复用 utils/composables 与基础组件骨架；
5) 最后给出“统一性能验收清单”的逐项结果。
```
