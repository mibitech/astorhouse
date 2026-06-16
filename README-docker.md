# Docker Setup - Canil AstorHouse

Este projeto está configurado para executar em container Docker com Nginx e proxy reverso Traefik.

## Estrutura

```
├── Dockerfile              # Multi-stage build (Node.js + Nginx)
├── nginx.conf              # Configuração do Nginx
├── docker-compose.yml      # Orquestração com Traefik
└── README-docker.md        # Esta documentação
```

## Arquivos de Configuração

### Dockerfile
- **Stage 1**: Build da aplicação React/Vite com Node.js 20
- **Stage 2**: Serve arquivos estáticos com Nginx Alpine

### nginx.conf
- Configuração básica para servir SPA (Single Page Application)
- Suporte a roteamento client-side com `try_files`
- Serve na porta 80

### docker-compose.yml
- Serviço `frontend` com labels Traefik
- Configurado para domínio `www.astorhouse.com.br`
- SSL/TLS com Let's Encrypt
- Rede externa `rede_mibi`

## Comandos para Build e Deploy

### 1. Build e Subir o Container (com Traefik)
```bash
# Build e deploy em um comando
docker-compose up -d --build

# Ou separadamente:
# docker build -t astorhouse:latest .
# docker-compose up -d
```

### 2. Verificar Status
```bash
docker-compose ps
docker logs astorhouse
```

### 3. Parar o Container
```bash
docker-compose down
```

## Requisitos

- Docker e Docker Compose instalados na VPS
- Rede externa `rede_mibi` criada
- Traefik configurado na mesma rede
- DNS apontando `www.astorhouse.com.br` para o servidor
- Arquivos `.env` copiados para a VPS (nunca comitar)

## Setup na VPS

### 1. Copiar arquivos para VPS
```bash
# Via rsync (recomendado — exclui node_modules e .git)
rsync -avz --exclude node_modules --exclude .git . usuario@vps:/caminho/destino/

# Ou via git
git clone <repositorio> /caminho/destino/
```

## Criação da Rede (se necessário)
```bash
docker network create rede_mibi
```

## Logs e Debug
```bash
# Logs do container
docker logs astorhouse -f

# Acessar container
docker exec -it astorhouse sh

# Verificar arquivos servidos
docker exec -it astorhouse ls -la /usr/share/nginx/html
```

## Variáveis de Ambiente

As variáveis do `.env` são lidas pelo Vite no build. Copie o arquivo `.env` para a VPS antes de rodar `docker-compose up --build`.

## Acesso

- **Produção**: https://www.astorhouse.com.br (via Traefik + Let's Encrypt)
- **Local**: http://localhost (se rodar o Nginx diretamente)
