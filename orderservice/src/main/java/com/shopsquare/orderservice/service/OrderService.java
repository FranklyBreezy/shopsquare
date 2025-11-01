package com.shopsquare.orderservice.service;

import com.shopsquare.orderservice.entity.Order;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    Order createOrder(Order order);

    List<Order> getAllOrders();

    Optional<Order> getOrderById(Long id);

    List<Order> getOrdersByShopId(Long shopId);

    List<Order> getOrdersByUserId(Long userId);

    Order updateOrder(Long id, Order orderDetails);

    Order updateOrderStatus(Long id, String status);

    boolean deleteOrder(Long id);
}
