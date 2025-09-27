# 🐳 Deploy no Portainer + Docker Swarm

## 📋 Pré-requisitos

- Portainer configurado com Docker Swarm
- Traefik configurado no cluster
- Acesso SSH ao servidor manager
- Registry Docker (opcional, mas recomendado)

## 🚀 Método 1: Build Local + Deploy (Recomendado)

### Passo 1: Preparar o Ambiente

```bash
# Conectar via SSH no servidor manager
ssh user@seu-servidor

# Navegar para o diretório do projeto
cd /caminho/para/dash_stomalovers

# Tornar o script executável
chmod +x build-and-push.sh
```

### Passo 2: Configurar Variáveis de Ambiente

Crie o arquivo `.env` no Portainer ou configure as variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dyvjgxpomqkbxhgcznyw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5dmpneHBvbXFrYnhoZ2N6bnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNjM1MTAsImV4cCI6MjA1ODczOTUxMH0.G8QLXKXQQVTW-QuIHhnRnImCrrms5ex8hjqazaInstw
```

### Passo 3: Build da Imagem

```bash
# Executar o script de build
./build-and-push.sh

# OU build manual
docker build -t stomalovers-dashboard:latest .
```

### Passo 4: Deploy no Portainer

1. Acesse o Portainer
2. Vá em **Stacks** > **Add stack**
3. Cole o conteúdo do arquivo `portainer-stack.yml`
4. Configure as variáveis de ambiente
5. Clique em **Deploy the stack**

## 🔧 Método 2: Build Direto no Portainer

### Passo 1: Preparar o Repositório

1. Faça upload dos arquivos para um repositório Git
2. Ou use o upload de arquivos do Portainer

### Passo 2: Deploy da Stack

1. Acesse o Portainer
2. Vá em **Stacks** > **Add stack**
3. Cole o conteúdo do arquivo `portainer-build-stack.yml`
4. Configure as variáveis de ambiente
5. Clique em **Deploy the stack**

## 🐛 Solução de Problemas

### Erro: "No such image"
```bash
# Verificar se a imagem existe
docker images | grep stomalovers

# Se não existir, fazer build
docker build -t stomalovers-dashboard:latest .
```

### Erro: "Network not found"
```bash
# Verificar se a rede traefik-public existe
docker network ls | grep traefik

# Se não existir, criar
docker network create --driver overlay traefik-public
```

### Erro: "Service not found"
- Verifique se o Traefik está rodando
- Confirme se as labels estão corretas
- Verifique se o domínio está configurado no DNS

### Verificar Logs
```bash
# Logs do serviço
docker service logs stomalovers-dashboard_dashboard

# Status do serviço
docker service ps stomalovers-dashboard_dashboard
```

## 📊 Monitoramento

### Health Check
```bash
# Verificar se o serviço está saudável
curl -f http://dash.stomalovers.com.br/health
```

### Logs em Tempo Real
```bash
# Acompanhar logs
docker service logs -f stomalovers-dashboard_dashboard
```

## 🔄 Atualizações

### Atualizar a Aplicação
1. Faça as alterações no código
2. Execute o build novamente: `./build-and-push.sh`
3. No Portainer, clique em **Update the stack**
4. Marque **Re-pull image** se necessário

### Rollback
1. No Portainer, vá em **Stacks**
2. Clique no stack do dashboard
3. Vá em **Editor**
4. Volte para a versão anterior
5. Clique em **Update the stack**

## 🎯 Configurações Avançadas

### Múltiplas Réplicas
```yaml
deploy:
  replicas: 3
  update_config:
    parallelism: 1
    delay: 10s
    failure_action: rollback
```

### Health Check
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Secrets
```yaml
secrets:
  - supabase_url
  - supabase_key

environment:
  VITE_SUPABASE_URL: ${supabase_url}
  VITE_SUPABASE_ANON_KEY: ${supabase_key}
```

## ✅ Checklist de Deploy

- [ ] Código atualizado no repositório
- [ ] Build da imagem executado com sucesso
- [ ] Variáveis de ambiente configuradas
- [ ] Stack criada no Portainer
- [ ] Rede traefik-public configurada
- [ ] DNS apontando para o servidor
- [ ] SSL funcionando (Traefik)
- [ ] Aplicação acessível via URL
- [ ] Logs sem erros críticos

---

**🎉 Deploy concluído com sucesso!**

Acesse: https://dash.stomalovers.com.br
- **Usuário**: stomalovers
- **Senha**: Sourica2025
