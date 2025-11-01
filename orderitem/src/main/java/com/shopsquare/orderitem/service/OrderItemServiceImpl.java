package com.shopsquare.orderitem.service;

import com.shopsquare.orderitem.entity.OrderItem;
import com.shopsquare.orderitem.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final RestTemplate restTemplate;

    @Value("${service.product-service.name:product-service}")
    private String productServiceName;

    public OrderItemServiceImpl(OrderItemRepository orderItemRepository, RestTemplate restTemplate) {
        this.orderItemRepository = orderItemRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public OrderItem createOrderItem(OrderItem orderItem) {
        // ✅ FIX: Avoid comparing primitive int to null
        // If productId is a primitive (int), it can never be null.
        // We'll instead check that it's greater than 0 before calling the product service.
        if (orderItem.getProductId() > 0) {
            try {
                restTemplate.postForLocation(
                        "http://" + productServiceName + "/api/products/" + orderItem.getProductId()
                                + "/decrement?qty=" + orderItem.getQuantity(),
                        null
                );
            } catch (Exception ignored) {}
        }
        return orderItemRepository.save(orderItem);
    }

    @Override
    public Optional<OrderItem> getOrderItemById(int id) {
        return orderItemRepository.findById(id);
    }

    @Override
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    @Override
    public List<OrderItem> getOrderItemsByOrderId(int orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    @Override
    public OrderItem updateOrderItem(int id, OrderItem orderItem) {
        Optional<OrderItem> existingOrderItemOpt = orderItemRepository.findById(id);
        if (existingOrderItemOpt.isPresent()) {
            OrderItem existingOrderItem = existingOrderItemOpt.get();
            existingOrderItem.setOrderId(orderItem.getOrderId());
            existingOrderItem.setProductId(orderItem.getProductId());
            existingOrderItem.setQuantity(orderItem.getQuantity());
            existingOrderItem.setPriceAtTime(orderItem.getPriceAtTime());
            return orderItemRepository.save(existingOrderItem);
        }
        throw new RuntimeException("OrderItem not found with id: " + id);
    }

    @Override
    public void deleteOrderItem(int id) {
        orderItemRepository.deleteById(id);
    }
}
