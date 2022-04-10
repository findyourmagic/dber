export default function LinkPath(props) {
    const control = 20;
    const width = NodeWidth;
    const padding = 5;
    const gripWidth = 10;
    const gripRadius = gripWidth / 2;
    const margin = 3;
    const edge = props.edge;
    const [sourceNode, targetNode] = [
        graph.nodes.find((node) => node.id == edge.startNodeId),
        graph.nodes.find((node) => node.id == edge.endNodeId),
    ];

    const [sourceAttrIndex, targetAttrIndex] = [
        sourceNode.attrs.findIndex((attr) => attr.id == edge.startAttr),
        targetNode.attrs.findIndex((attr) => attr.id == edge.endAttr),
    ];

    const sourceAttrPosition = [
        sourceNode.x,
        sourceNode.y + sourceAttrIndex * 30 + 50 + gripRadius,
    ];

    const targetAttrPosition = [
        targetNode.x,
        targetNode.y + targetAttrIndex * 30 + 50 + gripRadius,
    ];

    const [source, target] = [sourceAttrPosition, targetAttrPosition].sort(
        (a, b) => {
            return a[0] - b[0] || a[1] - b[1];
        }
    );

    // 路径绘制
    const sourceLeft = source[0] + padding + gripRadius + margin;

    // 来源左侧位置坐标
    const sourceRight = source[0] + width - padding - gripRadius - margin;
    // 来源右侧位置坐标

    let x = sourceLeft;
    // 定义起点 x

    const y = source[1] + gripRadius + margin;
    // 来源 y 轴中点

    const targetLeft = target[0] + padding + gripRadius + margin;
    // 目标左侧点

    const targetRight = target[0] + width - padding - gripRadius - margin;
    // 目标右侧点

    let minDistance = Math.abs(sourceLeft - targetLeft);
    // 预设最小距离

    let x1 = targetLeft;
    // 定义终点 x

    [
        [sourceLeft, targetRight],
        [sourceRight, targetLeft],
        [sourceRight, targetRight],
    ].forEach((items) => {
        if (Math.abs(items[0] - items[1]) < minDistance) {
            minDistance = Math.min(items[0] - items[1]);
            x = items[0];
            x1 = items[1];
        }
    });
    // 计算距离最短的 x 轴坐标对

    const y1 = target[1] + gripRadius + margin;
    // 终点 y 轴中点

    // const midX = x1 - (x1 - x) / 2;
    const midX = x1 - (x1 - x) / 2;
    // 路径X轴中点

    const midY = y1 - (y1 - y) / 2;
    // 路径Y轴中点
    return (
        <>
            <foreignObject
                x={midX - 15}
                y={midY - 10}
                width={30}
                height={20}
                onMouseDown={(e) => console.log(e)}
            >
                <div style={{ cursor: "pointer", userSelect: "none" }}>123</div>
            </foreignObject>
            <path
                d={`M ${x} ${y}
    C ${x + control} ${y} ${midX} ${midY} ${midX} ${midY}
    C ${midX} ${midY} ${x1 - control} ${y1} ${x1} ${y1}`}
                stroke="black"
                strokeWidth="2"
                fill="none"
                markerMid="url(#many-one)"
            />
        </>
    );
}
