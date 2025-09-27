# Dashboard Stomalovers - Analytics & Insights

Dashboard completo para análise de vendas e leads da Stomalovers, desenvolvido com React/Vite, conectado ao Supabase e configurado para deploy via Docker.

## 🚀 Funcionalidades

### 📊 Visão Geral
- **KPIs Principais**: Receita mensal, novos alunos, novos leads e ticket médio
- **Gráfico de Receita**: Evolução das vendas nos últimos 6 meses
- **Distribuição por Curso**: Gráfico de pizza mostrando receita por produto
- **Últimas Vendas**: Tabela das 5 vendas mais recentes

### 📈 Marketing
- **KPIs de Marketing**: Canais ativos, campanhas, melhor canal e taxa de conversão
- **Análise por Canal**: Receita gerada por fonte de tráfego (UTM Source)
- **Análise por Campanha**: Performance das campanhas de marketing (UTM Campaign)
- **Distribuição Geográfica**: Número de alunos por estado

### 📚 Produtos
- **Tabela Detalhada de Cursos**: Performance individual com métricas completas
- **Gráfico Temporal**: Vendas por curso específico ao longo do tempo
- **Sistema de Ordenação**: Clicável em todas as colunas
- **Análise Interativa**: Seleção de curso para visualização detalhada

## 🔐 Segurança

- **Sistema de Login**: Autenticação segura com credenciais fixas
- **Proteção de Dados**: Acesso restrito aos dados pessoais dos clientes
- **Headers de Segurança**: Configurações Nginx para proteção adicional

## 🛠 Tecnologias

- **Frontend**: React 19 + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Backend**: Supabase (PostgreSQL)
- **Containerização**: Docker + Nginx
- **Proxy Reverso**: Traefik (para produção)

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Acesso ao Supabase configurado
- Domínio configurado (para produção)

## 🚀 Deploy na VPS

### 1. Preparação do Ambiente

```bash
# Criar diretório do projeto
mkdir -p /opt/stomalovers-dashboard
cd /opt/stomalovers-dashboard
```

### 2. Arquivos Necessários

Copie os seguintes arquivos para o diretório `/opt/stomalovers-dashboard/`:

- `Dockerfile`
- `nginx.conf`
- `docker-compose.yml`
- `.env`

### 3. Configuração do Arquivo .env

Crie o arquivo `.env` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dyvjgxpomqkbxhgcznyw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5dmpneHBvbXFrYnhoZ2N6bnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNjM1MTAsImV4cCI6MjA1ODczOTUxMH0.G8QLXKXQQVTW-QuIHhnRnImCrrms5ex8hjqazaInstw
```

### 4. Configuração DNS

No painel da Cloudflare, adicione um registro:
- **Tipo**: A ou CNAME
- **Nome**: dash
- **Valor**: IP da sua VPS
- **Proxy**: Ativado (nuvem laranja)

### 5. Deploy da Aplicação

```bash
# Construir e iniciar o container
sudo docker-compose up -d --build

# Verificar se está rodando
sudo docker ps

# Ver logs (se necessário)
sudo docker logs stomalovers-dashboard
```

### 6. Verificação

Após alguns minutos, acesse:
- **URL**: https://dash.stomalovers.com.br
- **Usuário**: stomalovers
- **Senha**: Sourica2025

## 🔧 Comandos Úteis

```bash
# Parar a aplicação
sudo docker-compose down

# Atualizar a aplicação
sudo docker-compose down
sudo docker-compose up -d --build

# Ver logs em tempo real
sudo docker logs -f stomalovers-dashboard

# Verificar status
sudo docker ps
```

## 📊 Estrutura do Banco de Dados

O dashboard conecta-se às seguintes tabelas no Supabase:

- **Leads**: Informações dos leads/clientes
- **matriculas**: Dados das vendas/matrículas
- **cursos**: Informações dos produtos/cursos
- **enderecos**: Dados geográficos dos clientes

## 🎨 Personalização

### Cores e Branding
As cores podem ser ajustadas no arquivo de configuração do Tailwind CSS.

### Credenciais de Login
Para alterar as credenciais, edite o arquivo `src/lib/auth.js`.

### Configurações do Supabase
Atualize as variáveis no arquivo `.env`.

## 🐛 Solução de Problemas

### Container não inicia
```bash
# Verificar logs
sudo docker logs stomalovers-dashboard

# Reconstruir imagem
sudo docker-compose down
sudo docker-compose up -d --build
```

### Erro de conexão com Supabase
- Verifique as variáveis no arquivo `.env`
- Confirme se as credenciais estão corretas
- Teste a conectividade com o Supabase

### Problemas de SSL/Domínio
- Verifique se o DNS está propagado
- Confirme se o Traefik está rodando
- Aguarde alguns minutos para a geração do certificado

## 📞 Suporte

Para questões técnicas ou dúvidas sobre o dashboard, consulte a documentação ou entre em contato com o desenvolvedor.

---

**Dashboard Stomalovers** - Desenvolvido com ❤️ para análise de dados educacionais

