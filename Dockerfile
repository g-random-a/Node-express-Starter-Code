# Use the official Node.js image
FROM node:20-alpine
# Set working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .
# Transpile TypeScript to JavaScript
RUN tsc
# Expose the application port (adjust if different)
EXPOSE 3000
# Start the app using the transpiled JavaScript
CMD ["npm", "start"]