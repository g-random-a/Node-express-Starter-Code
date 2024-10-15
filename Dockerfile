# Use the official Node.js image
FROM node:20
# Set working directory
WORKDIR /usr/src/app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Install TypeScript globally
RUN npm install -g typescript
# Copy the rest of the application files
COPY . .
# Transpile TypeScript to JavaScript
RUN tsc
# Expose the application port (adjust if different)
EXPOSE 3000
# Start the app using the transpiled JavaScript
CMD ["npm", "start"]