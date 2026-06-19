import { useEffect } from 'react';  // ← add useEffect here
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

import Home from "./components/Home";
import Dsa from './components/Algorithms/Dsa';
import DtopicPage from './components/Algorithms/dtopic'; // Practice Page Component
import DpractisePage from './components/Algorithms/dpractise';


import Revision from './components/Revision/concept'; // Revision Page Component
import College from './components/College/Top'; // College Page Component




import Web from './components/Developments/Web';
import WtopicPage from './components/Developments/wtopic'; // Practice Page Component
import WpractisePage from './components/Developments/wpractise';



import Data from './components/Analyses/data';
import AtopicPage from './components/Analyses/atopic'; // Practice Page Component
import ApractisePage from './components/Analyses/apractise';



import Prac from './components/Aptitude/Prac';
import PtopicPage from './components/Aptitude/ptopic'; // Practice Page Component
import PpractisePage from './components/Aptitude/ppractise';


import Authentication from './components/authentication';
import MentorshipPage from './components/Batches/mentorship'; // adjust the path as needed




import Classpage from './components/Batches/Classpage';
// import PremiumClassPage from './components/PremiumClassPage';
import Subjectpage from './components/Batches/Subjectpage';
import ChapterDetail from './components/Batches/Chapterd'; // Chapter Detail Page
import Explore from './components/Batches/Explore';
import ChatBot from './components/chatbot';

// ➕ New Components for Test Series and PYQ
import TestSeries from './components/Batches/TestSeries';
import PYQSeries from './components/Batches/PYQSeries';
import TestAttemptPage from "./components/Batches/testattempt";



import PrivateRoute from './components/PrivateRoute';
import AdminRoute   from './components/AdminRoute';


const PingServer = () => {
  useEffect(() => {
    const ping = () => {
      fetch("https://storee-6wri.onrender.com/")
        .catch(() => {}); // silent fail, we don't care about errors
    };
    ping();
    const interval = setInterval(ping, 10 * 60 * 1000); // every 10 mins
    return () => clearInterval(interval);
  }, []);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="738xxxxxxxxxxxx-abcdef.apps.googleusercontent.329565102343-1fom4l27tdc9shurgtokgrv2kej6eaje.apps.googleusercontent.com">
    <BrowserRouter>
        <>
        <Routes>
            {/* ── PUBLIC ── */}
            <Route path="/" element={<Authentication />} />

            {/* ── ADMIN ONLY ── */}
            <Route element={<AdminRoute />}>
              <Route path="/admin-dashboard" element={<Home />} />
            </Route>

            {/* ── ALL LOGGED-IN USERS ── */}
            <Route element={<PrivateRoute />}>
              <Route path="*" element={<Home />} />

              <Route path="/dsa"                                     element={<Dsa />} />
              <Route path="/dtopic"                                  element={<DtopicPage />} />
              <Route path="/dpractice/:topicId"                      element={<DpractisePage />} />

              <Route path="/web"                                     element={<Web />} />
              <Route path="/wtopic"                                  element={<WtopicPage />} />
              <Route path="/wpractice/:topicId"                      element={<WpractisePage />} />

              <Route path="/data-analysis"                           element={<Data />} />
              <Route path="/atopic"                                  element={<AtopicPage />} />
              <Route path="/apractice/:topicId"                      element={<ApractisePage />} />

              <Route path="/aptitude"                                element={<Prac />} />
              <Route path="/ptopic"                                  element={<PtopicPage />} />
              <Route path="/ppractice/:topicId"                      element={<PpractisePage />} />

              <Route path="/revision/:classId/:subject/:chapterSlug" element={<Revision />} />
              <Route path="/college/:classId/:subject/:chapterSlug"  element={<College />} />

              <Route path="/class/:classId/:subject/:slug"           element={<ChapterDetail />} />
              <Route path="/explore/:classId/:subject/:slug"         element={<ChapterDetail />} />
              <Route path="/premium/class/:classId/:subject/:slug"   element={<ChapterDetail />} />

              <Route path="/class/:classId/:subject"                 element={<Subjectpage />} />
              <Route path="/premium/class/:classId/:subject"         element={<Subjectpage />} />
              <Route path="/revision/class/:classId/:subject"        element={<Subjectpage />} />
              <Route path="/college/class/:classId/:subject"         element={<Subjectpage />} />
              <Route path="/cds/class/:classId/:subject"             element={<Subjectpage />} />

              <Route path="/class/:classId"                          element={<Classpage />} />
              <Route path="/premium/class/:classId"                  element={<Classpage />} />
              <Route path="/revision/class/:classId"                 element={<Classpage />} />
              <Route path="/college/class/:classId"                  element={<Classpage />} />
              <Route path="/cds/class/:classId"                      element={<Classpage />} />

              <Route path="/class/:classId/explore"                  element={<Explore />} />
              <Route path="/premium/class/:classId/explore"          element={<Explore />} />
              <Route path="/revision/class/:classId/explore"         element={<Explore />} />
              <Route path="/college/class/:classId/explore"          element={<Explore />} />

              <Route path="/premium/class/:classId/test"             element={<TestSeries />} />
              <Route path="/attempt-test"                            element={<TestAttemptPage />} />
              <Route path="/premium/class/:classId/pyq"              element={<PYQSeries />} />
              <Route path="premium/class/:classId/mentorship"        element={<MentorshipPage />} />
            </Route>
          </Routes>


          {/* ChatBot on all pages */}
          <ChatBot />
          <PingServer />
        </>
    </BrowserRouter>
  </GoogleOAuthProvider>
  </React.StrictMode>
);
