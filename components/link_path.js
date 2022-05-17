// 控制点距离
const control = 20;
// 控制点内边距
const padding = 5;
// 控制点直径
const gripWidth = 10;
// 控制点半径
const gripRadius = gripWidth / 2;
// 控制点外边距
const margin = 3;

export default function LinkPath(props) {
    const {
        link,
        tableDict,
        linkDict,
        TableWidth: width,
        setEditingLink,
    } = props;
    if (!tableDict) return null;

    const { endpoints } = link;
    const [sourceTable, targetTable] = [
        tableDict[endpoints[0].id],
        tableDict[endpoints[1].id],
    ];

    const [sourceFieldIndex, targetFieldIndex] = [
        sourceTable.fields.findIndex(field => field.id == endpoints[0].fieldId),
        targetTable.fields.findIndex(field => field.id == endpoints[1].fieldId),
    ];

    const sourceFieldPosition = {
        x: sourceTable.x,
        y: sourceTable.y + sourceFieldIndex * 30 + 50 + gripRadius,
        ...endpoints[0],
    };

    const targetFieldPosition = {
        x: targetTable.x,
        y: targetTable.y + targetFieldIndex * 30 + 50 + gripRadius,
        ...endpoints[1],
    };

    // const [source, target] = [sourceFieldPosition, targetFieldPosition];

    const [source, target] = [sourceFieldPosition, targetFieldPosition].sort(
        (a, b) => {
            return a.x - b.x || a.y - b.y;
        }
    );

    // 路径绘制
    const sourceLeft = source.x + padding + gripRadius + margin;

    // 来源左侧位置坐标
    const sourceRight = source.x + width - padding - gripRadius - margin;
    // 来源右侧位置坐标

    let x = sourceLeft;
    // 定义起点 x

    const y = source.y + gripRadius + margin;
    // 来源 y 轴中点

    const targetLeft = target.x + padding + gripRadius + margin;
    // 目标左侧点

    const targetRight = target.x + width - padding - gripRadius - margin;
    // 目标右侧点

    let minDistance = Math.abs(sourceLeft - targetLeft);
    // 预设最小距离

    let x1 = targetLeft;
    // 定义终点 x

    [
        [sourceLeft, targetRight],
        [sourceRight, targetLeft],
        [sourceRight, targetRight],
    ].forEach(items => {
        if (Math.abs(items[0] - items[1]) < minDistance) {
            minDistance = Math.min(items[0] - items[1]);
            x = items[0];
            x1 = items[1];
        }
    });
    // 计算距离最短的 x 轴坐标对

    const y1 = target.y + gripRadius + margin;
    // 终点 y 轴中点

    // const midX = x1 - (x1 - x) / 2;
    const midX = x1 - (x1 - x) / 2;
    // 路径X轴中点

    const midY = y1 - (y1 - y) / 2;
    // 路径Y轴中点
    return (
        <>
            <path
                d={`M ${x} ${y}
    C ${x + control} ${y} ${midX} ${midY} ${midX} ${midY}
    C ${midX} ${midY} ${x1 - control} ${y1} ${x1} ${y1}`}
                stroke="black"
                strokeWidth="2"
                fill="none"
            />
            <foreignObject
                x={(x + control + midX) / 2 - 10}
                y={(y + midY) / 2 - 10}
                width={20}
                height={20}
                onMouseDown={() => {
                    setEditingLink({
                        linkId: link.id,
                        fieldId: source.fieldId,
                    });
                }}
            >
                <div
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    className="path-label"
                >
                    {source.relation}
                </div>
            </foreignObject>
            <foreignObject
                x={(x1 - control + midX) / 2 - 10}
                y={(y1 + midY) / 2 - 10}
                width={20}
                height={20}
                onMouseDown={() => {
                    setEditingLink({
                        linkId: link.id,
                        fieldId: target.fieldId,
                    });
                }}
            >
                <div
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    className="path-label"
                >
                    {target.relation}
                </div>
            </foreignObject>
        </>
    );
}
