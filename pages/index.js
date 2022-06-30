import Head from 'next/head';
import {
    Button,
    Card,
    PageHeader,
    Space,
    Typography,
    Steps,
} from '@arco-design/web-react';

const Step = Steps.Step;

import IconGithub from '../public/images/github.svg';

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
                <style>{'body { overflow: auto !important; }'}</style>
            </Head>
            <div className="index-container">
                <PageHeader
                    style={{ background: 'var(--color-bg-2)' }}
                    title="DBER"
                    subTitle="Database design tool based on entity relation diagram"
                    extra={
                        <Space>
                            <Button href="/graphs" type="primary">
                                Get started free & no registration required.
                            </Button>
                            <Button
                                type="primary"
                                icon={<IconGithub className="arco-icon" />}
                                style={{ backgroundColor: '#333' }}
                            >
                                Github
                            </Button>
                        </Space>
                    }
                />
                <div className="index-bg">
                    <Typography.Title className="tc" type="secondary">
                        <p>Simply easy</p>
                        <p className="mark">
                            Database designing & Data modeling tool
                        </p>
                        <p>Open source and free.</p>
                    </Typography.Title>
                    <Button
                        href="/graphs"
                        type="primary"
                        size="large"
                        className="start-button"
                        style={{
                            fontSize: '2em',
                            height: 'auto',
                        }}
                        shape="round"
                    >
                        Get started
                    </Button>
                </div>
                <Steps
                    labelPlacement="vertical"
                    current={5}
                    style={{
                        maxWidth: '1200px',
                        margin: '100px auto',
                    }}
                >
                    <Step
                        title="Design data structures"
                        description="Visually"
                    />
                    <Step
                        title="Create relationships"
                        description="Drag and drop"
                    />
                    <Step
                        title="Export SQL scripts"
                        description="It's that simple"
                    />
                </Steps>
                <div className="index-video-container">
                    <div className="faq">
                        <h2>FAQ</h2>
                        <dl>
                            <dt>How to register?</dt>
                            <dd>
                                No registration required, just start playing.
                            </dd>
                        </dl>
                        <dl>
                            <dt>How is the data saved?</dt>
                            <dd>
                                Saved in local storage and indexDB, so it's best
                                to make a backup before cleaning the browser.
                            </dd>
                        </dl>
                        <dl>
                            <dt>
                                Is it possible to collaborate across devices?
                            </dt>
                            <dd>Not for the time being.</dd>
                        </dl>
                    </div>
                    <video src="/detail.mp4" muted autoPlay loop></video>
                </div>
            </div>
        </>
    );
}
