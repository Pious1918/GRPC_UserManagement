# Use an official Node.js runtime as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Copy the external proto file from the auth-service directory into the container


# Expose the ports your app runs on
EXPOSE 3001 50052

# Command to run the application (update `index.js` if necessary)
CMD ["node", "."]
