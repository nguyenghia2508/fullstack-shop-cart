import Product from "../models/Product"

interface CartItem {
  productID: string;
  productName: string;
  productNumber: number;
  productPrice: number;
  productImage: {
    path: string;
    name: string;
    imageType: string;
  };
}

export default async function getTotalPriceAndNumber(carts: CartItem[]) {
  let totalPrice = 0;
  let totalNumber = 0;
  const infoProduct: CartItem[] = [];

  for (const ct of carts) {
    const pc = await Product.findOne({ name: ct.productName });
    if (pc) {
      infoProduct.push({
        productID: pc.productID,
        productName: ct.productName,
        productNumber: ct.productNumber,
        productPrice: ct.productPrice,
        productImage: {
          path: ct.productImage.path,
          name: ct.productImage.name,
          imageType: ct.productImage.imageType,
        },
      });

      totalPrice += ct.productPrice * ct.productNumber;
      totalNumber += ct.productNumber;
    }
  }

  return { infoProduct, totalPrice, totalNumber };
}
