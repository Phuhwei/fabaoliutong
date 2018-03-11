const webpack = require('webpack');
const path = require('path');
const cssModuleLoader = require('./webpack/css-module-loader');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const LAUNCH_COMMAND = process.env.npm_lifecyle_event;
const { IP, NODE_ENV } = process.env;
const env = NODE_ENV;
const isProduction = env === 'production' || env === 'staging' || LAUNCH_COMMAND === 'production';

function findBuildDir() {
  switch (env) {
    case 'production':
      return 'build_production';
    case 'staging':
      return 'build_staging';
    default:
      return 'build';
  }
}

const extractStyles = new ExtractTextPlugin({
  filename: 'css/application.css',
  disable: !isProduction,
  allChunks: true,
});

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: `${__dirname}/src/index.html`,
  filename: 'index.html',
  inject: 'body',
});

const PATHS = {
  // this app will be the entry point;
  app: [
    path.join(__dirname, 'src/index.tsx'),
    path.join(__dirname, 'src/css/shared.css'),
  ],
  // this will be the output path;
  build: path.resolve(__dirname, findBuildDir()),
};

const environment = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(env),
    IP: `'${IP}'`,
  },
});

if (isProduction) {
  console.log('Bundling for production...');
} else {
  PATHS.app.push('webpack-hot-middleware/client');
  console.log('Bundling for development...');
}

// this is for vendor caching
const VENDOR_LIBS = [
  'react',
  'react-bootstrap',
  'react-dom',
  'react-redux',
  'react-router-dom',
  'redux',
  'redux-thunk',
  'superagent',
];

const isVendor = module => (
  module.context && module.context.indexOf('node_modules') !== -1
);

const entryPoint = isProduction
  ?
  {
    bundle: PATHS.app,
    vendor: VENDOR_LIBS,
  }
  :
  {
    bundle: PATHS.app,
  };

const base = {
  entry: entryPoint,
  output: {
    path: PATHS.build,
    filename: '[name].js',
    publicPath: '/',
  },
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, exclude: /node_modules/, loader: 'awesome-typescript-loader' },
      { test: /\.js$/, use: ['source-map-loader'], enforce: 'pre' },
      { // module css files
        test: /\.css$/,
        exclude: [
          'node_modules',
          'bower_components',
          path.resolve(__dirname, 'src/css'),
        ],
        use: cssModuleLoader(isProduction, true),
      },
      { // shared css files
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src/css'),
        ],
        use: cssModuleLoader(isProduction, false),
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/',
            },
          },
        ],
      },
    ],
  },
};

const developmentBuild = {
  // this doubles the size of the output the app is 3.4mb before adding this
  devtool: 'inline-source-map',
  plugins: [
    extractStyles,
    HtmlWebpackPluginConfig,
    environment,
    new webpack.HotModuleReplacementPlugin(),
  ],
};

const productionBuild = {
  plugins: [
    extractStyles,
    HtmlWebpackPluginConfig,
    environment,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
      minChunks: module => isVendor(module),
    }),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: false, minimize: true }),
  ],
};

module.exports = Object.assign({}, base, isProduction
  ? !console.log('prod') && productionBuild
  : !console.log('dev') && developmentBuild);
