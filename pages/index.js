import Head from 'next/head';
import { Button } from '@arco-design/web-react';
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
            <Button href="/graph">Graph</Button>
        </>
    );
}
