/* @refresh reload */
import { Loading } from 'solid-js';
import { render } from '@solidjs/web';
import './index.css';
import { Router } from './router';
import FrameworkHeader from './components/shared/FrameworkHeader';

const root = document.getElementById('root');

render(
  () => (
    <>
      <FrameworkHeader />
      {/* Root layout: a Loading boundary (no fallback markup) for the lazy route chunks, like the
          React reference's <Suspense fallback={null}>; without it the root mount is deferred */}
      <Router>{(props) => <Loading>{props.children}</Loading>}</Router>
    </>
  ),
  root!
);
