package com.shopsquare.cartservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "user_id", nullable = false)
    private int userId;

    @Column(name = "shop_id", nullable = false)
    private int shopId;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Default constructor
    public Cart() {}

    // Parameterized constructor
    public Cart(int userId, int shopId, LocalDateTime updatedAt) {
        this.userId = userId;
        this.shopId = shopId;
        this.updatedAt = updatedAt;
    }

    // Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getShopId() { return shopId; }
    public void setShopId(int shopId) { this.shopId = shopId; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

