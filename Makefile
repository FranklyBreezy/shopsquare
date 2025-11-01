.PHONY: build build-all up down logs clean test

# Build all Docker images
build-all:
	docker-compose build

# Build and start all services
up:
	docker-compose up -d --build

# Start services without building
start:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# View logs for specific service
logs-service:
	@read -p "Enter service name: " service; \
	docker-compose logs -f $$service

# Stop all services and remove volumes
clean:
	docker-compose down -v
	docker system prune -f

# Show running services
ps:
	docker-compose ps

# Restart a specific service
restart:
	@read -p "Enter service name: " service; \
	docker-compose restart $$service

# Build and test Eureka server
test-eureka:
	cd eurekaserver && docker build -t shopsquare-eureka:test .
	docker run -d --name test-eureka -p 8762:8761 shopsquare-eureka:test
	@echo "Eureka running on http://localhost:8762"
	@echo "Run 'docker stop test-eureka && docker rm test-eureka' to clean up"

# Show service status
status:
	@echo "=== Service Status ==="
	@docker-compose ps

