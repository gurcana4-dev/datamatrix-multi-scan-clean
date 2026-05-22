FROM node:22-alpine
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install && pnpm --filter datamatrix-multi-scan build
EXPOSE 3100
CMD ["pnpm", "--filter", "datamatrix-multi-scan", "start"]
