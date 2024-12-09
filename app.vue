<template>
  <div class="flex justify-center">
    <div class="container p-4 flex flex-col md:flex-row gap-4">
      <div class="flex-none">
        <div class="title text-center">Select Products</div>
        <div class="box-card mt-4">
          <div
            class="card flex"
            v-for="product in products"
            :key="product.id"
            @click="addToCart(product)"
          >
            <div class="flex-none">
              <div class="text-lg font-bold">{{ product.name }}</div>
              <div class="text-sm text-gray-500">
                {{ product.categoryName }}
              </div>
            </div>
            <div class="flex-auto flex justify-end items-center">
              {{ product.price }} THB
            </div>
          </div>
        </div>
      </div>
      <div class="flex-auto">
        <div class="title text-center">Cart</div>
        <div class="mt-4 p-4 border-2 rounded-lg">
          <template v-if="selectProducts.length != 0">
            <div class="text-xl">Products:</div>
            <div
              v-for="(item, i) in selectProducts"
              class="flex justify-between"
            >
              <div class="flex gap-2">
                <div>{{ item.quantity }}</div>
                <div>{{ item.product.name }}:</div>
              </div>
              <div class="flex gap-2 items-center">
                <div>{{ item.product.price }} THB</div>
                <Icon
                  name="mdi:delete"
                  class="text-lg cursor-pointer"
                  @click="removeCart(item.product.id)"
                />
              </div>
            </div>
            <div class="mt-6">
              <button
                class="btn primary md w-full"
                @click="showModalDiscount = true"
              >
                Select Discount
              </button>

              <div class="mt-6">
                <div class="text-xl">Discount:</div>
                <div v-for="(discount, i) in discounts" :key="i" class="mt-2">
                  <div class="flex justify-between">
                    <div>{{ i + 1 }}. {{ discount.name }}</div>
                    <div>
                      <Icon
                        name="mdi:delete"
                        class="text-lg cursor-pointer"
                        @click="removeDiscount(discount.id)"
                      />
                    </div>
                  </div>
                  <div class="mt-2">
                    <template v-if="discount.category === 'coupon'">
                      <div class="form-input">
                        <div
                          class="absolute flex justify-center items-center h-full pl-3"
                        >
                          <Icon
                            :name="
                              discount.type == 'fixed'
                                ? 'mdi:cash'
                                : 'mdi:percent'
                            "
                            class="text-gray-500"
                          />
                        </div>
                        <input
                          v-model="discount.amount"
                          type="number"
                          class="group"
                        />
                      </div>
                    </template>
                    <template v-else-if="discount.category === 'on top'">
                      <template v-if="discount.type === 'category'">
                        <VueMultiselect
                          @update:modelValue="calDiscount"
                          v-model="discount.productCategory"
                          multiple
                          :options="categories"
                          placeholder="Select Category"
                          label="name"
                          track-by="id"
                          class="mb-2"
                        ></VueMultiselect>
                        <div class="form-input">
                          <div
                            class="absolute flex justify-center items-center h-full pl-3"
                          >
                            <Icon name="mdi:percent" class="text-gray-500" />
                          </div>
                          <input
                            v-model="discount.amount"
                            type="number"
                            class="group"
                          />
                        </div>
                      </template>
                      <template v-else-if="discount.type === 'point'">
                        <div class="form-input">
                          <div
                            class="absolute flex justify-center items-center h-full pl-3"
                          >
                            <div class="text-gray-500">P</div>
                          </div>
                          <input
                            v-model="discount.amount"
                            type="number"
                            class="group"
                          />
                        </div>
                      </template>
                    </template>
                    <template v-else-if="discount.category === 'seasonal'">
                      <label for="">Every</label>
                      <div class="form-input">
                        <div
                          class="absolute flex justify-center items-center h-full pl-3"
                        >
                          <Icon name="mdi:cash" class="text-gray-500" />
                        </div>
                        <input
                          v-model="discount.every"
                          type="number"
                          class="group"
                        />
                      </div>
                      <label for="">Discount</label>
                      <div class="form-input">
                        <div
                          class="absolute flex justify-center items-center h-full pl-3"
                        >
                          <Icon name="mdi:cash" class="text-gray-500" />
                        </div>
                        <input
                          v-model="discount.discount"
                          type="number"
                          class="group"
                        />
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-between mt-6 text-xl">
              <div>Total Price:</div>
              <div>{{ totalPrice }} THB</div>
            </div>
          </template>
          <template v-else>
            <div class="flex justify-center">no items</div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <SelectDiscount
    :show="showModalDiscount"
    @close="showModalDiscount = false"
    @select="selectDiscount($event)"
  ></SelectDiscount>
