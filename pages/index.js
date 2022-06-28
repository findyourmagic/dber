import Head from 'next/head';
import {
    Button,
    Card,
    PageHeader,
    Space,
    Typography,
} from '@arco-design/web-react';

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
                                Get started
                            </Button>
                            <Button type="primary">Github</Button>
                        </Space>
                    }
                />
                <Typography.Title className="tc">
                    <p>Simply easy</p>
                    <strong>Data modeling & Database designing</strong>
                    <p>Open source tool for free.</p>
                </Typography.Title>
            </div>
        </>
    );
}
