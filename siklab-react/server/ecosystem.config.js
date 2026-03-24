module.exports = {
  apps: [
    {
      name: 'siklab-api',
      script: './server.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster', // Cluster mode for load balancing
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      // Error and output logging
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Keep application alive
      max_memory_restart: '500M', // Restart if memory exceeds 500MB
      max_restarts: 10,
      min_uptime: '5m',
      // Watch for file changes (disable in production for safety)
      watch: false,
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 3000,
      // Environment
      args: '--color'
    }
  ],
  // Deploy configuration for Hostinger
  deploy: {
    production: {
      user: 'node',
      host: 'your-hostinger-domain.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/siklab.git',
      path: '/home/user/siklab',
      'post-deploy': 'npm install --production && npm run build && pm2 restart siklab-api'
    }
  }
};
