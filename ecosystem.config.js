module.exports = {
  apps: [
    {
      name: 'philippines-ecommerce',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/html/ecom/app',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        NEXTAUTH_SECRET: 'super-secret-key-change-this-in-production-12345678901234567890',
        NEXTAUTH_URL: 'https://extremelifeherbal.com',
        NEXT_PUBLIC_APP_URL: 'https://extremelifeherbal.com',
        NEXT_PUBLIC_DEFAULT_CURRENCY: 'PHP',
        NEXT_PUBLIC_DEFAULT_LANGUAGE: 'en',
        NEXT_PUBLIC_VAT_RATE: '0.12',
        NEXT_PUBLIC_SUPPORTED_LANGUAGES: 'en,fil,ceb,ilo',
        DEBUG: 'false',
        SEED_DATABASE: 'false',
      },
      error_file: '/root/.pm2/logs/philippines-ecommerce-error.log',
      out_file: '/root/.pm2/logs/philippines-ecommerce-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: false,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],
};

