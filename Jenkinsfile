pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "your-dockerhub-username" // Replace with your Docker Hub username
        DOCKER_CREDENTIALS_ID = "docker-hub-cred-id" // Replace with your Jenkins Docker Hub credentials ID
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/herilshah/shopsquare.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'docker login -u $USER -p $PASS'
                    script {
                        def services = [
                            "eureka-server", "apigateway", "user-service", "shop-service", "product-service",
                            "cart-service", "order-service", "profile-service",
                            "cart-item-service", "order-item-service", "frontend"
                        ]
                        for (svc in services) {
                            sh "docker tag msa_project-${svc} $DOCKER_REGISTRY/msa_project-${svc}:latest"
                            sh "docker push $DOCKER_REGISTRY/msa_project-${svc}:latest"
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}

