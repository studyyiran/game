// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


class test {
  constructor(unitPrefab) {
    this.unitPrefab = unitPrefab
    this.list = []
  }


  getBirthPlace() {
    const type = 'inScreen'
    switch(type) {
      case "inScreen":
        // 获取一个随机 x
        const x = (Math.random() - 0.5) * game.width
        // 获取一个随机 y
        const y = (Math.random() - 0.5) * game.height
        // 设置位置
        return cc.v2(x, y)
    }
  }

  make() {
    // 生成
    const newUnit = cc.instantiate(this.unitPrefab)
    // 出生范围
    newUnit.setPosition(this.getBirthPlace())
    // 放入队列中
    this.list.push(newUnit)
    // 设置死亡
    newUnit.getComponent('unit').addDead(() => {
      // 从队列里面删除
      this.list = this.list.filter((instance) => {
        return instance !== newUnit
      })
    })

    // 设置销毁回调 spawn
    timerBomb.getComponent('TimerBomb').onDestoryCallSpawn = () => {
      this.timerBombCount = this.timerBombCount - 1

    }

  }
}

cc.Class({
  extends: cc.Component,

  properties: {
    TimerBomb: {
      default: null,
      type: cc.Prefab
    },
    JinZhan: {
      default: null,
      type: cc.Prefab
    },
    interval: 300,
    timerBombMax: 2
  },

  makeNewThing () {
    const timerBomb = cc.instantiate(this.TimerBomb)
    const game = this.node.parent
    // 获取一个随机 x
    const x = (Math.random() - 0.5) * game.width
    // 获取一个随机 y
    const y = (Math.random() - 0.5) * game.height
    // 设置位置
    timerBomb.setPosition(cc.v2(x, y))
    // 保存在队列中
    this.timerBomList.push(timerBomb)
    // 设置销毁回调 spawn
    timerBomb.getComponent('TimerBomb').onDestoryCallSpawn = () => {
      this.timerBombCount = this.timerBombCount - 1
      // 从队列里面删除
      this.timerBomList = this.timerBomList.filter((instance) => {
        return instance !== timerBomb
      })
    }
    // console.log(this.timerBomList)
    return timerBomb
  },

  makeNewThing2 () {
    const timerBomb = cc.instantiate(this.JinZhan)
    const game = this.node.parent
    // 获取一个随机 x
    const x = (Math.random() - 0.5) * game.width
    // 获取一个随机 y
    const y = (Math.random() - 0.5) * game.height
    // 设置位置
    timerBomb.setPosition(cc.v2(x, y))
    // 保存在队列中
    this.timerBomList.push(timerBomb)

    // 添加上去
    return timerBomb
  },

  init() {
    // 初始化
    this.timerCount = 0
    this.timerBombCount = 0

    this.timerBomList = []
    this.enabled = true
  },

  onLoad() {
    if (!this.hehe) {
      const {enemyRoot} = window.global
      const {children} = enemyRoot
      this.hehe = this.schedule(() => {
        if (children.length < 5) {// maxCount
          enemyRoot.addChild(this.makeNewThing2())
        }
      }, 1)// interval
    }
  },

  start () {
    this.init()
  },

  dead() {
    this.enabled = false
    this.timerBomList.forEach((node) => node?.destroy())
  },

  update (dt) {
    this.timerCount += 1
  // console.log(this.timerCount)
    if (
      this.timerCount > this.interval &&
      this.timerBombCount < this.timerBombMax
    ) {

      // 重置计时器
      this.timerCount = 0
      // 技数++
      this.timerBombCount++
      console.log(this.timerBombCount)
      console.log("max is" + this.timerBombMax)
      // console.log('get it' + this.timerBombCount)
      this.node.parent.addChild(this.makeNewThing())
    }
  }
})
