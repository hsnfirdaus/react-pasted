import React , {
  lazy,
  Suspense
} from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Header from '@components/Header';
import Loading from '@components/Loading';

const Home=lazy(()=>import('./Home'));
const View=lazy(()=>import('./View'));

export default function Router(){
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading load={true}/>}>
        <Header />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/:id" element={<View/>}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
    )
}