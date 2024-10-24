import { ProductModel } from "@/app/Models/ProductModel";

export const fetchDeleteProductAsync = async (data: Set<ProductModel>) => {
    const productArray = Array.from(data);

if (productArray.length > 0) {
    productArray.forEach(product => {
        console.log(product.id); // Access the id of each product
    });
} else {
    console.log("No products available.");
}
};