// Load environment variables from .env file
require('dotenv').config({ path: '.env' });

// Log loaded environment variables for debugging (without showing passwords)
console.log('📦 Loading environment variables...');
console.log(`DB_HOST: ${process.env.DB_HOST || 'NOT SET'}`);
console.log(`DB_PORT: ${process.env.DB_PORT || '3306'}`);
console.log(`DB_USERNAME: ${process.env.DB_USERNAME || 'NOT SET'}`);
console.log(`DB_DATABASE: ${process.env.DB_DATABASE || 'NOT SET'}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '***SET***' : 'NOT SET'}`);

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
        DB_HOST: process.env.DB_HOST || 'localhost',
        DB_PORT: process.env.DB_PORT || 3306,
        DB_USERNAME: process.env.DB_USERNAME || 'root',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
        DB_DATABASE: process.env.DB_DATABASE || 'childclub',
        JWT_SECRET: process.env.JWT_SECRET || 'childclub-secret-key',
        FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
        API_URL: process.env.API_URL || 'http://localhost:3001',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3001,
        DB_HOST: process.env.DB_HOST || 'localhost',
        DB_PORT: process.env.DB_PORT || 3306,
        DB_USERNAME: process.env.DB_USERNAME || 'root',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
        DB_DATABASE: process.env.DB_DATABASE || 'childclub',
        JWT_SECRET: process.env.JWT_SECRET || 'childclub-secret-key',
        FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
        API_URL: process.env.API_URL || 'http://localhost:3001',
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



