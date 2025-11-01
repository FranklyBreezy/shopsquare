package com.shopsquare.cartitem.controller;

import com.shopsquare.cartitem.entity.CartItem;
import com.shopsquare.cartitem.service.CartItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart-items")
@Tag(name = "Cart Item Management", description = "APIs for managing cart items")
public class CartItemController {

    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    @PostMapping
    @Operation(summary = "Create a new cart item", description = "Creates a new cart item in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cart item created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<CartItem> createCartItem(@RequestBody CartItem cartItem) {
        try {
            return ResponseEntity.ok(cartItemService.createCartItem(cartItem));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get cart item by ID", description = "Retrieves a specific cart item by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cart item found successfully"),
            @ApiResponse(responseCode = "404", description = "Cart item not found")
    })
    public ResponseEntity<CartItem> getCartItemById(
            @Parameter(description = "ID of the cart item to retrieve", required = true)
            @PathVariable int id) {
        return cartItemService.getCartItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @Operation(summary = "Get all cart items", description = "Retrieves a list of all cart items in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of cart items")
    })
    public ResponseEntity<List<CartItem>> getAllCartItems(@RequestParam(value = "cartId", required = false) Integer cartId) {
        if (cartId != null) {
            return ResponseEntity.ok(cartItemService.getAllCartItems().stream().filter(ci -> ci.getCartId() == cartId).toList());
        }
        return ResponseEntity.ok(cartItemService.getAllCartItems());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update cart item", description = "Updates an existing cart item's information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cart item updated successfully"),
            @ApiResponse(responseCode = "404", description = "Cart item not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<CartItem> updateCartItem(
            @Parameter(description = "ID of the cart item to update", required = true)
            @PathVariable int id, 
            @RequestBody CartItem cartItem) {
        try {
            return ResponseEntity.ok(cartItemService.updateCartItem(id, cartItem));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete cart item", description = "Deletes a cart item from the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Cart item deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Cart item not found")
    })
    public ResponseEntity<Void> deleteCartItem(
            @Parameter(description = "ID of the cart item to delete", required = true)
            @PathVariable int id) {
        try {
            cartItemService.deleteCartItem(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

