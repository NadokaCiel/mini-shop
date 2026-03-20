<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { productApi } from '@/api'
import { ROUTE_PATH } from '@/router/route-map'

const loading = ref(false)
const categories = ref<productApi.ProductCategoryItem[]>([])
const activeCategoryId = ref('')
const products = ref<productApi.ProductSpuListItem[]>([])

const showSpec = ref(false)
const detailLoading = ref(false)
const currentDetail = ref<productApi.QuerySpuDetailResponse | null>(null)
const selectedSkuId = ref('')
const selectedAttributes = ref<Record<string, string>>({})
const selectedToppingIds = ref<string[]>([])
const quantity = ref(1)

const cartTotalCount = ref(0)
const cartTotalAmount = ref(0)

const selectedSku = computed(() => {
  return currentDetail.value?.skuList.find(item => item.skuId === selectedSkuId.value)
})

const selectedAttributeDelta = computed(() => {
  if (!currentDetail.value) {
    return 0
  }
  return currentDetail.value.attributeGroups.reduce((sum, group) => {
    const selectedItemId = selectedAttributes.value[group.groupId]
    const target = group.items.find(item => item.itemId === selectedItemId)
    return sum + (target?.priceDelta || 0)
  }, 0)
})

const selectedToppingDelta = computed(() => {
  if (!currentDetail.value) {
    return 0
  }
  const toppingSet = new Set(selectedToppingIds.value)
  return currentDetail.value.availableToppings.reduce((sum, item) => {
    return toppingSet.has(item.toppingId) ? sum + item.priceDelta : sum
  }, 0)
})

const singlePrice = computed(() => {
  if (!currentDetail.value) {
    return 0
  }
  return currentDetail.value.basePrice + (selectedSku.value?.priceDelta || 0) + selectedAttributeDelta.value + selectedToppingDelta.value
})

const totalPrice = computed(() => singlePrice.value * quantity.value)

async function loadCartSummary() {
  const [result] = await productApi.queryCart()
  if (!result.isOk) {
    return
  }
  const data = result.getData()
  cartTotalCount.value = data?.cartTotalCount || 0
  cartTotalAmount.value = data?.cartTotalAmount || 0
}

async function loadCategories() {
  const [result] = await productApi.queryCategoryList()
  if (!result.isOk) {
    categories.value = [
      { categoryId: 'cat_hot', categoryName: '热销', sort: 1 },
      { categoryId: 'cat_coffee', categoryName: '咖啡', sort: 2 },
    ]
  }
  else {
    categories.value = result.getData() || []
  }
  activeCategoryId.value = categories.value[0]?.categoryId || ''
}

async function loadProducts(categoryId: string) {
  if (!categoryId) {
    products.value = []
    return
  }
  loading.value = true
  const [result] = await productApi.querySpuList({
    categoryId,
    pageNum: 1,
    pageSize: 30,
  })
  if (!result.isOk) {
    products.value = []
    loading.value = false
    return
  }
  products.value = result.getData()?.list || []
  loading.value = false
}

async function changeCategory(categoryId: string) {
  if (activeCategoryId.value === categoryId) {
    return
  }
  activeCategoryId.value = categoryId
  await loadProducts(categoryId)
}

function initSpecSelection(detail: productApi.QuerySpuDetailResponse) {
  selectedSkuId.value = detail.skuList[0]?.skuId || ''
  const nextSelected: Record<string, string> = {}
  detail.attributeGroups.forEach((group) => {
    const defaultItem = group.items.find(item => item.isDefault) || group.items[0]
    if (defaultItem) {
      nextSelected[group.groupId] = defaultItem.itemId
    }
  })
  selectedAttributes.value = nextSelected
  selectedToppingIds.value = []
  quantity.value = 1
}

async function openSpec(spuId: string) {
  detailLoading.value = true
  const [result] = await productApi.querySpuDetail({ spuId })
  detailLoading.value = false
  if (!result.isOk) {
    uni.showToast({
      title: result.getMsg(),
      icon: 'none',
    })
    return
  }
  const data = result.getData()
  if (!data) {
    return
  }
  currentDetail.value = data
  initSpecSelection(data)
  showSpec.value = true
}

function toggleTopping(toppingId: string) {
  const set = new Set(selectedToppingIds.value)
  if (set.has(toppingId)) {
    set.delete(toppingId)
  }
  else {
    set.add(toppingId)
  }
  selectedToppingIds.value = [...set]
}

function setAttribute(groupId: string, itemId: string) {
  selectedAttributes.value[groupId] = itemId
}

