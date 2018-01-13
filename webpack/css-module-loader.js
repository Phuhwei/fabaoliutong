const ExtractTextPlugin = require('extract-text-webpack-plugin');

const cssModuleLoader = (isProduction, isLocal) => {
  if (isProduction) {
    return ExtractTextPlugin.extract({
      use: [
        {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: `[local]${isLocal ? '--[hash:base64:5]' : ''}`,
          },
        },
        {
          loader: 'resolve-url-loader',
        },
      ],
    });
  }

  return [
    { loader: 'style-loader' },
    {
      loader: 'css-loader',
      options: {
        modules: true,
        localIdentName: `[local]${isLocal ? '--[hash:base64:5]' : ''}`,
      },
    },
    { loader: 'resolve-url-loader' },
  ];
};

module.exports = cssModuleLoader;

