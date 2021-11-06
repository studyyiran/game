// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {realDistanceDiffMin, moveTowardTarget, makeAttack} from "./util";

cc.Class({
    extends: cc.Component,

    properties: {
        damage: 1, // 攻击力
        attackInterval: 1, // 攻击间隔
        speed: 100, // 移动速度
        viewRange: 100, // 视野范围
        attackRange: 10,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },


    isInViewRange(target) {
      const distance = realDistanceDiffMin.call(this, target)
        let canSee = distance < this.viewRange
        let canNotAttack = distance > this.attackRange
      return canSee && canNotAttack
    },

    isInAttackRange(target) {
        const distance = realDistanceDiffMin.call(this, target)
        const bool = distance < this.attackRange
        return bool
    },

    changeStatus(status) {
        this.status = status
        switch (status) {
            case 'attackInterval':
                // 重置

                // 可以移动
                // 无法再次攻击

                break
        }
    },

    attack() {
        this.scheduleOnce(() => {
            // 重新寻找下一个目标
            // this.attackTarget = null
            this.canNotAttach = false
            // this.changeStatus('idea')
        }, this.attackInterval)

    },

    checkRange() {
        // console.log('checkRange')
        // 如果目标消失了 就取消
        if (this.moveTargetNode) {
            // console.log(realDistanceDiffMin.call(this, this.moveTargetNode))
            if (!cc.isValid(this.moveTargetNode)) {
                this.moveTargetNode = null;
                this.changeStatus('idea')
            } else if (!this.isInViewRange(this.moveTargetNode)) {
                this.moveTargetNode = null;
                console.log('cancel')
                this.changeStatus('idea')
            }
        } else {
            // 玩家是否在范围内，重新找到最近的
            if (this.isInViewRange(this.global.player)) {
                console.log('moTOTarget again')
                this.changeStatus('moveToTarget')
                this.moveTargetNode = this.global.player
            }
        }
    },

    checkAttack() {
        if (this.attackTarget) {
            if (!cc.isValid(this.attackTarget.node)) {
                this.attackTarget = null;
                this.changeStatus('idea')
            } else if (!this.isInAttackRange(this.attackTarget.node)) {
                this.attackTarget = null;
                this.changeStatus('idea')
            }
        } else {
            // 玩家是否在范围内，重新找到最近的
            if (this.isInAttackRange(this.global.player)) {
                this.changeStatus('attack')
                this.attackTarget = this.global.player.getComponent('Player')
            }
        }
    },

    status2Action(dt) {
        let checkBreakFunc
      switch (this.status) {
          case "idea":

              // 搜索敌人来移动
              this.checkRange()
              if (this.status !== 'idea') {
                  break;
              }
              // 搜索敌人来进攻
              this.checkAttack()
              break;
          // case 'attackInterval':
          //     // 可以移动，但是无法再次攻击
          //     this.checkRange()
          //     break
          case 'moveToTarget':
              // 确认目标
              this.checkRange()
              if (this.status !== 'moveToTarget') {
                  break;
              }
              // 朝方向移动
              moveTowardTarget.call(this, this.moveTargetNode, dt * this.speed)
              // this.changeStatus('idea')
              // this.moveTargetNode = null
              break;
          case 'attack':
              console.log('attack')
              // 再次确认敌人
              this.checkAttack()
              if (this.status !== 'attack') {
                  break;
              }
              // 播放攻击动画。
              // 对敌人造成损伤
              if (!this.canNotAttach) {
                  makeAttack(this, this.attackTarget)
                  // 攻击冷却
                  this.attack()
              }

              this.changeStatus('idea')
              // this.attackTarget = null
              // this.canNotAttach = true
              break;
      }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 获得玩家。
        this.global = window.global
        this.moveTargetNode = null // 移动的追踪目标
        this.attackTarget = null
        this.status = 'idea'
    },

    start () {
    },

    update (dt) {
        // 判定视野范围内是否有敌人。（他需要关注，敌人节点，玩家节点）

        // 1 靠近
        // 2 攻击
        // 3 也可以被玩家选中为攻击目标 并且被攻击
        // console.log(this.status)
        this.status2Action(dt)
    },
});
