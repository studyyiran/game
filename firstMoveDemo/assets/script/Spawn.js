// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


class makeAUnit {
  constructor({unitPrefab, root}) {
    this.unitPrefab = unitPrefab
    this.root = root
  }


  getBirthPlace() {
    const type = 'inScreen'
    switch(type) {
      case "inScreen":
        // 获取一个随机 x
        const x = (Math.random() - 0.5) * window.global.canvas.width
        // 获取一个随机 y
        const y = (Math.random() - 0.5) * window.global.canvas.height
        // 设置位置
        return cc.v2(x, y)
    }
  }

  make(config) {
    // 生成
    const newUnit = cc.instantiate(this.unitPrefab)
    // 出生范围
    newUnit.setPosition(this.getBirthPlace(config))
    // 添加到节点
    this.root.addChild(newUnit)
    return newUnit
  }
}

cc.Class({
  extends: cc.Component,

  properties: {
    unitPrefab: {
      default: null,
      type: cc.Prefab
    },
    interval: 0,
    maxCount: 0,
  },

  // 初始化
  init() {
    this.processTimer = 0 // 生产进度
    this.list = []
    this.enabled = true
  },

  onLoad() {
    // TODO 阵营怎么去做，是个问题。再说
    const maker = new makeAUnit({unitPrefab: this.unitPrefab, root:  window.global.enemyRoot})
    this.make = () => maker.make()
    this.init()
  },

  start () {

  },

  dead() {
    this.enabled = false
  },

  update (dt) {
    // 如果 count 在范围内
    if (this.list.length < this.maxCount) {
      this.processTimer += dt
      // 如果到达了
      if (this.processTimer > this.interval) {
        this.processTimer = 0
        const newUnit = this.make()
        // 放入队列中
        this.list.push(newUnit)
        // 设置死亡
        newUnit.getComponent('unit').addOnDead(() => {
          // 从队列里面删除
          this.list = this.list.filter((instance) => {
            return instance !== newUnit
          })
        })
      }
    }
  }
})
