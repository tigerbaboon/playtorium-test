<template>
  <div
    v-if="props.show"
    class="flex justify-end items-center transition-all duration-1000 ease-in-out"
  >
    <div class="fixed inset-0 flex items-center justify-center z-40">
      <div
        class="modal-overlay absolute w-full h-full bg-black/50"
        @click="emit('close')"
      />

      <div
        class="rounded-md bg-white max-sm:w-[90%] max-md:w-[70%] w-[50%] z-40 px-4 py-2 overflow-y-auto"
      >
        <div class="flex justify-between items-center me-2 pt-1">
          <div class="font-bold text-xl mb-3">Select Discount</div>
          <button @click="emit('close')">
            <Icon name="ant-design:close" />
          </button>
        </div>

        <hr class="border my-2" />
        <div class="grid gap-4">
          <div
            v-for="(discount, i) in discounts"
            :key="i"
            class="flex items-center gap-4"
          >
            <input
              @change="selectedDiscount = discount"
              type="radio"
              name="discount"
              class="form-radio h-5 w-5 text-primary"
            />
            {{ discount.name }}

            <div class="text-gray-500">( {{ discount.category }} )</div>
          </div>
          <button class="btn primary md w-full" @click="selectDiscount">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import jsonDiscount from '~/json/discount.json'
import type { Category } from '~/models/category'
import type { Discount } from '~/models/discount'
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const discounts = ref<Discount[]>(jsonDiscount)
const selectedDiscount = ref<Discount | null>(null)

const emit = defineEmits(['close', 'select'])

const selectDiscount = () => {
  emit('select', JSON.parse(JSON.stringify(selectedDiscount.value)))
  emit('close')
}
</script>

<style scoped></style>