</template>

<script setup lang="ts">
import jsonProduct from '~/json/products.json'
import jsonCategory from '~/json/category.json'
import type { Product, SelectProduct } from './models/product'
import type { Category } from './models/category'
import type { Discount } from './models/discount'
const showModalDiscount = ref<boolean>(false)
const products = ref<Product[]>(jsonProduct)
const categories = ref<Category[]>(jsonCategory)
const selectProducts = ref<SelectProduct[]>([])
const discounts = ref<Discount[]>([])

const totalPrice = ref<Number>(0)

const addToCart = (product: Product) => {
  const selectProduct = selectProducts.value.find(
    (selectProduct) => selectProduct.product.id === product.id,
  )
  if (selectProduct) {
    selectProduct.totalPrice += product.price
    selectProduct.quantity++
  } else {
    selectProducts.value.push({
      product: product,
      quantity: 1,
      totalPrice: product.price,
    })
  }

  calDiscount()
}

const removeCart = (id: number) => {
  selectProducts.value = selectProducts.value.filter(
    (item) => item.product.id !== id,
  )

  if (selectProducts.value.length === 0) {
    discounts.value = []
  }

  calDiscount()
}

const selectDiscount = (discount: Discount) => {
  if (discounts.value.length === 0) {
    discounts.value.push(discount)
  } else {
    for (let i = 0; i < discounts.value.length; i++) {
      const e = discounts.value[i]
      if (e.id != discount.id) {
        const checkCategory = discounts.value.find(
          (e) => e.category === discount.category,
        )
        if (!checkCategory) {
          discounts.value.push(discount)
        }
      }
    }
  }
  calDiscount()
}

const removeDiscount = (id: number) => {
  discounts.value = discounts.value.filter((item) => item.id !== id)
}

watch(
  () => discounts.value,
  () => {
    calDiscount()
  },
  {
    deep: true,
  },
)

const calDiscount = () => {
  let calPrice = selectProducts.value.reduce(
    (acc, item) => acc + item.totalPrice,
    0,
  )

  for (let i = 0; i < discounts.value.length; i++) {
    const discount = discounts.value[i]

    if (discount.category === 'coupon') {
      if (discount.type === 'fixed') {
        calPrice -= discount.amount
      } else if (discount.type === 'percentage') {
        calPrice -= calPrice * (discount.amount / 100)
      }
    } else if (discount.category === 'on top') {
      if (discount.type === 'category') {
        for (let i = 0; i < selectProducts.value.length; i++) {
          const product = selectProducts.value[i]

          if (discount.productCategory) {
            for (let j = 0; j < discount.productCategory.length; j++) {
              const e = discount.productCategory[j]
              if (product.product.categoryId == e.id) {
                calPrice -= product.product.price * (discount.amount / 100)
              }
            }
          }
        }
      } else if (discount.type === 'point') {
        const twentyPercent = calPrice * 0.2
        if (discount.amount > twentyPercent) {
          calPrice -= twentyPercent
        } else {
          calPrice -= discount.amount
        }
      }
    } else if (discount.category === 'seasonal') {
      if (discount.every && discount.discount) {
        calPrice -= Math.floor(calPrice / discount.every) * discount.discount
      }
    }
  }

  totalPrice.value = calPrice
}
</script>

<style scoped></style>
