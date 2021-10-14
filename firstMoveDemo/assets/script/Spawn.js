// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    TimerBomb: {
      default: null,
      type: cc.Prefab
    },
    interval: 5000

  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  makeNewThing () {
    const timerBomb = cc.instantiate(this.TimerBomb)
    const game = this.node.parent
    // 获取一个随机 x
    const x = (Math.random() - 0.5) * game.width
    // 获取一个随机 y
    const y = (Math.random() - 0.5) * game.height
    // 设置位置
    timerBomb.setPosition(cc.v2(x, y))
    // 设置销毁回调 spawn
    timerBomb.getComponent('TimerBomb').onDestoryCallSpawn = () => {
      this.timerBombCount = this.timerBombCount - 1
    }
    // 添加上去
    game.addChild(timerBomb)
  },

  start () {
    // 初始化
    this.timerCount = 0
    this.timerBombCount = 0
    this.timerBombMax = 1
  },

  update (dt) {
    this.timerCount += this.timerCount + 1
    if (
      this.timerCount > this.interval &&
      this.timerBombCount < this.timerBombMax
    ) {
      // 重置计时器
      this.timerCount = 0
      // 技数++
      this.timerBombCount++
      this.makeNewThing()
    }
  }
})
