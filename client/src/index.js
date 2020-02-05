import React from 'react';
import { hydrate, render } from 'react-dom';
import Routes from './routes';
import Rollbar from 'rollbar';
import 'whatwg-fetch';
import './polyfills/all'

const rollbar = new Rollbar({
  accessToken: "924232ab6fb64a2980d8abbfc84c0ba5",
  captureUncaught: true,
  captureUnhandledRejections: true,
  // enabled: (process.env.NODE_ENV === 'production'),
  enabled: true,
  payload: {
      environment: process.env.NODE_ENV
  }
})

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js');
  whyDidYouRender(React);
}

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  render(
    <Routes />,
    rootElement
  );
  // hydrate(
  //   <Routes />,
  //   rootElement
  // );
} else {
  render(
    <Routes />,
    rootElement
  );
}

if (module.hot) {
  module.hot.accept('./routes', () => {
    const NextApp = require('./routes').default
    render(
      <NextApp />,
      rootElement
    )
  })
}
