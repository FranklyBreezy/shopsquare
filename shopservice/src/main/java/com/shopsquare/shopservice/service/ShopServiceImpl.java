package com.shopsquare.shopservice.service;

import com.shopsquare.shopservice.entity.Shop;
import com.shopsquare.shopservice.repository.ShopRepository;
import com.shopsquare.shopservice.service.ShopService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepository;
    private final RestTemplate restTemplate;

    @Value("${service.user-service.name:user-service}")
    private String userServiceName;

    public ShopServiceImpl(ShopRepository shopRepository, RestTemplate restTemplate) {
        this.shopRepository = shopRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public Shop createShop(Shop shop) {
        if (shop.getOwnerId() != null) {
            String url = "http://" + userServiceName + "/api/users/" + shop.getOwnerId();
            restTemplate.getForObject(url, Object.class);
        }
        return shopRepository.save(shop);
    }

    @Override
    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }

    @Override
    public Optional<Shop> getShopById(Integer id) {
        return shopRepository.findById(id);
    }

    @Override
    public List<Shop> getShopsByOwnerId(Integer ownerId) {
        return shopRepository.findByOwnerId(ownerId);
    }

    @Override
    public Shop updateShop(Integer id, Shop shop) {
        return shopRepository.findById(id).map(existingShop -> {
            existingShop.setOwnerId(shop.getOwnerId());
            existingShop.setName(shop.getName());
            existingShop.setDescription(shop.getDescription());
            existingShop.setLocation(shop.getLocation());
            return shopRepository.save(existingShop);
        }).orElseThrow(() -> new RuntimeException("Shop not found"));
    }

    @Override
    public void deleteShop(Integer id) {
        shopRepository.deleteById(id);
    }
}
