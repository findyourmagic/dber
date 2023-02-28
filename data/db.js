import { dbAdaptor } from './settings';

const dbc = {
    indexed: require('./adaptor/indexed'),
}[dbAdaptor];

export const getAllGraphs = async () => await dbc.getAllGraphs();

export const getGraph = async id => await dbc.getGraph(id);

export const saveGraph = async args => await dbc.saveGraph(args);

export const delGraph = async id => await dbc.delGraph(id);

export const addGraph = async (graph = {}, id = null) => await dbc.addGraph(graph, id);

export const getLogs = async id => await dbc.getLogs(id);

export const delLogs = async id => await dbc.delLogs(id);
