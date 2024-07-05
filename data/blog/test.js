// 定义三种状态
const state = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
}

class MyPromise {
  // 构造函数，在new Promise的时候立刻执行，通常需要花费一些时间
  constructor(executor) {
    this.state = state.PENDING // 初始化状态为pending
    this.value = undefined // 初始化value为undefined
    this.onFulfilledCbs = [] // 存放onFulfilled回调函数,因为可能有多个then
    this.onRejectedCbs = [] // 存放onRejected回调函数

    try {
      executor(this.resolve, this.reject) //立刻执行executor
    } catch (error) {
      this.reject(error) // 如果执行executor时出错，直接reject
    }
  }

  runAllCallbacks = () => {
    // 如果状态是fulfilled，依次执行存入的onFulfilled函数们
    if (this.state === state.FULFILLED) {
      this.onFulfilledCbs.forEach((cb) => cb(this.value))
      this.onFulfilledCbs = [] // 执行完后清空
    }
    // 如果状态是rejected，依次执行存入的onRejected函数们
    if (this.state === state.REJECTED) {
      this.onRejectedCbs.forEach((cb) => cb(this.value))
      this.onRejectedCbs = []
    }
  }

  // resolve函数，因为使用箭头函数，所以这里的this指向MyPromise实例；如果使用普通函数，需要在new Promise时绑定this
  resolve = (value) => {
    if (this.state !== state.PENDING) return

    if (value instanceof MyPromise) {
      value.then(this.resolve, this.reject)
      return
    }
    this.state = state.FULFILLED
    this.value = value
    this.runAllCallbacks()
  }

  // reject函数
  reject = (error) => {
    if (this.state !== state.PENDING) return

    if (error instanceof MyPromise) {
      error.then(this.resolve, this.reject)
      return
    }
    this.state = state.REJECTED
    this.value = error
    this.runAllCallbacks()
  }

  // then方法，接受两个参数，onFulfilled和onRejected，告诉Promise状态变为fulfilled或rejected时该如何处理
  then(onFulfilled, onRejected) {
    // 无论如何，then方法都会返回一个新的Promise
    return new MyPromise((resolve, reject) => {
      // 往onFulfilledCbs和onRejectedCbs中数组添加回调函数
      this.onFulfilledCbs.push((value) => {
        try {
          const result = onFulfilled ? onFulfilled(value) : value
          if (result instanceof MyPromise) {
            result.then(resolve, reject)
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      })

      this.onRejectedCbs.push((error) => {
        try {
          const reason = onRejected ? onRejected(error) : error
          if (reason instanceof MyPromise) {
            reason.then(resolve, reject)
          } else {
            reject(reason)
          }
        } catch (error) {
          reject(error)
        }
      })

      this.runAllCallbacks() //执行回调函数，其中会判断状态以实现相应的回调函数们
    })
  }

  catch(onRejected) {
    this.then(null, onRejected)
  }
}

const myPromise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('Hello, Promise!') // 1秒后resolve
  }, 1000)
})
// 链式调用测试
myPromise
  .then((value) => {
    console.log('First then:', value)
    return 'Next Value'
  })
  .then((value) => {
    console.log('Second then:', value)
    return new MyPromise((resolve) => {
      setTimeout(() => {
        resolve('Resolved in Second then')
      }, 1000)
    })
  })
  .then((value) => {
    console.log('Third then:', value)
  })
  .catch((error) => {
    console.error('Caught error:', error)
  })
