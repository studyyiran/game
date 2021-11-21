export function realDistanceDiffMin (ccNode) {
    // 实际距离
    const distance = this.node.position.sub(ccNode.getPosition()).mag();
    // 最小距离
    const minDis = (ccNode.width + this.node.width) / 2
    const safe = 0
    return distance - minDis - safe
}


export function moveTowardTarget (target, stepDistance) {
    if (!stepDistance) {
        console.error('moveTowardTarget no speed')
        return null
    }
    if (!target) {
        return null
    }
    const diffX = this.node.x - target.x
    const diffY = this.node.y - target.y
    let dir = cc.v2(diffX, diffY)
    let angle2 = dir.signAngle(cc.v2(0,1))
    let olj = angle2 * 180 / Math.PI ;
    // this.node.rotation = olj;
    // 替换为物理运算，我们只输入速度，而不用管时间。
    let lv = this.node.getComponent(cc.RigidBody).linearVelocity
    lv.x = -Math.sin(angle2) * stepDistance;
    lv.y = -Math.cos(angle2) * stepDistance;
    this.node.getComponent(cc.RigidBody).linearVelocity = lv

    // this.node.x -= Math.sin(angle2) * stepDistance;
    // this.node.y -= Math.cos(angle2) * stepDistance;
}

export function scriptAttackScript (myScriptIsThis, targetNode) {
    const damage = myScriptIsThis.getComponent('unit').meleeAttackDamage
    const targetUnit = targetNode.getComponent('unit')
    targetUnit.hp = targetUnit.hp - damage
}