async function addCurrentToCart() {
  if (!currentDetail.value) {
    return
  }
  if (!selectedSkuId.value) {
    uni.showToast({
      title: '请选择规格',
      icon: 'none',
    })
    return
  }
  const selectedAttributeItems = Object.keys(selectedAttributes.value).map(groupId => ({
    groupId,
    itemId: selectedAttributes.value[groupId],
  }))
  const [result] = await productApi.createCartItem({
    quantity: quantity.value,
    selectedAttributeItems,
    selectedToppingIds: selectedToppingIds.value,
    skuId: selectedSkuId.value,
    spuId: currentDetail.value.spuId,
  })
  if (!result.isOk) {
    uni.showToast({
      title: result.getMsg(),
      icon: 'none',
    })
    return
  }
  const data = result.getData()
  cartTotalCount.value = data?.cartTotalCount || cartTotalCount.value
  cartTotalAmount.value = data?.cartTotalAmount || cartTotalAmount.value
  showSpec.value = false
  uni.showToast({
    title: '已加入购物车',
    icon: 'none',
  })
}

function increaseCount() {
  quantity.value += 1
}

function decreaseCount() {
  if (quantity.value <= 1) {
    return
  }
  quantity.value -= 1
}

function goCartPage() {
  uni.switchTab({
    url: ROUTE_PATH.tabCart,
  })
}

async function quickAdd(item: productApi.ProductSpuListItem) {
  await openSpec(item.spuId)
}

onMounted(async () => {
  await loadCategories()
  await loadProducts(activeCategoryId.value)
  await loadCartSummary()
})
</script>

