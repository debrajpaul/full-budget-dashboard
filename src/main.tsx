import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './app/App';
import { ApolloProvider } from '@apollo/client';
import { client } from './lib/apollo';
import { TenantProvider } from './state/tenant';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <TenantProvider>
          <App />
        </TenantProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
