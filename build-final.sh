#!/bin/bash

# Script de build final do Dashboard Stomalovers
echo "🚀 BUILD FINAL DO DASHBOARD STOMALOVERS"
echo "======================================="

# Navegar para o diretório
cd /opt/stomalovers-dashboard

echo ""
echo "1️⃣ VERIFICANDO ARQUIVOS CORRIGIDOS"
echo "----------------------------------"
echo "Verificando se não há mais caminhos quebrados..."
grep -r "from '\.\./lib/" src/ || echo "✅ Nenhum caminho ../lib/ encontrado"
grep -r "from '\.\./\.\./lib/" src/ || echo "✅ Nenhum caminho ../../lib/ encontrado"

echo ""
echo "2️⃣ FAZENDO BUILD FINAL"
echo "----------------------"
echo "Build com Dockerfile original (sem cache)..."
docker build --no-cache -t stomalovers-dashboard:latest .

if [ $? -eq 0 ]; then
    echo "✅ BUILD CONCLUÍDO COM SUCESSO!"
    
    echo ""
    echo "3️⃣ VERIFICANDO IMAGEM CRIADA"
    echo "----------------------------"
    docker images | grep stomalovers
    
    echo ""
    echo "4️⃣ TESTANDO APLICAÇÃO"
    echo "--------------------"
    echo "Iniciando container de teste..."
    docker run --rm -d -p 8080:80 --name test-dashboard-final stomalovers-dashboard:latest
    
    sleep 5
    
    echo "Status do container:"
    docker ps | grep test-dashboard-final
    
    echo "Testando acesso:"
    if curl -f http://localhost:8080 > /dev/null 2>&1; then
        echo "✅ Aplicação funcionando perfeitamente!"
        echo "🌐 Acesse: http://localhost:8080"
    else
        echo "❌ Erro no acesso - verificar logs"
        docker logs test-dashboard-final
    fi
    
    echo ""
    echo "5️⃣ LIMPANDO CONTAINER DE TESTE"
    echo "------------------------------"
    docker stop test-dashboard-final
    docker rm test-dashboard-final
    
    echo ""
    echo "🎉 BUILD FINAL CONCLUÍDO COM SUCESSO!"
    echo "====================================="
    echo "✅ Imagem: stomalovers-dashboard:latest"
    echo "✅ Pronto para deploy no Portainer!"
    echo ""
    echo "📋 PRÓXIMOS PASSOS:"
    echo "1. Use a stack: portainer-working-stack.yml"
    echo "2. Configure as variáveis de ambiente"
    echo "3. Deploy no Portainer"
    echo "4. Acesse: https://dash.stomalovers.com.br"
    
else
    echo "❌ BUILD FALHOU!"
    echo "Verifique os logs acima para identificar o problema."
    exit 1
fi
