let { AsyncParallelBailHook } = require('tapable'); // 实现AsyncParallelBailHook
class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncParallelBailHook(['name'])
    }
  }
  tap() {
    this.hooks.arch.tapPromise('react', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('react', name);
          resolve();
        }, 2000);
      })
    });
    this.hooks.arch.tapPromise('node', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('node', name);
          resolve();
        }, 2000);
      })
    });
  }
  start() {
    this.hooks.arch.promise('jw').then(function () {
      console.log('end');
    });
  }
}
let l = new Lesson();
l.tap();
l.start();