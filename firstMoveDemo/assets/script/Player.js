// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {scriptAttackScript, realDistanceDiffMin} from "./util";

cc.Class({
    extends: cc.Component,
    properties: {
        toward: {
            default: {},
        },
    },

    onKeyDownHandler(e) {
        const currentKey = e.keyCode
        switch (currentKey) {
            case cc.macro.KEY.m:
                if (!this.aiSpeedDebuff) {
                    // 效果：每隔 200 毫秒，判定一下运动状态
                    this.aiSpeedDebuff = setInterval(() => {
                        if (Math.random() > 0.5) {
                            this.scriptAi.speed = 400
                        } else {
                            this.scriptAi.speed = 0
                        }
                    }, 200)
                    // 结束：若干秒后结束效果
                    setTimeout(() => {
                        clearInterval(this.aiSpeedDebuff)
                        this.scriptAi.speed = 400
                        this.aiSpeedDebuff = null
                    }, 2000)
                }
                break;
            case cc.macro.KEY.space:
                if (!this.speedBuff) {
                    // 效果：速度 * 3
                    this.getComponent('unit').speed = this.getComponent('unit').speed * 3
                    this.speedBuff = true
                    // 结束：若干秒后结束效果
                    setTimeout(() => {
                        this.speedBuff = false
                        this.getComponent('unit').speed = this.getComponent('unit').speed / 3
                    }, 3000)
                    // 冷却：
                }
                break;
            case cc.macro.KEY.a:
                if (!this.toward.a) {
                    this.towardX = -1
                }
                this.toward.a = true
                break;
            case cc.macro.KEY.d:
                if (!this.toward.d) {
                    this.towardX = 1
                }
                this.toward.d = true
                break;
            case cc.macro.KEY.w:
                if (!this.toward.w) {
                    this.towardY = 1
                }
                this.toward.w = true
                break;
            case cc.macro.KEY.s:
                if (!this.toward.s) {
                    this.towardY = -1
                }
                this.toward.s = true
                break;
            case cc.macro.KEY.n:
                // 攻击
                window.global.enemyRoot.children.some((target) => {
                    // 如果找到了
                    if (this.isInAttackRange(target)) {
                        scriptAttackScript(this, target)
                        return true
                    }

                })
                break;

        }
    },

    isInAttackRange(target) {
        const distance = realDistanceDiffMin.call(this, target)
        const bool = distance < this.getComponent('unit').meleeAttackRange
        return bool
    },

    onKeyUpHandler(e) {
        const currentKey = e.keyCode
        switch (currentKey) {
            case cc.macro.KEY.a:
                this.toward.a = false
                if (!this.toward.a && !this.toward.d) {
                    this.towardX = 0
                } else if (this.toward.a) {
                    this.towardX = -1
                }
                else if (this.toward.d) {
                    this.towardX = 1
                }
                break;
            case cc.macro.KEY.d:
                this.toward.d = false
                if (!this.toward.a && !this.toward.d) {
                    this.towardX = 0
                } else if (this.toward.a) {
                    this.towardX = -1
                }
                else if (this.toward.d) {
                    this.towardX = 1
                }

                break;
            case cc.macro.KEY.w:
                this.toward.w = false
                if (!this.toward.w && !this.toward.s) {
                    this.towardY = 0
                } else if (this.toward.w) {
                    this.towardY = 1
                } else if (this.toward.s) {
                    this.towardY = -1
                }

                break;
            case cc.macro.KEY.s:
                this.toward.s = false
                if (!this.toward.w && !this.toward.s) {
                    this.towardY = 0
                } else if (this.toward.w) {
                    this.towardY = 1
                } else if (this.toward.s) {
                    this.towardY = -1
                }

                break;

        }
    },

    onDestroy() {
        // console.log('onDestroy')
    },

    moveByToward(dt) {
        let realDt = dt
        // console.log(this.toward)
        if (this.towardX && this.towardY) {
            // 走对角线要根号 2
            realDt = realDt / 1.414
        }
        if (this.towardX) {
            // this.node.x += this.towardX * this.speed * realDt
        }
        if (this.towardY) {
            // this.node.y += this.towardY * this.speed * realDt
        }

        let speed = this.getComponent('unit').speed
        if (this.towardX && this.towardY) {
            // 走对角线要根号 2
            speed = speed / 1.414
        }
        let lv = this.node.getComponent(cc.RigidBody).linearVelocity
        if (this.towardX) {
            lv.x = this.towardX * speed
            // this.node.x += this.towardX * this.speed * realDt
        } else {
            lv.x = 0
        }
        if (this.towardY) {
            lv.y = this.towardY * speed
            // this.node.y += this.towardY * this.speed * realDt
        } else {
            lv.y = 0
        }
        this.node.getComponent(cc.RigidBody).linearVelocity = lv



        // if (this.towardXLast === 'a') {
        //     this.node.x -= this.speed * realDt
        // } else if (this.towardXLast === 'd') {
        //     this.node.x += this.speed * realDt
        // }

        // if (this.towardYLast === 'w') {
        //     this.node.y += this.speed * realDt
        // } else if (this.towardYLast === 's') {
        //     this.node.y -= this.speed * realDt
        // }

    },

    init() {
        this.node.enabled = true
    },

    onDead() {
        this.node.enabled = false
    },

    onLoad() {

        // console.log(2)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDownHandler, this);
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_PRESS, this.onKeyDownHandler, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUpHandler, this);
        // 为了给敌人施加 debuff 所以需要获取敌人的引用
        this.scriptAi = this.node.parent.getComponent('Game').Ai.getComponent('Ai')
        this.getComponent('unit').addOnDead(this.onDead.bind(this))
    },

    onEnable() {
        // console.log(5)
        // 每次重启游戏，出生
        // this.hp = this.maxHp 这个应该让 maxHp 来做
        this.node.setPosition(cc.v2(100, 0))
    },


    start() {
        // 这个需要初始化(似乎每次重生的时候。，没有调用这个。额。按理说应该会调用 https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html)
        // this.hp = this.maxHp
    },

    update(dt) {
        //
        const target = this.getComponent('unit')
        if (target.hp < target.maxHp) {
            target.hp = target.hp + 0.5;
        }
        // console.log('u2')
        this.moveByToward(dt)
    },
});
