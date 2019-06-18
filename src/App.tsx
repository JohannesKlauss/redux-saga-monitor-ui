import React from 'react';
import './App.css';
import Graph from "./components/Graph";
import {createSagaMonitor, SagaMonitorView} from "redux-saga-monitor";
import {applyMiddleware, createStore} from "redux";
import rootSaga from "./lab/counter/store/sagas";
import reducer from "./lab/counter/store/reducers";
import Counter from "./lab/counter/components/Counter";
import {Provider} from "react-redux";
import createSagaMiddleware from 'redux-saga';

const monitor = createSagaMonitor();
const sagaMiddleware = createSagaMiddleware({sagaMonitor: monitor});

const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

const App: React.FC = () => {
  return (
    <div className="app">
      <Provider store={store}>
        <div style={{margin: 10}}>
          <Counter/>
        </div>
      </Provider>
      <SagaMonitorView monitor={monitor}>
        <Graph/>
      </SagaMonitorView>
    </div>
  );
};

export default App;
