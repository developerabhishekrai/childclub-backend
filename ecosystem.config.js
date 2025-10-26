module.exports = {
  apps: [
    {
      name: 'nestjs-backend',
      script: 'dist/main.js',
      cwd: '/home/ubuntu/childclub/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '/home/ubuntu/childclub/logs/backend-error.log',
      out_file: '/home/ubuntu/childclub/logs/backend-out.log',
      log_file: '/home/ubuntu/childclub/logs/backend-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
    },
  ],
};


