import type { Category } from './category'

export type Discount = {
  id: number
  category: string
  type: string
  name: string
  amount: number
  every?: number
  discount?: number
  productCategory?: Category[]
}
