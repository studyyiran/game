export function realDistanceDiffMin (ccNode) {
    // 实际距离
    const distance = this.node.position.sub(ccNode.getPosition()).mag();
    // 最小距离
    const minDis = (ccNode.width + this.node.width) / 2
    const safe = 0
    return distance - minDis - safe
}


export function moveTowardTarget (target, stepDistance) {
    const diffX = this.node.x - target.x
    const diffY = this.node.y - target.y
    let dir = cc.v2(diffX, diffY)
    let angle2 = dir.signAngle(cc.v2(0,1))
    let olj = angle2 * 180 / Math.PI ;
    this.node.rotation = olj;
    this.node.x -= Math.sin(angle2) * stepDistance;
    this.node.y -= Math.cos(angle2) * stepDistance;
}

export function makeAttach (a, b) {
    b.hp = b.hp - a.attack
    console.log(b.hp)
}
