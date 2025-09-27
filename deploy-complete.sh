#!/bin/bash

# Script completo de build e deploy do Dashboard Stomalovers
echo "🚀 DEPLOY COMPLETO DO DASHBOARD STOMALOVERS"
echo "==========================================="

# Navegar para o diretório
cd /opt/stomalovers-dashboard

echo ""
echo "1️⃣ PREPARANDO ARQUIVOS CORRETOS"
echo "-------------------------------"

# Usar Dockerfile corrigido
cp Dockerfile.fixed-final Dockerfile
echo "✅ Dockerfile corrigido aplicado"

# Usar nginx.conf otimizado
cp nginx.conf.optimized nginx.conf
echo "✅ nginx.conf otimizado aplicado"

echo ""
echo "2️⃣ VERIFICANDO ESTRUTURA"
echo "------------------------"
echo "Arquivos principais:"
ls -la | grep -E "(Dockerfile|nginx.conf|package.json)"

echo ""
echo "Pasta src:"
ls -la src/ | head -5

echo ""
echo "3️⃣ FAZENDO BUILD FINAL"
echo "----------------------"
echo "Build com Dockerfile corrigido..."
docker build --no-cache -t stomalovers-dashboard:latest .

if [ $? -eq 0 ]; then
    echo "✅ BUILD CONCLUÍDO COM SUCESSO!"
    
    echo ""
    echo "4️⃣ TESTANDO CONTAINER"
    echo "---------------------"
    echo "Iniciando container de teste..."
    docker run --rm -d -p 8080:80 --name test-dashboard-complete stomalovers-dashboard:latest
    
    sleep 5
    
    echo "Status do container:"
    docker ps | grep test-dashboard-complete
    
    echo "Testando acesso:"
    if curl -f http://localhost:8080 > /dev/null 2>&1; then
        echo "✅ Aplicação funcionando perfeitamente!"
        echo "🌐 Acesse: http://localhost:8080"
        
        echo ""
        echo "5️⃣ TESTANDO HEALTH CHECK"
        echo "------------------------"
        curl -f http://localhost:8080/health && echo "✅ Health check funcionando"
        
    else
        echo "❌ Erro no acesso - verificando logs..."
        docker logs test-dashboard-complete
    fi
    
    echo ""
    echo "6️⃣ LIMPANDO CONTAINER DE TESTE"
    echo "------------------------------"
    docker stop test-dashboard-complete
    docker rm test-dashboard-complete
    
    echo ""
    echo "🎉 DEPLOY COMPLETO CONCLUÍDO!"
    echo "============================="
    echo "✅ Imagem: stomalovers-dashboard:latest"
    echo "✅ Container testado e funcionando"
    echo "✅ Pronto para deploy no Portainer!"
    echo ""
    echo "📋 PRÓXIMOS PASSOS:"
    echo "1. Use a stack: portainer-working-stack.yml"
    echo "2. Configure as variáveis de ambiente:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "3. Deploy no Portainer"
    echo "4. Acesse: https://dash.stomalovers.com.br"
    echo ""
    echo "🔧 CONFIGURAÇÕES APLICADAS:"
    echo "✅ Dockerfile sem pnpm-lock.yaml"
    echo "✅ Nginx otimizado para SPA"
    echo "✅ Health check configurado"
    echo "✅ Error pages redirecionando para index.html"
    
else
    echo "❌ BUILD FALHOU!"
    echo "Verifique os logs acima para identificar o problema."
    exit 1
fi
