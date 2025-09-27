#!/bin/bash

# Script para build e push da imagem para Docker Swarm
# Execute este script no servidor onde está o código

set -e

# Configurações
IMAGE_NAME="stomalovers-dashboard"
TAG="latest"
REGISTRY_URL="your-registry.com"  # Substitua pelo seu registry
FULL_IMAGE_NAME="${REGISTRY_URL}/${IMAGE_NAME}:${TAG}"

echo "🚀 Iniciando build da imagem ${IMAGE_NAME}..."

# Build da imagem
echo "📦 Fazendo build da imagem..."
docker build -t ${IMAGE_NAME}:${TAG} .

# Tag para o registry
echo "🏷️  Aplicando tag para o registry..."
docker tag ${IMAGE_NAME}:${TAG} ${FULL_IMAGE_NAME}

# Push para o registry
echo "⬆️  Fazendo push para o registry..."
docker push ${FULL_IMAGE_NAME}

echo "✅ Build e push concluídos!"
echo "📋 Use esta imagem no Portainer: ${FULL_IMAGE_NAME}"

# Limpeza local (opcional)
echo "🧹 Removendo imagens locais..."
docker rmi ${IMAGE_NAME}:${TAG} || true
docker rmi ${FULL_IMAGE_NAME} || true

echo "🎉 Processo finalizado!"
