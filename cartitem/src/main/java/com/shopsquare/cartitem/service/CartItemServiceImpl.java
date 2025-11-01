package com.shopsquare.cartitem.service;

import com.shopsquare.cartitem.entity.CartItem;
import com.shopsquare.cartitem.repository.CartItemRepository;
import com.shopsquare.cartitem.service.CartItemService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;
    private final RestTemplate restTemplate;

    @Value("${service.product-service.name:product-service}")
    private String productServiceName;

    public CartItemServiceImpl(CartItemRepository cartItemRepository, RestTemplate restTemplate) {
        this.cartItemRepository = cartItemRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public CartItem createCartItem(CartItem cartItem) {
        if (cartItem == null) {
            throw new IllegalArgumentException("CartItem cannot be null");
        }
        
        if (cartItem.getProductId() <= 0) {
            throw new IllegalArgumentException("Product ID is required and must be positive");
        }
        
        if (cartItem.getCartId() <= 0) {
            throw new IllegalArgumentException("Cart ID is required and must be positive");
        }
        
        if (cartItem.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity is required and must be positive");
        }
        
        // Validate product exists via PRODUCT-SERVICE
        try {
            String url = "http://" + productServiceName + "/api/products/" + cartItem.getProductId();
            restTemplate.getForObject(url, Object.class);
        } catch (Exception e) {
            throw new RuntimeException("Product with ID " + cartItem.getProductId() + " does not exist or is not accessible", e);
        }
        
        return cartItemRepository.save(cartItem);
    }

    @Override
    public Optional<CartItem> getCartItemById(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("CartItem ID must be positive");
        }
        return cartItemRepository.findById(id);
    }

    @Override
    public List<CartItem> getAllCartItems() {
        return cartItemRepository.findAll();
    }

    @Override
    public CartItem updateCartItem(int id, CartItem cartItem) {
        if (cartItem == null) {
            throw new IllegalArgumentException("CartItem cannot be null");
        }
        
        if (id <= 0) {
            throw new IllegalArgumentException("CartItem ID must be positive");
        }
        
        if (cartItem.getProductId() <= 0) {
            throw new IllegalArgumentException("Product ID is required and must be positive");
        }
        
        if (cartItem.getCartId() <= 0) {
            throw new IllegalArgumentException("Cart ID is required and must be positive");
        }
        
        if (cartItem.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity is required and must be positive");
        }
        
        Optional<CartItem> existingCartItemOpt = cartItemRepository.findById(id);
        if (existingCartItemOpt.isPresent()) {
            CartItem existingCartItem = existingCartItemOpt.get();
            
            // Validate product exists if product ID is being changed
            if (existingCartItem.getProductId() != cartItem.getProductId()) {
                try {
                    String url = "http://" + productServiceName + "/api/products/" + cartItem.getProductId();
                    restTemplate.getForObject(url, Object.class);
                } catch (Exception e) {
                    throw new RuntimeException("Product with ID " + cartItem.getProductId() + " does not exist or is not accessible", e);
                }
            }
            
            existingCartItem.setCartId(cartItem.getCartId());
            existingCartItem.setProductId(cartItem.getProductId());
            existingCartItem.setQuantity(cartItem.getQuantity());
            return cartItemRepository.save(existingCartItem);
        }
        throw new RuntimeException("CartItem not found with id: " + id);
    }

    @Override
    public void deleteCartItem(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("CartItem ID must be positive");
        }
        
        if (!cartItemRepository.existsById(id)) {
            throw new RuntimeException("CartItem not found with id: " + id);
        }
        
        cartItemRepository.deleteById(id);
    }
}

