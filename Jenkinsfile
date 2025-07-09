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
    stage('Setup Env') {
      steps {
        sh '''
          set -a
          source .env
          set +a
        '''
      }
    }
    stage('Deploy') {
      steps {
        sh 'docker-compose down || true'
        sh 'docker-compose up -d --build'
      }
    }
    stage('Test') {
      steps {
        sh 'docker-compose run --rm app npm run test:e2e'
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