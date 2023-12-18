# Dockerfile
# Use an official Node.js runtime as a parent image
FROM node:18-bullseye-slim

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the content of the local src directory to the working directory
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 9000

# Define environment variable
JWT_SECRET=capstoneprojectpalingsecret
NEXT_PUBLIC_API_KEY=AIzaSyBvQTLzSpsHMDBNyxgrvBV1G-CIlWf69SM
NEXT_PUBLIC_AUTH_DOMAIN=herbalid.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=herbalid
NEXT_PUBLIC_STORAGE_BUCKET=gs://herbalid.appspot.com
NEXT_PUBLIC_MESSAGING_SENDER_ID=264358562871
NEXT_PUBLIC_APP_ID=1:264358562871:web:1fc90b600fda767d5303b2
NEXT_PUBLIC_MEASUREMENT_ID=G-5T20MJ7FPZ

# Run the application
CMD ["npm", "start"]