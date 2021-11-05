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
        attack: 1, // 攻击力
        attackInterval: 1, // 攻击间隔
        speed: 100, // 移动速度
        viewRange: 100, // 视野范围
        attackRange: 100,
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
      const bool = distance < this.viewRange
      return bool
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
                // 可以移动
                // 无法再次攻击
                this.schedule(() => {
                    this.changeStatus('attack')
                }, this.attackInterval)
                break
        }
    },

    checkRange() {
        // console.log('checkRange')

        // 如果目标消失了 就取消
        if (this.moveTarget) {
            console.log(realDistanceDiffMin.call(this, this.moveTarget))
            if (!cc.isValid(this.moveTarget)) {
                this.moveTarget = null;
                this.changeStatus('')
            } else if (!this.isInViewRange(this.moveTarget)) {
                this.moveTarget = null;
                this.changeStatus('')
            } else if (realDistanceDiffMin.call(this, this.moveTarget) < 0) {
                // 已经贴边了。
                this.moveTarget = null;
                this.changeStatus('')
            }
        }

        if (!this.moveTarget) {
            // 玩家是否在范围内
            if (this.isInViewRange(this.global.player) && realDistanceDiffMin.call(this, this.global.player) > 0) {
                this.changeStatus('moveToTarget')
                this.moveTarget = this.global.player
            }
        }
        // 排序
        // const arr = this.spawnRef.timerBomList.sort((a, b) => {
        //     // 越小的 越靠前
        //     const dis1 = realDistanceDiffMin.call(this, a)
        //     const dis2 = realDistanceDiffMin.call(this, b)
        //     return dis1 - dis2
        // })
        // // 如果找到最近的敌人
        // if (arr?.length) {
        //     this.currentTarget = arr?.[0]
        //     // TODO 这种侵入，也让人觉得不舒服
        //     this.currentTarget.getComponent('TimerBomb').isTarget = true
        //     this.cdFindClosest = this.findClosestMinInterval
        // }
    },

    checkAttack() {
        if (this.moveTarget) {
            if (this.isInAttackRange()) {
                this.changeStatus('')
            }
        }
    },

    status2Action(dt) {
      switch (this.status) {
          case 'moveToTarget':
              // 朝方向移动
              moveTowardTarget.call(this, this.moveTarget, dt * this.speed)
              break;
          case 'attackInterval':
              break;
          case 'attack':
              // 播放攻击动画。
              // 对敌人造成损伤
              makeAttack(this, this.currentTarget)
              this.changeStatus('attackInterval')
              break;
      }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 获得玩家。
        this.global = window.global
        this.moveTarget = null // 移动的追踪目标
        this.currentTarget = null
        this.status = ''
    },

    start () {
    },

    update (dt) {
        // 判定视野范围内是否有敌人。（他需要关注，敌人节点，玩家节点）

        // 1 靠近
        // 2 攻击
        // 3 也可以被玩家选中为攻击目标 并且被攻击
        this.checkRange()
        this.checkAttack()
        this.status2Action(dt)
    },
});
