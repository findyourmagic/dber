import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
    List,
    Button,
    Empty,
    Space,
    Avatar,
    Popconfirm,
    Notification,
} from '@arco-design/web-react';
import { IconEdit, IconDelete } from '@arco-design/web-react/icon';
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { db, saveGraph } from '../../data/db';
import ListNav from '../../components/list_nav';
import useGraphState from '../../hooks/use-graph-state';
import northwindTraders from '../../data/northwind_traders.json';
import blog from '../../data/blog.json';
import spaceX from '../../data/spacex.json';

const ImportModal = dynamic(() => import('../../components/import_modal'), { ssr: false });

/**
 * It adds a new graph to the database
 * @param [graph] - The graph object to be added.
 */
const addSample = async (graph = {}, id) => {
    const graphId = id || nanoid();
    const now = new Date().valueOf();
    await db.graphs.add({
        ...graph,
        id: graphId,
        box: {
            x: 0,
            y: 0,
            w: global.innerWidth,
            h: global.innerHeight,
            clientW: global.innerWidth,
            clientH: global.innerHeight,
        },
        createdAt: now,
        updatedAt: now,
    });
};

const addGraph = async () => {
    const id = nanoid();
    await addSample({ name: 'Untitled graph' }, id);
    global.location.href = `/graphs/detail?id=${id}`;
};

/**
 * It fetches all the graphs from the database and displays them in a list
 * @returns Home component
 */
export default function Home() {
    const { theme, setTheme } = useGraphState();
    const [graphs, setGraphs] = useState([]);
    const [importType, setImportType] = useState('');

    useEffect(() => {
        const initGraphs = async () => {
            let inited = false;
            try {
                inited = await db.meta.count();
                console.log(inited);
            } catch (e) {
                console.log(e);
            }

            if (!inited) {
                await db.meta.add({ inited: true });
                await Promise.all(
                    [northwindTraders, blog, spaceX].map(item =>
                        addSample(item)
                    )
                );
                Notification.success({
                    title: 'Sample data generated success.',
                });
            }

            try {
                const data = await db.graphs.toArray();
                if (data && data.length) {
                    data.sort((a, b) => b.createdAt - a.createdAt);
                    setGraphs(data);
                }
            } catch (e) {
                console.log(e);
            }
        };
        initGraphs();
    }, []);

    const deleteGraph = async id => {
        await db.graphs.delete(id);
        setGraphs(state => state.filter(item => item.id !== id));
    };

    const handlerImportTable = async ({ tableDict, linkDict }, name) => {
        const graphId = nanoid();
        await saveGraph({
            id: graphId,
            name,
            tableDict,
            linkDict,
            box: {
                x: 0,
                y: 0,
                w: window.innerWidth,
                h: window.innerHeight,
                clientH: window.innerHeight,
                clientW: window.innerWidth,
            },
        });
        window.location.href = `/graphs/detail?id=${graphId}`;
    };

    return (
        <>
            <Head>
                <title>DBER</title>
                <meta
                    name="description"
                    content="Database design tool based on entity relation diagram"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ListNav
                addGraph={addGraph}
                setImportType={setImportType}
                theme={theme}
                setTheme={setTheme}
            />
            <div className="graph-container">
                {graphs && graphs.length ? (
                    <List
                        className="graph-list"
                        size="large"
                        header="Graphs"
                        dataSource={graphs}
                        render={(item, index) => (
                            <List.Item
                                key={item.id}
                                extra={
                                    <Space>
                                        <Link href={`/graphs/detail?id=${item.id}`}>
                                            <Button type="primary" icon={<IconEdit />} />
                                        </Link>
                                        <Popconfirm
                                            title="Are you sure to delete this graph?"
                                            okText="Yes"
                                            cancelText="No"
                                            position="br"
                                            onOk={() => {
                                                deleteGraph(item.id);
                                            }}
                                        >
                                            <Button
                                                type="primary"
                                                status="danger"
                                                icon={<IconDelete />}
                                            />
                                        </Popconfirm>
                                    </Space>
                                }
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar shape="square">
                                            {item.name[0]}
                                        </Avatar>
                                    }
                                    title={item.name}
                                    description={new Date(
                                        item.updatedAt
                                    ).toLocaleString()}
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <div className="tc">
                        <Empty />
                        <Button
                            type="primary"
                            onClick={() => {
                                addGraph();
                            }}
                            size="large"
                        >
                            Create new graph now.
                        </Button>
                    </div>
                )}
            </div>
            <ImportModal
                importType={importType}
                setImportType={setImportType}
                theme={theme}
                handlerImportTable={handlerImportTable}
            />
        </>
    );
}
