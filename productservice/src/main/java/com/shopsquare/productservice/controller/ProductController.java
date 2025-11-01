package com.shopsquare.productservice.controller;

import com.shopsquare.productservice.entity.Product;
import com.shopsquare.productservice.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Product Management", description = "APIs for managing products")
public class ProductController {

    private final ProductService productService; // now using interface

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @Operation(summary = "Create a new product", description = "Creates a new product in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @GetMapping
    @Operation(summary = "Get all products", description = "Retrieves a list of all products in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of products")
    })
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieves a specific product by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product found successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<Product> getProductById(
            @Parameter(description = "ID of the product to retrieve", required = true)
            @PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/shop/{shopId}")
    @Operation(summary = "Get products by shop ID", description = "Retrieves all products for a specific shop")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Products found successfully")
    })
    public ResponseEntity<List<Product>> getProductsByShopId(
            @Parameter(description = "ID of the shop", required = true)
            @PathVariable Long shopId) {
        return ResponseEntity.ok(productService.getProductsByShopId(shopId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update product", description = "Updates an existing product's information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product updated successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<Product> updateProduct(
            @Parameter(description = "ID of the product to update", required = true)
            @PathVariable Long id, 
            @RequestBody Product productDetails) {
        return ResponseEntity.ok(productService.updateProduct(id, productDetails));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product", description = "Deletes a product from the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Product deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "ID of the product to delete", required = true)
            @PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/decrement")
    @Operation(summary = "Decrement product stock", description = "Decrements stock by qty (query param)")
    public ResponseEntity<Product> decrementStock(
            @PathVariable Long id,
            @RequestParam(name = "qty", defaultValue = "1") int qty
    ) {
        Product product = productService.getProductById(id).orElse(null);
        if (product == null) return ResponseEntity.notFound().build();
        int current = product.getStock() == null ? 0 : product.getStock();
        int next = Math.max(0, current - Math.max(0, qty));
        product.setStock(next);
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }
}
