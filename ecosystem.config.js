require('dotenv').config({ path: '.env' });

module.exports = {
  apps: [
    {
      name: 'childclub-backend',
      script: 'dist/main.js',
      cwd: process.env.PM2_CWD || '/home/ubuntu/childclub-backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: process.env.NODE_ENV || 'production',
        PORT: process.env.PORT || 3001,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT || 3306,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_DATABASE: process.env.DB_DATABASE,
        JWT_SECRET: process.env.JWT_SECRET,
        FRONTEND_URL: process.env.FRONTEND_URL,
        API_URL: process.env.API_URL,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3001,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT || 3306,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_DATABASE: process.env.DB_DATABASE,
        JWT_SECRET: process.env.JWT_SECRET,
        FRONTEND_URL: process.env.FRONTEND_URL,
        API_URL: process.env.API_URL,
      },
      error_file: '/home/ubuntu/.pm2/logs/childclub-backend-error.log',
      out_file: '/home/ubuntu/.pm2/logs/childclub-backend-out.log',
      log_file: '/home/ubuntu/.pm2/logs/childclub-backend-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
    },
  ],
};



