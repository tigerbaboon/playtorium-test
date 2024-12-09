export type Product = {
  id: number
  name: string
  price: number
  categoryId: number
  categoryName: string
}

export type SelectProduct = {
  product: Product
  quantity: number
  totalPrice: number
}
