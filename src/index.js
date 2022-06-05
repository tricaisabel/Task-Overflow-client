import React from 'react';
import ReactDOM from 'react-dom';
import Auth from './components/Auth';
import Overview from './components/Overview';
import {Provider} from 'react-redux';
import store,{persistor} from './state/store';
import {PersistGate} from 'redux-persist/integration/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Project from './components/Project';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Auth/>} />
          <Route exact path="/overview" element={<Overview/>} />
          <Route exact path="/project/:id" element={<Project/>} />
        </Routes>  
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

