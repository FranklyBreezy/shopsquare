package com.shopsquare.productservice.service;

import com.shopsquare.productservice.entity.Product;
import com.shopsquare.productservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final RestTemplate restTemplate;

    @Value("${service.shop-service.name:shop-service}")
    private String shopServiceName;

    public ProductServiceImpl(ProductRepository productRepository, RestTemplate restTemplate) {
        this.productRepository = productRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public Product createProduct(Product product) {
        // validate shop exists via SHOP-SERVICE
        if (product.getShopId() != null) {
            try {
                String url = "http://" + shopServiceName + "/api/shops/" + product.getShopId();
                // Try to get shop details - if it throws exception, shop doesn't exist
                restTemplate.getForObject(url, Object.class);
            } catch (Exception e) {
                throw new RuntimeException("Shop with ID " + product.getShopId() + " does not exist or is not accessible");
            }
        }
        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public List<Product> getProductsByShopId(Long shopId) {
        return productRepository.findByShopId(shopId);
    }

    @Override
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Product not found with id " + id)
        );
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStock(productDetails.getStock());
        product.setImageUrl(productDetails.getImageUrl());
        product.setShopId(productDetails.getShopId());
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
