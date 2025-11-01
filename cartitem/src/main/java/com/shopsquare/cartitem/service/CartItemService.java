package com.shopsquare.cartitem.service;

import com.shopsquare.cartitem.entity.CartItem;
import java.util.List;
import java.util.Optional;

public interface CartItemService {
    CartItem createCartItem(CartItem cartItem);
    Optional<CartItem> getCartItemById(int id);
    List<CartItem> getAllCartItems();
    CartItem updateCartItem(int id, CartItem cartItem);
    void deleteCartItem(int id);
}

