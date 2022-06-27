import Head from 'next/head';
import { Button, PageHeader, Space } from '@arco-design/web-react';

export default function Home() {
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
            <div className="index-container">
                <PageHeader
                    style={{ background: 'var(--color-bg-2)' }}
                    title="DBER"
                    subTitle="Database design tool based on entity relation diagram"
                    extra={
                        <Space>
                            <Button href="/graphs" type="primary">
                                Graphs
                            </Button>
                            <Button type="primary">Github</Button>
                        </Space>
                    }
                />
            </div>
        </>
    );
}
