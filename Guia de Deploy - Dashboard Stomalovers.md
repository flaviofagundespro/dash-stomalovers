# Guia de Deploy - Dashboard Stomalovers

## 📦 Arquivos para Deploy

Você precisará dos seguintes arquivos na sua VPS:

### 1. Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 2. nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 3. docker-compose.yml
```yaml
version: '3.8'

services:
  dashboard:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: stomalovers-dashboard
    restart: unless-stopped
    ports:
      - "80:80"  # Remova esta linha em produção se usar Traefik
    environment:
      VITE_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}
      VITE_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.stomalovers-dashboard.rule=Host(`dash.stomalovers.com.br`)"
      - "traefik.http.routers.stomalovers-dashboard.entrypoints=websecure"
      - "traefik.http.routers.stomalovers-dashboard.tls.certresolver=myresolver"
      - "traefik.http.services.stomalovers-dashboard.loadbalancer.server.port=80"
```

### 4. .env
```env
NEXT_PUBLIC_SUPABASE_URL=https://dyvjgxpomqkbxhgcznyw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5dmpneHBvbXFrYnhoZ2N6bnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNjM1MTAsImV4cCI6MjA1ODczOTUxMH0.G8QLXKXQQVTW-QuIHhnRnImCrrms5ex8hjqazaInstw
```

## 🚀 Passos para Deploy

### 1. Preparar VPS
```bash
# Conectar na VPS via SSH
ssh usuario@seu-servidor.com

# Criar diretório
sudo mkdir -p /opt/stomalovers-dashboard
cd /opt/stomalovers-dashboard
```

### 2. Transferir Arquivos
Você pode usar `scp`, `rsync` ou copiar manualmente:

```bash
# Exemplo com scp (do seu computador local)
scp Dockerfile nginx.conf docker-compose.yml .env usuario@seu-servidor.com:/opt/stomalovers-dashboard/
```

### 3. Configurar DNS
No painel da Cloudflare:
- Adicione registro A: `dash` → `IP_DA_SUA_VPS`
- Ative o proxy (nuvem laranja)

### 4. Deploy
```bash
# Na VPS, no diretório do projeto
cd /opt/stomalovers-dashboard

# Construir e iniciar
sudo docker-compose up -d --build

# Verificar status
sudo docker ps
```

### 5. Verificar
- Aguarde 2-3 minutos para o Traefik configurar o SSL
- Acesse: https://dash.stomalovers.com.br
- Login: `stomalovers` / `Sourica2025`

## 🔧 Configurações Específicas da VPS

### Para Produção (sem porta exposta)
Remova a linha `ports:` do docker-compose.yml:

```yaml
services:
  dashboard:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: stomalovers-dashboard
    restart: unless-stopped
    # ports:  # <- Remover esta seção
    #   - "80:80"
    environment:
      # ... resto da configuração
```

### Verificar Traefik
```bash
# Ver containers do Traefik
sudo docker ps | grep traefik

# Ver logs do Traefik
sudo docker logs traefik
```

## 📊 Monitoramento

### Logs da Aplicação
```bash
# Ver logs em tempo real
sudo docker logs -f stomalovers-dashboard

# Ver últimas 100 linhas
sudo docker logs --tail 100 stomalovers-dashboard
```

### Health Check
```bash
# Testar endpoint de saúde
curl http://localhost/health

# Ou via domínio
curl https://dash.stomalovers.com.br/health
```

### Status do Container
```bash
# Ver containers rodando
sudo docker ps

# Ver uso de recursos
sudo docker stats stomalovers-dashboard
```

## 🔄 Atualizações

Para atualizar o dashboard:

```bash
cd /opt/stomalovers-dashboard

# Parar aplicação
sudo docker-compose down

# Reconstruir e iniciar
sudo docker-compose up -d --build

# Limpar imagens antigas (opcional)
sudo docker image prune -f
```

## ⚠️ Troubleshooting

### Container não inicia
```bash
# Ver logs detalhados
sudo docker logs stomalovers-dashboard

# Verificar arquivo .env
cat .env

# Testar build manual
sudo docker build -t test-dashboard .
```

### Erro de SSL/Domínio
```bash
# Verificar DNS
nslookup dash.stomalovers.com.br

# Ver logs do Traefik
sudo docker logs traefik | grep dash.stomalovers

# Forçar renovação SSL (se necessário)
sudo docker exec traefik traefik healthcheck
```

### Problemas de Performance
```bash
# Ver uso de recursos
sudo docker stats

# Ver espaço em disco
df -h

# Limpar containers antigos
sudo docker system prune -f
```

## 📞 Contato

Para suporte técnico ou dúvidas sobre o deploy, consulte a documentação completa no README.md ou entre em contato.

