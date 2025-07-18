# Use Node.js LTS (Long Term Support) image as the base image
FROM node:lts

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire local directory to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port on which your Nest.js app runs
EXPOSE 3000

# Command to start your Nest.js application
CMD ["npm", "run", "start:prod"]
