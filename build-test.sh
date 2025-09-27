#!/bin/bash

# Script para testar o build do dashboard
echo "🚀 Iniciando build do Dashboard Stomalovers..."

# Navegar para o diretório
cd /opt/stomalovers-dashboard

# Verificar se os arquivos estão lá
echo "📁 Verificando arquivos..."
ls -la src/

# Fazer build da imagem
echo "🔨 Fazendo build da imagem..."
docker build -t stomalovers-dashboard:latest .

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    
    # Verificar se a imagem foi criada
    echo "📦 Verificando imagem criada..."
    docker images | grep stomalovers
    
    # Testar a imagem
    echo "🧪 Testando a imagem..."
    docker run --rm -d -p 8080:80 --name test-dashboard stomalovers-dashboard:latest
    
    # Aguardar um pouco
    sleep 5
    
    # Verificar se está rodando
    echo "🔍 Verificando status do container..."
    docker ps | grep test-dashboard
    
    # Testar acesso
    echo "🌐 Testando acesso..."
    curl -f http://localhost:8080 || echo "❌ Erro ao acessar a aplicação"
    
    # Limpar container de teste
    echo "🧹 Limpando container de teste..."
    docker stop test-dashboard
    docker rm test-dashboard
    
    echo "🎉 Teste concluído!"
else
    echo "❌ Build falhou!"
    exit 1
fi
