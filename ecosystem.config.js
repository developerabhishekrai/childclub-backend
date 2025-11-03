// Load environment variables from .env file
require('dotenv').config({ path: '.env' });

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
      cwd: '/home/ubuntu/childclub-backend',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        DB_HOST: 'localhost',
        DB_PORT: 3306,
        DB_USERNAME: 'root',
        DB_PASSWORD: 'Nibha@123',
        DB_DATABASE: 'childclub_db',
        JWT_SECRET: 'your-super-secret-jwt-key-here',
        JWT_EXPIRES_IN: '24h',
        FRONTEND_URL: 'https://childclub.in',
        NEXT_PUBLIC_API_URL: 'https://api.childclub.in',
      },
      error_file: '/home/ubuntu/.pm2/logs/childclub-backend-error.log',
      out_file: '/home/ubuntu/.pm2/logs/childclub-backend-out.log',
      log_file: '/home/ubuntu/.pm2/logs/childclub-backend-combined.log',
      time: true,
      merge_logs: true,
      restart_delay: 4000,
    },
  ],
};
