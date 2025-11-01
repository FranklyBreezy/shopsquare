# Kubernetes Deployment Manifests

This directory contains all Kubernetes deployment and service manifests for the ShopSquare microservices project.

## Files

- `eureka-server-deployment.yaml` - Eureka Service Discovery Server
- `apigateway-deployment.yaml` - API Gateway
- `user-service-deployment.yaml` - User Service
- `shop-service-deployment.yaml` - Shop Service
- `product-service-deployment.yaml` - Product Service
- `cart-service-deployment.yaml` - Cart Service
- `order-service-deployment.yaml` - Order Service
- `profile-service-deployment.yaml` - Profile Service
- `cart-item-service-deployment.yaml` - Cart Item Service
- `order-item-service-deployment.yaml` - Order Item Service
- `frontend-deployment.yaml` - Frontend UI
- `mysql-deployment.yaml` - MySQL Database with PVC and ConfigMap

## Prerequisites

1. **Replace Docker Hub username**: Before deploying, replace `your-dockerhub-username` in all manifests with your actual Docker Hub username.

2. **Kubernetes cluster**: Ensure you have a running Kubernetes cluster (minikube, kind, EKS, GKE, AKS, etc.)

3. **kubectl configured**: Make sure `kubectl` is configured to connect to your cluster.

## Deployment

### Deploy All Services

```bash
# Deploy everything at once
kubectl apply -f k8s/

# Or deploy individually
kubectl apply -f k8s/eureka-server-deployment.yaml
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/apigateway-deployment.yaml
# ... etc
```

### Check Deployment Status

```bash
# Check all deployments
kubectl get deployments

# Check all services
kubectl get services

# Check pods
kubectl get pods

# Check logs
kubectl logs -f deployment/eureka-server
```

### Access Services

Services are exposed as NodePort. To find the ports:

```bash
kubectl get services
```

Or port-forward to access:

```bash
# Eureka
kubectl port-forward service/eureka-server 8761:8761

# API Gateway
kubectl port-forward service/apigateway 9100:9100

# Frontend
kubectl port-forward service/frontend 5173:5173
```

## Configuration

All services use environment variables for configuration:
- Database connection strings point to `mysql` service
- Eureka URLs point to `eureka-server` service
- Service discovery works via Kubernetes DNS

## Cleanup

```bash
kubectl delete -f k8s/
```

