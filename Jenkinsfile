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
        // Use bash explicitly to avoid 'source: not found' error
        sh '''
          #!/bin/bash
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
        // Run tests inside the container after deployment
        sh 'docker-compose run --rm app npm run test:e2e'
      }
    }
  }

  post {
    always {
      // Archive built files if any
      archiveArtifacts artifacts: 'dist/**/*.*', allowEmptyArchive: true

      // Publish test results (assumes Jest or similar is configured to output to XML)
      junit 'coverage/**/*.xml'
    }
  }
}
