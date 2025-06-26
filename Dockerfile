FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY container-src/package*.json ./
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY container-src/src ./src

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy only production dependencies
COPY container-src/package*.json ./
RUN npm ci --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Set user to non-root for security
USER node

# Add healthcheck to verify the container is working properly
# Checks if the Node.js process is still running
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "process.exit(0)" || exit 1

# Command to run the application
CMD ["node", "dist/index.js"]
