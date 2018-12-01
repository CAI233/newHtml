'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://drpapitest.saselomo.com/"'//"开发环境地址"
  // API_ROOT: '"http://localhost:25435/"'//"开发环境地址"
})
