FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy prisma schema
COPY src/prisma ./src/prisma

# Generate Prisma Client
RUN npx prisma generate --schema=./src/prisma/schema.prisma

# Copy source code
COPY . .

# Expose backend port
EXPOSE 4000

# Run migrations and start server
CMD npx prisma migrate deploy --schema=./src/prisma/schema.prisma && node src/server.js