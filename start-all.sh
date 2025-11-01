#!/bin/bash

# Start Eureka Server
echo "Starting Eurekaserver..."
cd eurekaserver
mvn spring-boot:run &
cd ..

# Start API Gateway
echo "Starting API Gateway..."
cd apigateway
mvn spring-boot:run &
cd ..

# Start User Service
echo "Starting User Service..."
cd user-service
mvn spring-boot:run &
cd ..

# Start Shop Service
echo "Starting Shop Service..."
cd shopservice
mvn spring-boot:run &
cd ..

# Start Product Service
echo "Starting Product Service..."
cd productservice
mvn spring-boot:run &
cd ..

# Start Cart Service
echo "Starting Cart Service..."
cd cartservice
mvn spring-boot:run &
cd ..

# Start Order Service
echo "Starting Order Service..."
cd orderservice
mvn spring-boot:run &
cd ..

# Start Profile Service
echo "Starting Profile Service..."
cd profileservice
mvn spring-boot:run &
cd ..

# Start Cart Item Service
echo "Starting Cart Item Service..."
cd cartitem
mvn spring-boot:run &
cd ..

# Start Order Item Service
echo "Starting Order Item Service..."
cd orderitem
mvn spring-boot:run &
cd ..

echo "All services started."
