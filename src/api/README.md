# API 模块方案（uni-app / 微信小程序）

## 目录分层

- `core/`
  - `types.ts`：统一类型（`ApiTuple`、`ApiResult`、`ApiTypeDeclaration`）
  - `contract.ts`：接口契约声明器 `defineApiType`
  - `http-client.ts`：基于 `uni.request` 的请求客户端（token、重试、错误码、命名转换）
- `modules/<domain>/`
  - `types.ts`：该领域的严格入参/返参定义
  - `contracts.ts`：接口 path + schema 声明
  - `http.ts`：只负责编排请求调用
  - `index.ts`：导出 `getXxxHttp()` 和单接口函数
- `schemas/*.json`
  - 复杂请求/响应结构描述文件（用于契约补充）

## 调用约定

统一返回元组：

`Promise<[result, typeDeclaration]>`

- `result`：`ApiResult<T>`
  - `isOk`、`msg`、`getMsg()`、`getData()`
- `typeDeclaration`：当前接口契约（name/path/schema）

## 命名风格转换

- 请求：默认 `camelCase -> snake_case`
- 响应：统一 `snake_case -> camelCase`

转换发生在 `core/http-client.ts`，业务层不再写重复转换逻辑。

## 示例

```ts
const [result, typeDeclaration] = await getActivityHttp().queryActivityHome({
  activitySn: 'ACT_20260320',
})

if (!result.isOk) {
  console.log(result.getMsg())
  return
}

console.log(result.getData(), typeDeclaration.path)
```
