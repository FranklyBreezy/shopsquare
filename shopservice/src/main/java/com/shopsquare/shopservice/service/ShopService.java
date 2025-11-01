package com.shopsquare.shopservice.service;

import com.shopsquare.shopservice.entity.Shop;

import java.util.List;
import java.util.Optional;

public interface ShopService {
    Shop createShop(Shop shop);

    List<Shop> getAllShops();

    Optional<Shop> getShopById(Integer id);

    List<Shop> getShopsByOwnerId(Integer ownerId);

    Shop updateShop(Integer id, Shop shop);

    void deleteShop(Integer id);
}

