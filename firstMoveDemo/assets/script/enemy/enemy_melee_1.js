// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
// import {JinZhanEnemy} from "../myClass/JinZhanClass";

// cc.Class({
//     extends: cc.JinZhanEnemy,
// })
// import Parent from './JinZhanParent'

import normalUnitAcion from '../unit/normalUnitAcion'


cc.Class({
    extends: normalUnitAcion,
    ctor: function () {
        console.log('JinZhan Enemy')
        this.actionArr = [this.checkAttack.bind(this), this.checkRange.bind(this), this.missThePlayer.bind(this), this.waitAndPatrol.bind(this)]
    },

    properties: {
        targetArr: {
            get: function () {
                if (window?.global?.player?.getComponent('Player')) {
                    return [window.global.player.getComponent('Player'),  ...window?.global?.alliesRoot?.children?.map((node) => {
                        return node.getComponent('A_JinZhan')
                    })]
                } else {
                    return []
                }
            },
        }
    },
});
