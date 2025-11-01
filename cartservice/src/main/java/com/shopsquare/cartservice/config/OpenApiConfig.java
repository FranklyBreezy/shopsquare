package com.shopsquare.cartservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Cart Service API")
                        .description("REST API for managing shopping carts in ShopSquare microservices architecture")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("ShopSquare Team")
                                .email("support@shopsquare.com")
                                .url("https://shopsquare.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8084")
                                .description("Development Server"),
                        new Server()
                                .url("https://api.shopsquare.com")
                                .description("Production Server")
                ));
    }
}
