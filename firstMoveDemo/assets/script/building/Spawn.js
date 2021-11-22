// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


class makeAUnit {
  constructor({unitPrefab, root, fatherNode}) {
    this.unitPrefab = unitPrefab
    this.root = root
    this.fatherNode = fatherNode
  }


  getBirthPlace({birthPlace}) {
    const type = 'inScreen'
    let x
    let y
    switch (birthPlace) {
      case "player":
        const range = 200
        // 获取一个随机 x
        x = (Math.random() - 0.5) * range
        // 获取一个随机 y
        y = (Math.random() - 0.5) * range
        // 设置位置
        return cc.v2(x + window.global.player.x, y + window.global.player.y)
      case "origin":
        // 这个当处于相对位置的时候（spawn 作为其他人的子节点）会有问题
        // 获取一个随机 x
        x = this.fatherNode.x
        // 获取一个随机 y
        y = this.fatherNode.y
        // 设置位置
        return cc.v2(x, y)
      case "inScreen":
        // 获取一个随机 x
        x = (Math.random() - 0.5) * window.global.canvas.width
        // 获取一个随机 y
        y = (Math.random() - 0.5) * window.global.canvas.height
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
    enemyForce: 0,
    birthPlace: "inScreen",
  },

  // 初始化
  init() {
    this.processTimer = 0 // 生产进度
    this.list = []
    this.enabled = true
  },

  onLoad() {
    let root
    switch (this.enemyForce) {
      case 0:
        root = window.global.enemyRoot
        break
      case 1:
        root = window.global.alliesRoot
        break
      case 2:
        root = window.global.neutralRoot
        break
    }
    const maker = new makeAUnit({fatherNode: this.node, unitPrefab: this.unitPrefab, root: root})
    this.make = () => maker.make({birthPlace: this.birthPlace})
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
