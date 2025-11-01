package com.shopsquare.cartservice.service;

import com.shopsquare.cartservice.entity.Cart;
import java.util.List;
import java.util.Optional;
import java.util.Map;

public interface CartService {
    Cart createCart(Cart cart);
    Optional<Cart> getCartById(int id);
    List<Cart> getCartsByUserId(int userId);
    List<Cart> getAllCarts();
    Cart updateCart(int id, Cart cart);
    void deleteCart(int id);
    Object addItemToCart(int cartId, Map<String, Object> cartItemPayload);
    List<?> getItemsForCart(int cartId);
}
