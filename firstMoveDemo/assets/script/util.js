export function realDistanceDiffMin(ccNode) {
    // 实际距离
    const distance = this.node.position.sub(ccNode.getPosition()).mag();
    // 最小距离
    const minDis = (ccNode.width + this.node.width) / 2
    return distance - minDis
}
