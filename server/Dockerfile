# Base image for stages
FROM node:16.14.2 AS base-image

# ----------------------------------------------------------
# STAGE 1 - Seeder
# ----------------------------------------------------------
# Node base image with the latest LTS version
FROM base-image AS seeder
# Updates
RUN npm install -g npm@latest
# Changes working directory
WORKDIR /usr/src/seeder
# Create and assign user/group permissions
RUN addgroup --system open-co2 && \
adduser --system --ingroup open-co2 open-co2 && \
chown open-co2:open-co2 /usr/src/seeder
# Switch to defined user:group
USER open-co2:open-co2
# Copy all seeder sources
COPY --chown=open-co2:open-co2 /seeder/ .
# Install node dependencies
RUN npm ci
# Run main script to execute seeder (node seed.js)
RUN npm start

# ----------------------------------------------------------
# STAGE 2 - Server
# ----------------------------------------------------------
# Node base image with the latest LTS version
FROM base-image
# Updates
RUN npm install -g npm@latest
# Changes working directory
WORKDIR /usr/src/app
# Create and assign user/group permissions
RUN addgroup --system open-co2 && \
    adduser --system --ingroup open-co2 open-co2 && \
    chown open-co2:open-co2 /usr/src/app
# Copy project sources to a current directory
COPY --chown=open-co2:open-co2 /app/ .
# Copy the JS compiled data and DB init script from the seeder image
COPY --chown=open-co2:open-co2 --from=seeder ["/usr/src/seeder/data/output/*.js", "/usr/src/app/data/input/"]
COPY --chown=open-co2:open-co2 --from=seeder ["/usr/src/seeder/db-init.js", "/usr/src/app/data/"]
# Install node dependencies
RUN npm ci
RUN npm prune --production && \
npm cache clean --force
# Start server with main node script
CMD ["npm", "start"]
# Expose container on port
EXPOSE 4000
