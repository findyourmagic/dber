import { Space, Button } from '@arco-design/web-react';
import Link from 'next/link';

export default function ListNav(props) {
    return (
        <div className="nav">
            <div>
                <Link href="/" passHref>
                    <span>
                        <strong>DBER</strong> | Database design tool based on
                        entity relation diagram
                    </span>
                </Link>
            </div>
            <Space>
                <Button type="primary" onClick={props.addGraph}>
                    + New graph
                </Button>
            </Space>
        </div>
    );
}
