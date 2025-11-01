package com.shopsquare.orderservice.controller;

import com.shopsquare.orderservice.entity.Order;
import com.shopsquare.orderservice.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Order Management", description = "APIs for managing orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Create a new order", description = "Creates a new order in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.createOrder(order));
    }

    @GetMapping
    @Operation(summary = "Get all orders", description = "Retrieves a list of all orders in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of orders")
    })
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Retrieves a specific order by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order found successfully"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<Order> getOrderById(
            @Parameter(description = "ID of the order to retrieve", required = true)
            @PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update order", description = "Updates an existing order's information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order updated successfully"),
            @ApiResponse(responseCode = "404", description = "Order not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<Order> updateOrder(
            @Parameter(description = "ID of the order to update", required = true)
            @PathVariable Long id, 
            @RequestBody Order orderDetails) {
        Order updatedOrder = orderService.updateOrder(id, orderDetails);
        if (updatedOrder != null) {
            return ResponseEntity.ok(updatedOrder);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/shop/{shopId}")
    @Operation(summary = "Get orders by shop ID", description = "Retrieves all orders for a specific shop")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Orders found successfully")
    })
    public ResponseEntity<List<Order>> getOrdersByShopId(
            @Parameter(description = "ID of the shop", required = true)
            @PathVariable Long shopId) {
        return ResponseEntity.ok(orderService.getOrdersByShopId(shopId));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get orders by user ID", description = "Retrieves all orders for a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Orders found successfully")
    })
    public ResponseEntity<List<Order>> getOrdersByUserId(
            @Parameter(description = "ID of the user", required = true)
            @PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update order status", description = "Updates the status of an order")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<Order> updateOrderStatus(
            @Parameter(description = "ID of the order to update", required = true)
            @PathVariable Long id,
            @RequestBody String status) {
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        if (updatedOrder != null) {
            return ResponseEntity.ok(updatedOrder);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete order", description = "Deletes an order from the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Order deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<Void> deleteOrder(
            @Parameter(description = "ID of the order to delete", required = true)
            @PathVariable Long id) {
        if (orderService.deleteOrder(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
