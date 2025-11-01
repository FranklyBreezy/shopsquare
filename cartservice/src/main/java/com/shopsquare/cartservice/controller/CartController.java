package com.shopsquare.cartservice.controller;


import com.shopsquare.cartservice.entity.Cart;
import com.shopsquare.cartservice.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carts")
@Tag(name = "Cart Management", description = "APIs for managing shopping carts")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    @Operation(summary = "Create a new cart", description = "Creates a new shopping cart in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cart created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<Cart> createCart(@RequestBody Cart cart) {
        try {
            return ResponseEntity.ok(cartService.createCart(cart));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get cart by ID", description = "Retrieves a specific cart by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cart found successfully"),
            @ApiResponse(responseCode = "404", description = "Cart not found")
    })
    public ResponseEntity<Cart> getCartById(
            @Parameter(description = "ID of the cart to retrieve", required = true)
            @PathVariable int id) {
        return cartService.getCartById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get carts by user ID", description = "Retrieves all carts for a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Carts found successfully")
    })
    public ResponseEntity<List<Cart>> getCartsByUserId(
            @Parameter(description = "ID of the user", required = true)
            @PathVariable int userId) {
        return ResponseEntity.ok(cartService.getCartsByUserId(userId));
    }

    @GetMapping
    @Operation(summary = "Get all carts", description = "Retrieves a list of all carts in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of carts")
    })
    public ResponseEntity<List<Cart>> getAllCarts() {
        return ResponseEntity.ok(cartService.getAllCarts());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update cart", description = "Updates an existing cart's information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cart updated successfully"),
            @ApiResponse(responseCode = "404", description = "Cart not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<Cart> updateCart(
            @Parameter(description = "ID of the cart to update", required = true)
            @PathVariable int id, 
            @RequestBody Cart cart) {
        try {
            return ResponseEntity.ok(cartService.updateCart(id, cart));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete cart", description = "Deletes a cart from the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Cart deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Cart not found")
    })
    public ResponseEntity<Void> deleteCart(
            @Parameter(description = "ID of the cart to delete", required = true)
            @PathVariable int id) {
        try {
            cartService.deleteCart(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<Object> addItem(@PathVariable int id, @RequestBody Map<String, Object> cartItemPayload) {
        return ResponseEntity.ok(cartService.addItemToCart(id, cartItemPayload));
    }

    @GetMapping("/{id}/items")
    public ResponseEntity<List<?>> getItems(@PathVariable int id) {
        return ResponseEntity.ok(cartService.getItemsForCart(id));
    }
}
