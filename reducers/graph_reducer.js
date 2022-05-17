const separate = (data, key, value) => {
    const target = data.find((item) => item[key] == value);
    const others = data.filter((item) => item[key] != value);
    return [target, others];
};

export default function reducer(state, action) {
    switch (action.type) {
        // payload: node
        case "setAttribute": {
            return {
                ...state,
                ...action.payload,
            };
        }
        case "createNode": {
            return {
                ...state,
                nodes: [...state.nodes, action.payload],
            };
        }
        case "deleteNode": {
            // payload: {id}
            return {
                ...state,
                nodes: state.nodes.filter(
                    (node) => node.id != action.payload.id
                ),
            };
        }
        case "updateNode": {
            // payload: node
            const [node, nodes] = separate(
                state.nodes,
                "id",
                action.payload.id
            );
            return {
                ...state,
                nodes: [...nodes, { ...node, ...action.payload }],
            };
        }
        // case "createField": {
        //     // payload: {id, field}
        //     const [node, nodes] = separate(
        //         state.nodes,
        //         "id",
        //         action.payload.id
        //     );

        //     node.fields = [...node.fields, action.payload.field];

        //     return {
        //         ...state,
        //         nodes: [...nodes, node],
        //     };
        // }
        // case "deleteField": {
        //     // payload: {id, field: {name}}
        //     const [node, nodes] = separate(
        //         state.nodes,
        //         "id",
        //         action.payload.id
        //     );

        //     node.fields = node.fields.filter(
        //         (item) => item.id != action.payload.field.id
        //     );

        //     return {
        //         ...state,
        //         nodes: [...nodes, node],
        //     };
        // }
        // case "updateField": {
        //     // payload: {id, field: {name}}
        //     const [node, nodes] = separate(
        //         state.nodes,
        //         "id",
        //         action.payload.id
        //     );

        //     const [field, fields] = separate(
        //         node.fields,
        //         "id",
        //         action.payload.field.id
        //     );
        //     node.fields = [...fields, { ...field }];
        //     return {
        //         ...state,
        //         nodes: [...nodes, node],
        //     };
        // }
        case "createEdge": {
            return {
                ...state,
                edges: [...state.edges, action.payload],
            };
        }
        case "deleteEdge": {
            // payload: {id}
            return {
                ...state,
                edges: state.edges.filter(
                    (edge) => edge.id != action.payload.id
                ),
            };
        }
        case "updateEdge": {
            // payload: node
            const [edge, edges] = separate(
                state.edges,
                "id",
                action.payload.id
            );
            return {
                ...state,
                edges: [...edges, { ...edge, ...action.payload }],
            };
        }

        default:
            throw new Error();
    }
}
