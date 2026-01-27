module.exports = {
    apps: [{
        name: "scholarflow",
        script: "./node_modules/.bin/serve",
        args: "-s dist -l 3000",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G', // Restart if memory usage exceeds 1GB
        exp_backoff_restart_delay: 100, // Delay between restarts
        env: {
            NODE_ENV: "production",
        },
        // Log configuration
        error_file: "./logs/app-error.log",
        out_file: "./logs/app-output.log",
        merge_logs: true,
        time: true // Add timestamp to logs
    }]
}
