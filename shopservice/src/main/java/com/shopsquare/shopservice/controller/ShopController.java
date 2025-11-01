package com.shopsquare.shopservice.controller;

import com.shopsquare.shopservice.entity.Shop;
import com.shopsquare.shopservice.service.ShopService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/shops")
@Tag(name = "Shop Management", description = "APIs for managing shops")
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @PostMapping
    @Operation(summary = "Create a new shop", description = "Creates a new shop in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Shop created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public Shop createShop(@RequestBody Shop shop) {
        return shopService.createShop(shop);
    }

    @GetMapping
    @Operation(summary = "Get all shops", description = "Retrieves a list of all shops in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of shops")
    })
    public List<Shop> getAllShops() {
        return shopService.getAllShops();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get shop by ID", description = "Retrieves a specific shop by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Shop found successfully"),
            @ApiResponse(responseCode = "404", description = "Shop not found")
    })
    public Optional<Shop> getShopById(
            @Parameter(description = "ID of the shop to retrieve", required = true)
            @PathVariable Integer id) {
        return shopService.getShopById(id);
    }

    @GetMapping("/owner/{ownerId}")
    @Operation(summary = "Get shops by owner ID", description = "Retrieves all shops owned by a specific owner")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Shops found successfully")
    })
    public List<Shop> getShopsByOwnerId(
            @Parameter(description = "ID of the shop owner", required = true)
            @PathVariable Integer ownerId) {
        return shopService.getShopsByOwnerId(ownerId);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update shop", description = "Updates an existing shop's information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Shop updated successfully"),
            @ApiResponse(responseCode = "404", description = "Shop not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public Shop updateShop(
            @Parameter(description = "ID of the shop to update", required = true)
            @PathVariable Integer id, 
            @RequestBody Shop shop) {
        return shopService.updateShop(id, shop);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete shop", description = "Deletes a shop from the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Shop deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Shop not found")
    })
    public String deleteShop(
            @Parameter(description = "ID of the shop to delete", required = true)
            @PathVariable Integer id) {
        shopService.deleteShop(id);
        return "Shop deleted successfully";
    }
}

