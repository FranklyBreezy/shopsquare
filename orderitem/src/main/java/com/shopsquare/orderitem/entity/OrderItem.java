package com.shopsquare.orderitem.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "order_id", nullable = false)
    private int orderId;

    @Column(name = "product_id", nullable = false)
    private int productId;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "price_at_time", nullable = false)
    @JsonProperty("price")
    private double priceAtTime;

    // ---- Constructors ----
    public OrderItem() {
    }

    public OrderItem(int id, int orderId, int productId, int quantity, double priceAtTime) {
        this.id = id;
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.priceAtTime = priceAtTime;
    }

    // ---- Getters and Setters ----
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPriceAtTime() {
        return priceAtTime;
    }

    public void setPriceAtTime(double priceAtTime) {
        this.priceAtTime = priceAtTime;
    }

    // ---- toString() (optional for debugging) ----
    @Override
    public String toString() {
        return "OrderItem{" +
                "id=" + id +
                ", orderId=" + orderId +
                ", productId=" + productId +
                ", quantity=" + quantity +
                ", priceAtTime=" + priceAtTime +
                '}';
    }
}
