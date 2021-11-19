
import JinZhanClass from '../../myClass/JinZhanClass'


cc.Class({
    extends: JinZhanClass,
    ctor: function () {
        console.log('JinZhan A')
        // this.actionArr = [this.checkDead.bind(this), this.checkAttack.bind(this), this.checkRange.bind(this)]
        this.actionArr = [this.checkDead.bind(this), this.checkAttack.bind(this), this.checkRange.bind(this), this.checkFollowPlayer.bind(this)]
    },

    properties: {
        targetArr: {
            get: function () {
                return window?.global?.enemyRoot?.children?.map((node) => {
                    console.log('map A_JinZhan targetArr')
                    return node.getComponent('JinZhan')
                }) || []
            },

        }
    }
});
