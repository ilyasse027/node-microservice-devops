pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-docker-registry'
        DOCKER_IMAGE = 'todo-app'
        DOCKER_TAG = "${BUILD_NUMBER}"
        KUBECONFIG = credentials('kubeconfig')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh '''
                    cd backend
                    npm install
                    cd ../frontend
                    npm install
                '''
            }
        }
        
        stage('Run Tests') {
            steps {
                sh '''
                    cd backend
                    npm test
                    cd ../frontend
                    npm test
                '''
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                sh """
                    trivy image ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                """
            }
        }
        
        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        docker.image("${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                sh """
                    helm upgrade --install todo-app ./helm/todo-app \
                        --namespace todo \
                        --create-namespace \
                        --set image.tag=${DOCKER_TAG} \
                        --wait
                """
            }
        }
    }
    
    post {
        success {
            slackSend(
                color: 'good',
                message: "Pipeline succeeded! Image: ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"
            )
        }
        failure {
            slackSend(
                color: 'danger',
                message: "Pipeline failed! Check logs: ${BUILD_URL}"
            )
        }
    }
}