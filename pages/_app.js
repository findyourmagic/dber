import '@arco-design/web-react/dist/css/arco.css';
import '../styles/globals.sass';
import GraphContainer from '../hooks/use-graph-state';

function MyApp({ Component, pageProps }) {
    return (
        <GraphContainer.Provider>
            <Component {...pageProps} />
        </GraphContainer.Provider>
    );
}

export default MyApp;
