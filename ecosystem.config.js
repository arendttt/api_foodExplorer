module.exports = {
  apps : [{
    name: "app",
    script: "./src/server.js", // nome do arquivo
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}