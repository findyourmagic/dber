export default function SvgDefs() {
    return (
        <defs>
            <marker
                id="one-many"
                refX="10"
                refY="15"
                markerWidth="45"
                markerHeight="15"
                orient="auto"
            >
                <text x="1" y="11" fontSize="12">
                    1:N
                </text>
            </marker>
            <marker
                id="one-one"
                refX="10"
                refY="15"
                markerWidth="45"
                markerHeight="15"
                orient="auto"
            >
                <text x="1" y="11" fontSize="12">
                    1:1
                </text>
            </marker>
            <marker
                id="many-one"
                refX="10"
                refY="15"
                markerWidth="45"
                markerHeight="15"
                orient="auto"
            >
                <text x="1" y="11" fontSize="12">
                    N:1
                </text>
            </marker>
            <marker
                id="many-many"
                refX="10"
                refY="15"
                markerWidth="45"
                markerHeight="15"
                orient="auto"
            >
                <text x="1" y="11" fontSize="12">
                    N:N
                </text>
            </marker>
        </defs>
    );
}
