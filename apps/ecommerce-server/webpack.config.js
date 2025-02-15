const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/ecommerce-server'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',

      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],

      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/app/schemas/*.gql',
          to: '.',
          globOptions: {
            ignore: ['**/node_modules/**'],
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: ['graphql-tag/loader'],
      },
    ],
  },
};
