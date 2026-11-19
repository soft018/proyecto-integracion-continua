pipeline {
  agent any

  options {
    timestamps()
    skipDefaultCheckout(true)
    buildDiscarder(logRotator(numToKeepStr: '15'))
  }

  environment {
    COMPOSE_FILE = 'compose.ci.yaml'
    APP_IMAGE = 'gestion-productos:jenkins'
    DB_IMAGE = 'postgres:16.4-alpine3.20'
    APP_URL = 'http://host.docker.internal:3001'
  }

  triggers {
    pollSCM('H/5 * * * *')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        sh '''
          set -eu
          docker version
          docker build -t "$APP_IMAGE" .
          docker pull "$DB_IMAGE"
          docker image inspect "$APP_IMAGE" >/dev/null
          docker image inspect "$DB_IMAGE" >/dev/null
        '''
      }
    }

    stage('Test') {
      steps {
        sh '''
          set -eu
          npm ci
          npm test
          docker compose --env-file .env.example -f "$COMPOSE_FILE" up -d --build --wait --wait-timeout 120
          docker compose --env-file .env.example -f "$COMPOSE_FILE" ps
          app_health="$(docker inspect --format='{{.State.Health.Status}}' gestion-ci-app)"
          db_health="$(docker inspect --format='{{.State.Health.Status}}' gestion-ci-db)"
          echo "salud app=$app_health db=$db_health"
          test "$app_health" = "healthy"
          test "$db_health" = "healthy"
          docker compose --env-file .env.example -f "$COMPOSE_FILE" exec -T app node -e "require('dns').lookup('db', (err, address) => { if (err || !address) { console.error(err || 'sin direccion'); process.exit(1); } console.log('hostname db resuelve a ' + address); })"
          npm run test:integration
        '''
      }
    }
  }

  post {
    always {
      sh '''
        set +e
        docker compose --env-file .env.example -f compose.ci.yaml ps
        docker compose --env-file .env.example -f compose.ci.yaml logs --tail 80 app
        docker compose --env-file .env.example -f compose.ci.yaml logs --tail 40 db
        docker compose --env-file .env.example -f compose.ci.yaml down
        exit 0
      '''
    }
    success {
      echo 'Pipeline correcto: imagen construida y pruebas superadas.'
    }
    failure {
      echo 'Pipeline fallido. Revise Checkout, Build o Test. No se eliminaron volumenes con -v.'
    }
  }
}
