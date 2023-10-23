module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          path: require.resolve("path-browserify"),
          os: require.resolve("os-browserify/browser"),
          crypto: require.resolve("crypto-browserify"),
          buffer: require.resolve("buffer-browserify"),
          assert: require.resolve("assert-browserify"),
          stream: require.resolve("stream-browserify"),
        },
      },
    },
  },
};