<template>
  <view class="menu-page">
    <view class="header">
      <view class="store-info">
        <text class="store-name">海棠文化广场店</text>
        <text class="store-distance">约 12m</text>
      </view>
      <view class="header-tools">
        <view class="search-box">
          🔍 中国茶咖
        </view>
        <view class="filter-btn">
          筛选
        </view>
      </view>
    </view>

    <view class="content">
      <scroll-view class="category-pane" scroll-y>
        <view
          v-for="item in categories"
          :key="item.categoryId"
          class="category-item"
          :class="{ active: item.categoryId === activeCategoryId }"
          @click="changeCategory(item.categoryId)"
        >
          {{ item.categoryName }}
        </view>
      </scroll-view>

      <scroll-view class="product-pane" scroll-y>
        <view v-if="loading" class="loading">
          加载中...
        </view>
        <view v-else>
          <view
            v-for="item in products"
            :key="item.spuId"
            class="product-card"
            @click="openSpec(item.spuId)"
          >
            <view class="product-cover" />
            <view class="product-main">
              <view class="product-title">
                {{ item.title }}
              </view>
              <view class="product-subtitle">
                {{ item.subTitle || '精选风味' }}
              </view>
              <view class="product-footer">
                <text class="price">¥{{ item.basePrice }}</text>
                <view class="add-btn" @click.stop="quickAdd(item)">
                  +
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="cart-bar" @click="goCartPage">
      <view class="cart-left">
        <text class="cart-count">购物车 {{ cartTotalCount }} 件</text>
        <text class="cart-amount">合计 ¥{{ cartTotalAmount }}</text>
      </view>
      <view class="cart-action">
        去结算
      </view>
    </view>

    <view v-if="showSpec" class="spec-mask" @click="showSpec = false">
      <view class="spec-panel" @click.stop>
        <view v-if="detailLoading" class="loading">
          加载规格中...
        </view>
        <view v-else-if="currentDetail">
          <view class="spec-title">
            {{ currentDetail.title }}
          </view>
          <view class="spec-subtitle">
            {{ currentDetail.subTitle || '请按喜好选择规格与口味' }}
          </view>

          <view class="group">
            <view class="group-title">
              规格
            </view>
            <view class="chips">
              <view
                v-for="sku in currentDetail.skuList"
                :key="sku.skuId"
                class="chip"
                :class="{ active: sku.skuId === selectedSkuId }"
                @click="selectedSkuId = sku.skuId"
              >
                {{ sku.skuName }}<text v-if="sku.priceDelta > 0"> +{{ sku.priceDelta }}</text>
              </view>
            </view>
          </view>

          <view
            v-for="group in currentDetail.attributeGroups"
            :key="group.groupId"
            class="group"
          >
            <view class="group-title">
              {{ group.groupName }}
            </view>
            <view class="chips">
              <view
                v-for="item in group.items"
                :key="item.itemId"
                class="chip"
                :class="{ active: selectedAttributes[group.groupId] === item.itemId }"
                @click="setAttribute(group.groupId, item.itemId)"
              >
                {{ item.itemName }}<text v-if="item.priceDelta > 0"> +{{ item.priceDelta }}</text>
              </view>
            </view>
          </view>

          <view v-if="currentDetail.availableToppings.length" class="group">
            <view class="group-title">
              小料（可选）
            </view>
            <view class="chips">
              <view
                v-for="item in currentDetail.availableToppings"
                :key="item.toppingId"
                class="chip"
                :class="{ active: selectedToppingIds.includes(item.toppingId) }"
                @click="toggleTopping(item.toppingId)"
              >
                {{ item.name }}<text v-if="item.priceDelta > 0"> +{{ item.priceDelta }}</text>
              </view>
            </view>
          </view>

          <view class="spec-footer">
            <view class="counter">
              <view class="step-btn" @click="decreaseCount">
                -
              </view>
              <text class="count">{{ quantity }}</text>
              <view class="step-btn" @click="increaseCount">
                +
              </view>
            </view>
            <view class="confirm-btn" @click="addCurrentToCart">
              加入购物车 ¥{{ totalPrice }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.menu-page {
  min-height: 100vh;
  padding-bottom: 150rpx;
  background: #f6f7fb;
}

.header {
  padding: 20rpx 24rpx 16rpx;
  background: #fff;
}

.store-info {
  display: flex;
  align-items: center;
  margin-bottom: 14rpx;
}

.store-name {
  margin-right: 12rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: #1f2937;
}

.store-distance {
  font-size: 24rpx;
  color: #6b7280;
}

.header-tools {
  display: flex;
  gap: 12rpx;
}

.search-box {
  flex: 1;
  height: 68rpx;
  padding: 0 20rpx;
  line-height: 68rpx;
  border-radius: 999rpx;
  background: #f3f4f6;
  color: #9ca3af;
  font-size: 24rpx;
}

.filter-btn {
  width: 108rpx;
  height: 68rpx;
  line-height: 68rpx;
  border-radius: 999rpx;
  text-align: center;
  background: #f3f4f6;
  color: #374151;
  font-size: 24rpx;
}

.content {
  display: flex;
  height: calc(100vh - 290rpx);
}

.category-pane {
  width: 180rpx;
  background: #f0f2f6;
}

.category-item {
  padding: 24rpx 12rpx;
  text-align: center;
  font-size: 24rpx;
  color: #6b7280;
  border-left: 6rpx solid transparent;
}

.category-item.active {
  color: #111827;
  font-weight: 600;
  background: #fff;
  border-left-color: #2563eb;
}

.product-pane {
  flex: 1;
  padding: 18rpx 16rpx;
}

.product-card {
  display: flex;
  margin-bottom: 16rpx;
  padding: 18rpx;
  border-radius: 16rpx;
  background: #fff;
}

.product-cover {
  width: 132rpx;
  height: 132rpx;
  margin-right: 16rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #fde68a, #fca5a5);
}

.product-main {
  flex: 1;
}

.product-title {
  margin-bottom: 8rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
}

.product-subtitle {
  margin-bottom: 12rpx;
  font-size: 22rpx;
  color: #6b7280;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 32rpx;
  color: #ef4444;
  font-weight: 700;
}

.add-btn {
  width: 52rpx;
  height: 52rpx;
  line-height: 52rpx;
  text-align: center;
  border-radius: 50%;
  color: #fff;
  font-size: 36rpx;
  background: #2563eb;
}

.cart-bar {
  position: fixed;
  left: 24rpx;
  right: 24rpx;
  bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 22rpx;
  border-radius: 999rpx;
  background: #111827;
  color: #fff;
}

.cart-left {
  display: flex;
  flex-direction: column;
}

.cart-count {
  font-size: 24rpx;
}

.cart-amount {
  font-size: 28rpx;
  font-weight: 700;
}

.cart-action {
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
  background: #2563eb;
  font-size: 24rpx;
}

.spec-mask {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-end;
  background: rgb(17 24 39 / 45%);
}

.spec-panel {
  width: 100%;
  max-height: 75vh;
  overflow-y: auto;
  padding: 28rpx 24rpx 32rpx;
  border-radius: 24rpx 24rpx 0 0;
  background: #fff;
}

.spec-title {
  margin-bottom: 8rpx;
  font-size: 34rpx;
  font-weight: 700;
}

.spec-subtitle {
  margin-bottom: 20rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.group {
  margin-bottom: 20rpx;
}

.group-title {
  margin-bottom: 10rpx;
  font-size: 26rpx;
  font-weight: 600;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.chip {
  padding: 10rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  color: #374151;
  background: #f3f4f6;
}

.chip.active {
  color: #1d4ed8;
  background: #dbeafe;
}

.spec-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10rpx;
}

.counter {
  display: flex;
  align-items: center;
}

.step-btn {
  width: 52rpx;
  height: 52rpx;
  line-height: 52rpx;
  text-align: center;
  border-radius: 50%;
  background: #f3f4f6;
  font-size: 32rpx;
}

.count {
  width: 64rpx;
  text-align: center;
  font-size: 26rpx;
}

.confirm-btn {
  padding: 16rpx 28rpx;
  border-radius: 999rpx;
  color: #fff;
  font-size: 24rpx;
  background: #2563eb;
}

.loading {
  padding: 20rpx;
  color: #6b7280;
  font-size: 24rpx;
}
</style>
