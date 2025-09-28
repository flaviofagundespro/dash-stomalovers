# 🚀 Deploy Corrigido - Dashboard Stomalovers

## Problema Identificado
A página estava abrindo em branco devido a problemas na configuração das variáveis de ambiente do Vite durante o build da aplicação.

## Soluções Implementadas

### 1. ✅ Arquivo `vite.config.js` Criado
- Configuração adequada para processar variáveis de ambiente
- Fallbacks para as credenciais do Supabase
- Otimizações de build

### 2. ✅ Dockerfile Atualizado
- Variáveis de ambiente definidas no build
- Argumentos de build configurados
- Fallbacks para as credenciais

### 3. ✅ Stack do Portainer Corrigido
- Nome do serviço alterado para `dashboard_app` (compatível com Traefik)
- Labels do Traefik adicionados diretamente no stack
- Variáveis de ambiente hardcoded para garantir funcionamento

### 4. ✅ Scripts de Build e Teste
- `build-image.sh` - Para construir a imagem no servidor
- `test-local.ps1` - Para testar localmente no Windows
- `portainer-with-build.yml` - Stack com build integrado

## 🚀 Como Fazer o Deploy

### Opção 1: Usar Stack Atualizado (Recomendado)

1. **No Portainer, substitua o stack atual por:**
   ```yaml
   # Use o conteúdo do arquivo portainer-final.yml
   ```

2. **Ou use o stack com build integrado:**
   ```yaml
   # Use o conteúdo do arquivo portainer-with-build.yml
   ```

### Opção 2: Build Manual no Servidor

1. **Acesse o servidor via SSH:**
   ```bash
   ssh root@seu-servidor
   ```

2. **Navegue para o diretório do projeto:**
   ```bash
   cd /opt/stomalovers-dashboard
   ```

3. **Execute o script de build:**
   ```bash
   chmod +x build-image.sh
   ./build-image.sh
   ```

4. **Atualize o stack no Portainer** com o arquivo `portainer-final.yml`

## 🧪 Teste Local (Windows)

Para testar antes do deploy:

```powershell
# Execute no PowerShell
.\test-local.ps1
```

Acesse: http://localhost:8080
- **Usuário:** stomalovers
- **Senha:** Sourica2025

## 🔍 Verificação do Deploy

Após o deploy, verifique:

1. **Container está rodando:**
   ```bash
   docker ps | grep stomalovers
   ```

2. **Logs do container:**
   ```bash
   docker logs stomalovers-dashboard
   ```

3. **Teste de conectividade:**
   ```bash
   curl -I https://dash.stomalovers.com.br
   ```

4. **Acesse o dashboard:**
   - URL: https://dash.stomalovers.com.br
   - Usuário: stomalovers
   - Senha: Sourica2025

## 🐛 Solução de Problemas

### Página ainda em branco?
1. Verifique os logs do container
2. Confirme se as variáveis de ambiente estão corretas
3. Teste localmente primeiro

### Erro 502 Bad Gateway?
1. Verifique se o Traefik está rodando
2. Confirme se o serviço `dashboard_app` está ativo
3. Verifique a configuração do `dashboard.yml` no Traefik

### Erro de conexão com Supabase?
1. Verifique se as credenciais estão corretas
2. Teste a conectividade com o Supabase
3. Verifique se as tabelas existem no banco

## 📋 Arquivos Modificados

- ✅ `vite.config.js` - Novo arquivo de configuração
- ✅ `Dockerfile` - Atualizado com variáveis de build
- ✅ `portainer-final.yml` - Stack corrigido
- ✅ `portainer-with-build.yml` - Stack com build integrado
- ✅ `build-image.sh` - Script de build
- ✅ `test-local.ps1` - Script de teste local

## 🎯 Próximos Passos

1. **Teste localmente** usando `test-local.ps1`
2. **Atualize o stack** no Portainer
3. **Monitore os logs** após o deploy
4. **Teste o acesso** via https://dash.stomalovers.com.br

---

**Status:** ✅ Pronto para deploy
**Última atualização:** $(Get-Date)
