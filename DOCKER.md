# Docker Setup for ShopSquare Microservices

## Overview
This project uses Docker containers for all microservices. Each service has its own Dockerfile with multi-stage builds for optimal image size.

## Prerequisites
- Docker Desktop installed and running
- Docker Compose v2.x

## Quick Start

### Build and Run All Services
```bash
docker-compose up --build
```

### Run in Background
```bash
docker-compose up -d --build
```

### Stop All Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f eureka-server
```

## Individual Service Testing

### Build a Single Service
```bash
cd eurekaserver
docker build -t shopsquare-eureka:latest .
docker run -p 8761:8761 shopsquare-eureka:latest
```

## Service Ports
- **Eureka Server**: 8761
- **API Gateway**: 9100
- **User Service**: 9101
- **Shop Service**: 9102
- **Product Service**: 9103
- **Cart Service**: 9104
- **Order Service**: 9105
- **Profile Service**: 9106
- **Cart Item Service**: 9107
- **Order Item Service**: 9108
- **Frontend**: 5173

## Docker Images
Each service builds a separate Docker image:
- `shopsquare-eureka`
- `shopsquare-apigateway`
- `shopsquare-user-service`
- `shopsquare-shop-service`
- `shopsquare-product-service`
- `shopsquare-cart-service`
- `shopsquare-order-service`
- `shopsquare-profile-service`
- `shopsquare-cart-item-service`
- `shopsquare-order-item-service`
- `shopsquare-frontend`

## Environment Variables
Services are configured via environment variables in `docker-compose.yml`:
- Database connection settings
- Eureka service discovery URLs
- Service ports

## Database
MySQL runs in a container with all databases initialized via `init-db.sql`.

## Network
All services communicate via the `shopsquare-network` Docker network.

