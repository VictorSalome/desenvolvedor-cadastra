// Interface para representar um produto
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string[];
  parcelamento: [number, number];
  date: string;
}

// Array de produtos a serem exibidos
export let productsToShow: Product[] = [];