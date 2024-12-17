# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy project files
COPY . .

# Expose port
EXPOSE 8080

# Default command
CMD ["npm", "run", "build"]
CMD ["npm", "run", "start"]
