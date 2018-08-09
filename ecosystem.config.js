module.exports = {
  apps : [{
      "name"      : 'tcl-staff',
      "max_memory_restart": "512M",
      "script"    : "app.js",
      "error_file"      : "/logs/err.log",
      "out_file"        : "/logs/out.log",
      "merge_logs"      : true,
      "log_date_format" : "YYYY-MM-DD HH:mm Z",
      "instances"  : "4",
      "env": {
          "NODE_ENV": "development",
      },
      "env_production" : {
          "NODE_ENV": "production"
      },
      "env_release" : {
          "NODE_ENV": "release"
      },
      "env_test" : {
          "NODE_ENV" : "test",
          "TEST"     : true
      },
      exec_mode  : "cluster",
    }
  ]
};
