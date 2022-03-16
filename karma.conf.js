module.exports = function(config) {
  config.set({
      // 其他配置 ......
      basePath: path.resolve(__dirname, './test'), // 被测试组件所在根目录，因为编译器的限制，要求所有被测组件必须在此目录下
      files: [
          'node_modules/miniprogram-simulate/build.js', // 注入 miniprogram-simulate，会在 window 下挂载 simulate 对象
          'test/spec/*.test.js', // 测试用例
          'src/component/*', // 组件文件，路径尽量不要包含 ../ 或者 ./，不然 wcc 编译器可能识别不了
      ],
      preprocessors: {
          'src/component/*': ['filemap'], // 组件文件使用 filemap 将各个文件内容注入到浏览器，路径尽量不要包含 ../ 或者 ./，不然 wcc 编译器可能识别不了
          'test/spec/*.test.js': ['webpack', 'dirname'], // 使用 webpack 进行打包，使用 dirname 处理测试用例中的 __dirname 变量
      },
      webpack: {
          optimization: {
              minimize: false, // 不做压缩，方便调试
          },
          node: {
              __dirname: false, // 不注入 __dirname，由 preprocessor 来处理
          },
      },
      // 其他配置 ......
  })
}