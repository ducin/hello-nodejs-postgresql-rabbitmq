FROM postgres:15-alpine

COPY init.sql /docker-entrypoint-initdb.d/
COPY seed.sql /docker-entrypoint-initdb.d/

# Install Node.js for running the seed script
RUN apk add --update nodejs npm

# Install required Node.js dependencies
RUN npm install -g pg

# Make the seed script executable
# RUN chmod +x /docker-entrypoint-initdb.d/seed.js
