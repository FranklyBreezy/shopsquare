package com.shopsquare.productservice.service;

import com.shopsquare.productservice.entity.Product;

import java.util.List;
import java.util.Optional;

public interface ProductService {

    Product createProduct(Product product);

    List<Product> getAllProducts();

    Optional<Product> getProductById(Long id);

    List<Product> getProductsByShopId(Long shopId);

    Product updateProduct(Long id, Product productDetails);

    void deleteProduct(Long id);
}
