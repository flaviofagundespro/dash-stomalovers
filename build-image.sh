#!/bin/bash

# Script para construir a imagem Docker do Dashboard Stomalovers
# Este script deve ser executado no servidor onde está o Portainer

echo "🚀 Iniciando build da imagem stomalovers-dashboard..."

# Definir variáveis de ambiente
export VITE_SUPABASE_URL="https://dyvjgxpomqkbxhgcznyw.supabase.co"
export VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5dmpneHBvbXFrYnhoZ2N6bnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNjM1MTAsImV4cCI6MjA1ODczOTUxMH0.G8QLXKXQQVTW-QuIHhnRnImCrrms5ex8hjqazaInstw"

# Construir a imagem
echo "📦 Construindo imagem Docker..."
docker build \
  --build-arg VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
  --build-arg VITE_SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY" \
  -t stomalovers-dashboard:latest \
  .

if [ $? -eq 0 ]; then
    echo "✅ Imagem construída com sucesso!"
    echo "📋 Para testar localmente:"
    echo "   docker run -p 8080:80 stomalovers-dashboard:latest"
    echo ""
    echo "🌐 Acesse: http://localhost:8080"
else
    echo "❌ Erro ao construir a imagem!"
    exit 1
fi
