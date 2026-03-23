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

const selectedSku = computed(() => currentDetail.value?.skuList.find(item => item.skuId === selectedSkuId.value))

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
  const result = await productApi.queryCart()
  if (!result.isOk) {
    return
  }
  const data = result.getData()
  cartTotalCount.value = data?.cartTotalCount || 0
  cartTotalAmount.value = data?.cartTotalAmount || 0
}

async function loadCategories() {
  const result = await productApi.queryCategoryList()
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
  const result = await productApi.querySpuList({
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
  const result = await productApi.querySpuDetail({ spuId })
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
  const result = await productApi.createCartItem({
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
  <view class="h-screen flex flex-col bg-page pb-150rpx">
    <view class="bg-white px-24rpx pt-20rpx pb-16rpx">
      <view class="mb-14rpx flex items-center">
        <text class="mr-12rpx text-30rpx text-gray-800 font-700">海棠文化广场店</text>
        <text class="text-24rpx text-gray-500">约 12m</text>
      </view>
      <view class="flex gap-12rpx">
        <view class="h-68rpx flex-1 rounded-full bg-gray-100 px-20rpx text-24rpx text-gray-400 leading-68rpx">
          🔍 中国茶咖
        </view>
        <view class="h-68rpx w-108rpx rounded-full bg-gray-100 text-center text-24rpx text-gray-700 leading-68rpx">
          筛选
        </view>
      </view>
    </view>

    <view class="flex flex-1 overflow-hidden">
      <scroll-view class="w-180rpx bg-sidebar" scroll-y>
        <view
          v-for="item in categories"
          :key="item.categoryId"
          class="border-l-6rpx border-l-transparent px-12rpx py-24rpx text-center text-24rpx text-gray-500"
          :class="item.categoryId === activeCategoryId ? 'bg-white border-l-blue-600 text-gray-900 font-600' : ''"
          @click="changeCategory(item.categoryId)"
        >
          {{ item.categoryName }}
        </view>
      </scroll-view>

      <scroll-view class="flex-1 px-16rpx py-18rpx" scroll-y>
        <view v-if="loading" class="p-20rpx text-24rpx text-gray-500">
          加载中...
        </view>
        <view v-else>
          <view
            v-for="item in products"
            :key="item.spuId"
            class="mb-16rpx flex rounded-16rpx bg-white p-18rpx"
            @click="openSpec(item.spuId)"
          >
            <view class="mr-16rpx h-132rpx w-132rpx rounded-full bg-gradient-to-br from-amber-200 to-red-300" />
            <view class="flex-1">
              <view class="mb-8rpx text-30rpx text-gray-900 font-700">
                {{ item.title }}
              </view>
              <view class="mb-12rpx text-22rpx text-gray-500">
                {{ item.subTitle || '精选风味' }}
              </view>
              <view class="flex items-center justify-between">
                <text class="text-32rpx text-red-500 font-700">¥{{ item.basePrice }}</text>
                <view class="h-52rpx w-52rpx rounded-full bg-blue-600 text-center text-36rpx text-white leading-52rpx" @click.stop="quickAdd(item)">
                  +
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view
      class="fixed bottom-20rpx left-24rpx right-24rpx flex items-center justify-between rounded-full bg-gray-900 px-22rpx py-18rpx text-white"
      @click="goCartPage"
    >
      <view class="flex flex-col">
        <text class="text-24rpx">购物车 {{ cartTotalCount }} 件</text>
        <text class="text-28rpx font-700">合计 ¥{{ cartTotalAmount }}</text>
      </view>
      <view class="rounded-full bg-blue-600 px-24rpx py-12rpx text-24rpx">
        去结算
      </view>
    </view>

    <view v-if="showSpec" class="fixed inset-0 flex items-end bg-black bg-opacity-45" @click="showSpec = false">
      <view class="max-h-75vh w-full overflow-y-auto rounded-t-24rpx bg-white px-24rpx pb-32rpx pt-28rpx" @click.stop>
        <view v-if="detailLoading" class="p-20rpx text-24rpx text-gray-500">
          加载规格中...
        </view>
        <view v-else-if="currentDetail">
          <view class="mb-8rpx text-34rpx font-700">
            {{ currentDetail.title }}
          </view>
          <view class="mb-20rpx text-24rpx text-gray-500">
            {{ currentDetail.subTitle || '请按喜好选择规格与口味' }}
          </view>

          <view class="mb-20rpx">
            <view class="mb-10rpx text-26rpx font-600">
              规格
            </view>
            <view class="flex flex-wrap gap-12rpx">
              <view
                v-for="sku in currentDetail.skuList"
                :key="sku.skuId"
                class="rounded-full bg-gray-100 px-16rpx py-10rpx text-22rpx text-gray-700"
                :class="sku.skuId === selectedSkuId ? 'bg-blue-100 text-blue-700' : ''"
                @click="selectedSkuId = sku.skuId"
              >
                {{ sku.skuName }}<text v-if="sku.priceDelta > 0"> +{{ sku.priceDelta }}</text>
              </view>
            </view>
          </view>

          <view v-for="group in currentDetail.attributeGroups" :key="group.groupId" class="mb-20rpx">
            <view class="mb-10rpx text-26rpx font-600">
              {{ group.groupName }}
            </view>
            <view class="flex flex-wrap gap-12rpx">
              <view
                v-for="item in group.items"
                :key="item.itemId"
                class="rounded-full bg-gray-100 px-16rpx py-10rpx text-22rpx text-gray-700"
                :class="selectedAttributes[group.groupId] === item.itemId ? 'bg-blue-100 text-blue-700' : ''"
                @click="setAttribute(group.groupId, item.itemId)"
              >
                {{ item.itemName }}<text v-if="item.priceDelta > 0"> +{{ item.priceDelta }}</text>
              </view>
            </view>
          </view>

          <view v-if="currentDetail.availableToppings.length" class="mb-20rpx">
            <view class="mb-10rpx text-26rpx font-600">
              小料（可选）
            </view>
            <view class="flex flex-wrap gap-12rpx">
              <view
                v-for="item in currentDetail.availableToppings"
                :key="item.toppingId"
                class="rounded-full bg-gray-100 px-16rpx py-10rpx text-22rpx text-gray-700"
                :class="selectedToppingIds.includes(item.toppingId) ? 'bg-blue-100 text-blue-700' : ''"
                @click="toggleTopping(item.toppingId)"
              >
                {{ item.name }}<text v-if="item.priceDelta > 0"> +{{ item.priceDelta }}</text>
              </view>
            </view>
          </view>

          <view class="mt-10rpx flex items-center justify-between">
            <view class="flex items-center">
              <view class="h-52rpx w-52rpx rounded-full bg-gray-100 text-center text-32rpx leading-52rpx" @click="decreaseCount">
                -
              </view>
              <text class="w-64rpx text-center text-26rpx">{{ quantity }}</text>
              <view class="h-52rpx w-52rpx rounded-full bg-gray-100 text-center text-32rpx leading-52rpx" @click="increaseCount">
                +
              </view>
            </view>
            <view class="rounded-full bg-blue-600 px-28rpx py-16rpx text-24rpx text-white" @click="addCurrentToCart">
              加入购物车 ¥{{ totalPrice }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
