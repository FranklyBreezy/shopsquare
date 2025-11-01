package com.shopsquare.cartservice.service;

import com.shopsquare.cartservice.entity.Cart;
import com.shopsquare.cartservice.repository.CartRepository;
import com.shopsquare.cartservice.service.CartService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final RestTemplate restTemplate;

    @Value("${service.user-service.name:user-service}")
    private String userServiceName;

    @Value("${service.cart-item-service.name:cartitem}")
    private String cartItemServiceName;

    public CartServiceImpl(CartRepository cartRepository, RestTemplate restTemplate) {
        this.cartRepository = cartRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public Cart createCart(Cart cart) {
        if (cart == null) {
            throw new IllegalArgumentException("Cart cannot be null");
        }
        
        if (cart.getUserId() <= 0) {
            throw new IllegalArgumentException("User ID is required and must be positive");
        }
        
        if (cart.getShopId() <= 0) {
            throw new IllegalArgumentException("Shop ID is required and must be positive");
        }
        
        // validate user exists via USER-SERVICE
        try {
            String url = "http://" + userServiceName + "/api/users/" + cart.getUserId();
            restTemplate.getForObject(url, Object.class);
        } catch (Exception e) {
            throw new RuntimeException("User with ID " + cart.getUserId() + " does not exist or is not accessible", e);
        }
        
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    @Override
    public Object addItemToCart(int cartId, Map<String, Object> cartItemPayload) {
        String url = "http://" + cartItemServiceName + "/api/cart-items";
        Map<String, Object> payloadWithCartId = new HashMap<>(cartItemPayload);
        payloadWithCartId.putIfAbsent("cartId", cartId);
        return restTemplate.postForObject(url, payloadWithCartId, Object.class);
    }

    @Override
    public List<?> getItemsForCart(int cartId) {
        String url = "http://" + cartItemServiceName + "/api/cart-items?cartId=" + cartId;
        return restTemplate.getForObject(url, List.class);
    }

    @Override
    public Optional<Cart> getCartById(int id) {
        return cartRepository.findById(id);
    }

    @Override
    public List<Cart> getCartsByUserId(int userId) {
        return cartRepository.findByUserId(userId);
    }

    @Override
    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    @Override
    public Cart updateCart(int id, Cart cart) {
        if (cart == null) {
            throw new IllegalArgumentException("Cart cannot be null");
        }
        
        if (id <= 0) {
            throw new IllegalArgumentException("Cart ID must be positive");
        }
        
        if (cart.getUserId() <= 0) {
            throw new IllegalArgumentException("User ID is required and must be positive");
        }
        
        if (cart.getShopId() <= 0) {
            throw new IllegalArgumentException("Shop ID is required and must be positive");
        }
        
        Optional<Cart> existingCartOpt = cartRepository.findById(id);
        if (existingCartOpt.isPresent()) {
            Cart existingCart = existingCartOpt.get();
            
            // Validate user exists if user ID is being changed
            if (existingCart.getUserId() != cart.getUserId()) {
                try {
                    String url = "http://" + userServiceName + "/api/users/" + cart.getUserId();
                    restTemplate.getForObject(url, Object.class);
                } catch (Exception e) {
                    throw new RuntimeException("User with ID " + cart.getUserId() + " does not exist or is not accessible", e);
                }
            }
            
            existingCart.setUserId(cart.getUserId());
            existingCart.setShopId(cart.getShopId());
            existingCart.setUpdatedAt(LocalDateTime.now());
            return cartRepository.save(existingCart);
        }
        throw new RuntimeException("Cart not found with id: " + id);
    }

    @Override
    public void deleteCart(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("Cart ID must be positive");
        }
        
        if (!cartRepository.existsById(id)) {
            throw new RuntimeException("Cart not found with id: " + id);
        }
        
        cartRepository.deleteById(id);
    }
}

