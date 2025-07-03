pipeline {
  agent any

  environment {
    NODE_ENV = 'production'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }
    stage('Lint') {
      steps {
        sh 'npm run lint:format'
      }
    }
    stage('Test') {
      steps {
        sh 'npm run test:e2e'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    stage('Deploy') {
      steps {
        sh 'docker-compose down || true'
        sh 'docker-compose up -d --build'
      }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'dist/**/*.*', allowEmptyArchive: true
      junit 'coverage/**/*.xml'
    }
  }
} 