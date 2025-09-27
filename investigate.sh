#!/bin/bash

# Script de investigação completa do problema
echo "🔍 INVESTIGAÇÃO COMPLETA DO DASHBOARD STOMALOVERS"
echo "=================================================="

# Navegar para o diretório
cd /opt/stomalovers-dashboard

echo ""
echo "1️⃣ VERIFICANDO STATUS DO GIT"
echo "-----------------------------"
git status

echo ""
echo "2️⃣ VERIFICANDO CONTEÚDO DO PACKAGE.JSON"
echo "----------------------------------------"
cat package.json | grep -A 5 -B 5 "@supabase"

echo ""
echo "3️⃣ VERIFICANDO ARQUIVOS NO SERVIDOR"
echo "-----------------------------------"
echo "Arquivos na raiz:"
ls -la | head -10

echo ""
echo "Arquivos src/:"
ls -la src/ | head -10

echo ""
echo "4️⃣ VERIFICANDO DOCKERFILE"
echo "-------------------------"
echo "Dockerfile atual:"
head -10 Dockerfile

echo ""
echo "5️⃣ TESTANDO BUILD COM DEBUG"
echo "----------------------------"
echo "Fazendo build com Dockerfile de debug..."
docker build -f Dockerfile.debug -t stomalovers-dashboard-debug:latest .

echo ""
echo "6️⃣ VERIFICANDO IMAGEM CRIADA"
echo "----------------------------"
docker images | grep stomalovers

echo ""
echo "7️⃣ TESTANDO CONTAINER"
echo "---------------------"
echo "Iniciando container de teste..."
docker run --rm -d -p 8080:80 --name test-dashboard-debug stomalovers-dashboard-debug:latest

sleep 5

echo "Status do container:"
docker ps | grep test-dashboard-debug

echo "Testando acesso:"
curl -f http://localhost:8080 && echo "✅ Aplicação funcionando!" || echo "❌ Erro no acesso"

echo "Logs do container:"
docker logs test-dashboard-debug | tail -20

echo "Limpando container de teste..."
docker stop test-dashboard-debug
docker rm test-dashboard-debug

echo ""
echo "🎯 INVESTIGAÇÃO CONCLUÍDA!"
echo "=========================="
