
import unit from './unit.js'

/*
building 的特点就是，可以被建造。
他有建造的功能 因此通过 current 和 total 来控制建筑的建造时间

可以看看，能否让 progress，同时处理建筑物进度、英雄施法读条、建筑物生产部队读条，多种形式。
 */
cc.Class({
    extends: cc.Component,

    properties: {
        currentProcess: 0,
        totalProcess: 0,
    },

    addOnFinish(fn) {
        if (this.onFinishArr) {
            this.onFinishArr.push(fn)
        } else {
            this.onFinishArr = [fn]
        }
    },

    // 建造完成的回调
    checkFinish () {
        if (this.currentProcess > this.totalProcess) {
            this.status = 'finish'
            this.onFinishArr?.map?.(fn => fn())
        }
    },

    onLoad () {
        // 获得 progress 组件
        this.progressScript = this.node.getChildByName('progress')?.getComponent(cc.ProgressBar)

    },

    start () {
        this.getComponent("unit").hp = this.currentProcess * this.getComponent("unit").maxHp / this.totalProcess
    },

    update (dt) {
        // console.log(this.getComponent("unit").hp)
        if (this.progressScript) {

        }
        if (this.status !== 'finish') {
            // 建造进度++
            this.currentProcess += dt
            // 我替组件赋值 因为是 building 在计算累加
            this.progressScript.progress = this.currentProcess / this.totalProcess
            // hp ++
            this.getComponent("unit").hp += dt * this.getComponent("unit").maxHp / this.totalProcess
            this.checkFinish()
        }
    },
});
