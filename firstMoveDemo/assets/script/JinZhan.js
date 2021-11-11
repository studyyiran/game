// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
// import {JinZhanEnemy} from "../myClass/JinZhanClass";
// console.log(JinZhanEnemy)

// cc.Class({
//     extends: cc.JinZhanEnemy,
// })
// import Parent from './JinZhanParent'
import JinZhanEnemy from '../myClass/JinZhanClass'


cc.Class({
    extends: JinZhanEnemy,
    ctor: function () {
        console.log('JinZhan!!!')
    },

    onLoad: function () {
        this.targetArr = [window.global.player.getComponent('Player')]
    }
});
