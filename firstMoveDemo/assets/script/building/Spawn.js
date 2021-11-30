/*
spawn：
1）可以把进度计算的逻辑，扔出去？
2）进度条的逻辑，肯定可以扔出去。
 */


class makeAUnit {
  constructor({unitPrefab, root, fatherNode, script}) {
    this.unitPrefab = unitPrefab
    this.root = root
    this.fatherNode = fatherNode
    this.script = script
  }


  getBirthPlace({birthMethod, newUnit}) {
    const type = 'inScreen'
    let x
    let y
    switch (birthMethod) {
      case "attack": {
        newUnit.getComponent('unit').attackPosition = cc.v2(-500, -100)
        return cc.v2(0, 0)
      }

      case "player":
        newUnit.getComponent("unit").orderMode = "followPlayer"
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
      case "defence": {
        newUnit.getComponent("unit").orderMode = "defence"
        const index = this.script.list.length
        const range = 100
        return this.fatherNode.convertToWorldSpaceAR(cc.v2(200 + range * (Math.random() - 0.5), range * (Math.random() - 0.5)))
      }
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
    const birthPlace = this.getBirthPlace({...config, newUnit })
    // 出生位置，一般来说，是在兵营的位置
    const sameWithBuilding = this.fatherNode.convertToWorldSpaceAR(cc.v2(0, 0));
    // 但是由于出生后，部队添加到了对应的节点，所以需要坐标转化一下
    const transToEnemyRoot = this.root.parent.convertToNodeSpaceAR(sameWithBuilding)

    // 算好设定的目标位置（例如防守的位置）
    newUnit.setPosition(transToEnemyRoot)

    // 设定目标坐标。一般来说。。目标是和兵营有关的。
    newUnit.getComponent('unit').birthPlace = this.root.parent.convertToNodeSpaceAR(birthPlace)
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
    birthMethod: "inScreen",
    perCount: 1,
  },

  // 初始化
  init() {
    this.processTimer = 0 // 生产进度
    this.list = []
    this.enabled = true

    const progress = this.node.parent?.getChildByName?.("progress")
    if (progress) {
      progress.width = this.node.width
      progress.x = this.node.x
      progress.y = this.node.height / 2
      this.progress = progress.getComponent(cc.ProgressBar)
    }
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
    const maker = new makeAUnit({script: this, fatherNode: this.node, unitPrefab: this.unitPrefab, root: root})
    this.make = () => maker.make({birthMethod: this.birthMethod})
    this.init()
  },

  start () {

  },

  dead() {
    this.enabled = false
  },

  update (dt) {
    if (this.progress) {
      this.progress.progress = this.processTimer / this.interval
    }
    // 如果 count 在范围内
    if (this.list.length < this.maxCount) {
      this.processTimer += dt
      // 如果到达了
      if (this.processTimer > this.interval) {
        this.processTimer = 0
        for (let i = 0 ; i < this.perCount; i++) {
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
  }
})
