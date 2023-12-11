FROM node:16 as build

# workdir for docker
WORKDIR /tmp/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source  
COPY . .

# Build  the code 
RUN npm run build

# -------
FROM node:16-alpine

WORKDIR /app

# Copy source file to docker 
COPY . .

# Copy built files
COPY --from=build /tmp/app/dist .

# Build and cleanup
ENV NODE_ENV=production
RUN npm ci --omit=dev

# Start server
CMD ["node", "./node_modules/moleculer/bin/moleculer-runner.js"]
