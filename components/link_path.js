const control = 20;
const padding = 5;
const gripWidth = 10;
const gripRadius = gripWidth / 2;
const margin = 3;

/**
 * It takes a link object and returns a path element that connects the two tables
 * @param props - The props object that is passed to the component.
 * {
 *      link,
 *      tableDict,
 *      linkDict,
 *      TableWidth,
 *      setEditingLink,
 *  }
 * @returns A svg path is being returned.
 */
export default function LinkPath(props) {
    const {
        link,
        tableDict,
        linkDict,
        TableWidth: width,
        setEditingLink,
        editable,
    } = props;
    if (!tableDict) return null;

    const { endpoints } = link;
    const [sourceTable, targetTable] = [
        tableDict[endpoints[0].id],
        tableDict[endpoints[1].id],
    ];

    const [sourceFieldIndex, targetFieldIndex] = [
        sourceTable.fields.findIndex(field => field.id === endpoints[0].fieldId),
        targetTable.fields.findIndex(field => field.id === endpoints[1].fieldId),
    ];

    const sourceFieldPosition = {
        x: sourceTable.x,
        y: sourceTable.y + sourceFieldIndex * 32 + 50 + gripRadius + 24,
        ...endpoints[0],
    };

    const targetFieldPosition = {
        x: targetTable.x,
        y: targetTable.y + targetFieldIndex * 32 + 50 + gripRadius + 24,
        ...endpoints[1],
    };

    // const [source, target] = [sourceFieldPosition, targetFieldPosition];

    const [source, target] = [sourceFieldPosition, targetFieldPosition].sort(
        (a, b) => {
            return a.x - b.x || a.y - b.y;
        }
    );

    const sourceLeft = source.x + padding + gripRadius + margin;

    const sourceRight = source.x + width - padding - gripRadius - margin;

    let x = sourceLeft;

    const y = source.y + gripRadius + margin;

    const targetLeft = target.x + padding + gripRadius + margin;

    const targetRight = target.x + width - padding - gripRadius - margin;

    let minDistance = Math.abs(sourceLeft - targetLeft);

    let x1 = targetLeft;

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

    const y1 = target.y + gripRadius + margin;
    const midX = x1 - (x1 - x) / 2;
    const midY = y1 - (y1 - y) / 2;

    const handlerContextMenu = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <>
            <path
                d={`M ${x} ${y}
    C ${x + control} ${y} ${midX} ${midY} ${midX} ${midY}
    C ${midX} ${midY} ${x1 - control} ${y1} ${x1} ${y1}`}
                stroke="black"
                strokeWidth="1"
                fill="none"
                className="path-line"
            />
            <foreignObject
                x={(x + control + midX) / 2 - 10}
                y={(y + midY) / 2 - 10}
                width={20}
                height={20}
                onMouseDown={() => {
                    if (!editable) return;
                    setEditingLink({
                        linkId: link.id,
                        fieldId: source.fieldId,
                    });
                }}
                onContextMenu={handlerContextMenu}
            >
                <div
                    style={{ cursor: editable ? 'pointer' : 'default', userSelect: 'none' }}
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
                    if (!editable) return;
                    setEditingLink({
                        linkId: link.id,
                        fieldId: target.fieldId,
                    });
                }}
                onContextMenu={handlerContextMenu}
            >
                <div
                    style={{ cursor: editable ? 'pointer' : 'default', userSelect: 'none' }}
                    className="path-label"
                >
                    {target.relation}
                </div>
            </foreignObject>
        </>
    );
}
