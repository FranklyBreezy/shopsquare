package com.shopsquare.orderservice.service;

import com.shopsquare.orderservice.entity.Order;
import com.shopsquare.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    @Value("${service.cart-service.name:cart-service}")
    private String cartServiceName;

    @Value("${service.order-item-service.name:orderitem}")
    private String orderItemServiceName;

    @Value("${service.payment-service.name:payment-service}")
    private String paymentServiceName;

    @Value("${service.notification-service.name:notification-service}")
    private String notificationServiceName;

    public OrderServiceImpl(OrderRepository orderRepository, RestTemplate restTemplate) {
        this.orderRepository = orderRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public Order createOrder(Order order) {
        // Set default values if not provided
        if (order.getStatus() == null) {
            order.setStatus("PENDING");
        }
        if (order.getPaymentStatus() == null) {
            order.setPaymentStatus("PENDING");
        }
        
        // Persist order only; UI will create order-items and handle payment/notifications
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    public Order updateOrder(Long id, Order orderDetails) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.setUserId(orderDetails.getUserId());
            order.setShopId(orderDetails.getShopId());
            order.setTotalAmount(orderDetails.getTotalAmount());
            order.setStatus(orderDetails.getStatus());
            order.setShippingAddress(orderDetails.getShippingAddress());
            order.setPaymentMethod(orderDetails.getPaymentMethod());
            order.setPaymentStatus(orderDetails.getPaymentStatus());
            return orderRepository.save(order);
        }
        return null;
    }

    @Override
    public List<Order> getOrdersByShopId(Long shopId) {
        return orderRepository.findByShopId(shopId);
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Order updateOrderStatus(Long id, String status) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.setStatus(status);
            return orderRepository.save(order);
        }
        return null;
    }

    @Override
    public boolean deleteOrder(Long id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
