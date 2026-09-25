# Dockerfile do site AstorHouse (React + Vite), no padrão dos demais frontends
# da suíte (nexus, aurora, lojaamordapatria).
# node:22: o corepack do node:20 é antigo e pode falhar ao verificar a
# assinatura de versões recentes do pnpm.
FROM node:22-alpine AS build
WORKDIR /app

# corepack usa a versão fixada em package.json ("packageManager"). Versão solta
# do pnpm já quebrou deploy de outro projeto sem ninguém mexer nele.
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# URL e chave pública do Supabase ficam em src/integrations/supabase/client.ts
# (padrão gerado pelo Lovable) — o build não depende de .env.
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
