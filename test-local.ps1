# Script PowerShell para testar a aplicação localmente
Write-Host "🚀 Testando Dashboard Stomalovers localmente..." -ForegroundColor Green

# Verificar se o Docker está rodando
Write-Host "📋 Verificando Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "✅ Docker está disponível" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está disponível. Instale o Docker primeiro." -ForegroundColor Red
    exit 1
}

# Construir a imagem
Write-Host "📦 Construindo imagem Docker..." -ForegroundColor Yellow
$env:VITE_SUPABASE_URL = "https://dyvjgxpomqkbxhgcznyw.supabase.co"
$env:VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5dmpneHBvbXFrYnhoZ2N6bnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNjM1MTAsImV4cCI6MjA1ODczOTUxMH0.G8QLXKXQQVTW-QuIHhnRnImCrrms5ex8hjqazaInstw"

docker build --build-arg VITE_SUPABASE_URL="$env:VITE_SUPABASE_URL" --build-arg VITE_SUPABASE_ANON_KEY="$env:VITE_SUPABASE_ANON_KEY" -t stomalovers-dashboard:test .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Imagem construída com sucesso!" -ForegroundColor Green
    
    # Parar container anterior se existir
    Write-Host "🛑 Parando container anterior..." -ForegroundColor Yellow
    docker stop stomalovers-test 2>$null
    docker rm stomalovers-test 2>$null
    
    # Executar container
    Write-Host "🚀 Iniciando container de teste..." -ForegroundColor Yellow
    docker run -d --name stomalovers-test -p 8080:80 stomalovers-dashboard:test
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Container iniciado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Acesse: http://localhost:8080" -ForegroundColor Cyan
        Write-Host "👤 Usuário: stomalovers" -ForegroundColor Cyan
        Write-Host "🔑 Senha: Sourica2025" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📋 Para parar o teste: docker stop stomalovers-test" -ForegroundColor Yellow
        Write-Host "📋 Para ver logs: docker logs stomalovers-test" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Erro ao iniciar container!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Erro ao construir imagem!" -ForegroundColor Red
}
