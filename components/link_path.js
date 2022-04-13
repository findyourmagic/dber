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

const relationDict = {
    1: '1',
    '*': 'N',
};

export default function LinkPath(props) {
    // {
    //     id: "link1",
    //     name: null,
    //     endpoints: [
    //         {
    //             id: "table1",
    //             tableName: "sales",
    //             fieldNames: ["id"],
    //             fieldId: "field1",
    //             relation: "1",
    //         },
    //         {
    //             id: "table2",
    //             tableName: "store",
    //             fieldNames: ["id"],
    //             relation: "*",
    //             fieldId: "field3",
    //         },
    //     ],
    // }

    console.log('render LinkPath');

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

    const sourceFieldPosition = [
        sourceTable.x,
        sourceTable.y + sourceFieldIndex * 30 + 50 + gripRadius,
    ];

    const targetFieldPosition = [
        targetTable.x,
        targetTable.y + targetFieldIndex * 30 + 50 + gripRadius,
    ];

    const [source, target] = [sourceFieldPosition, targetFieldPosition];

    // const [source, target] = [sourceFieldPosition, targetFieldPosition].sort(
    //     (a, b) => {
    //         return a[0] - b[0] || a[1] - b[1];
    //     }
    // );

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
    ].forEach(items => {
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
            <path
                d={`M ${x} ${y}
    C ${x + control} ${y} ${midX} ${midY} ${midX} ${midY}
    C ${midX} ${midY} ${x1 - control} ${y1} ${x1} ${y1}`}
                stroke="black"
                strokeWidth="2"
                fill="none"
            />
            <foreignObject
                x={(x + midX) / 2 - 15}
                y={(y + midY) / 2 - 15}
                width={30}
                height={30}
                onMouseDown={() => {
                    setEditingLink(link.id);
                }}
            >
                <div
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    className="path-label"
                >
                    {relationDict[endpoints[0].relation]}
                </div>
            </foreignObject>
            <foreignObject
                x={(x1 + midX) / 2 - 15}
                y={(y1 + midY) / 2 - 15}
                width={30}
                height={30}
                onMouseDown={() => {
                    setEditingLink(link.id);
                }}
            >
                <div
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    className="path-label"
                >
                    {relationDict[endpoints[1].relation]}
                </div>
            </foreignObject>
        </>
    );
}
