package com.shopsquare.orderitem.controller;

import com.shopsquare.orderitem.entity.OrderItem;
import com.shopsquare.orderitem.service.OrderItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@Tag(name = "Order Item Management", description = "APIs for managing order items")
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @PostMapping
    @Operation(summary = "Create a new order item", description = "Creates a new order item in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order item created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<OrderItem> createOrderItem(@RequestBody OrderItem orderItem) {
        return ResponseEntity.ok(orderItemService.createOrderItem(orderItem));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order item by ID", description = "Retrieves a specific order item by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order item found successfully"),
            @ApiResponse(responseCode = "404", description = "Order item not found")
    })
    public ResponseEntity<OrderItem> getOrderItemById(
            @Parameter(description = "ID of the order item to retrieve", required = true)
            @PathVariable int id) {
        return orderItemService.getOrderItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @Operation(summary = "Get all order items", description = "Retrieves a list of all order items in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of order items")
    })
    public ResponseEntity<List<OrderItem>> getAllOrderItems() {
        return ResponseEntity.ok(orderItemService.getAllOrderItems());
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get order items by order ID", description = "Retrieves all order items for a specific order")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order items found successfully")
    })
    public ResponseEntity<List<OrderItem>> getOrderItemsByOrderId(
            @Parameter(description = "ID of the order", required = true)
            @PathVariable int orderId) {
        return ResponseEntity.ok(orderItemService.getOrderItemsByOrderId(orderId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update order item", description = "Updates an existing order item's information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order item updated successfully"),
            @ApiResponse(responseCode = "404", description = "Order item not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<OrderItem> updateOrderItem(
            @Parameter(description = "ID of the order item to update", required = true)
            @PathVariable int id, 
            @RequestBody OrderItem orderItem) {
        return ResponseEntity.ok(orderItemService.updateOrderItem(id, orderItem));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete order item", description = "Deletes an order item from the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Order item deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Order item not found")
    })
    public ResponseEntity<Void> deleteOrderItem(
            @Parameter(description = "ID of the order item to delete", required = true)
            @PathVariable int id) {
        orderItemService.deleteOrderItem(id);
        return ResponseEntity.noContent().build();
    }
}
