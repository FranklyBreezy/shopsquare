package com.shopsquare.orderitem.service;

import com.shopsquare.orderitem.entity.OrderItem;
import java.util.List;
import java.util.Optional;

public interface OrderItemService {
    OrderItem createOrderItem(OrderItem orderItem);
    Optional<OrderItem> getOrderItemById(int id);
    List<OrderItem> getAllOrderItems();
    List<OrderItem> getOrderItemsByOrderId(int orderId);
    OrderItem updateOrderItem(int id, OrderItem orderItem);
    void deleteOrderItem(int id);
}
