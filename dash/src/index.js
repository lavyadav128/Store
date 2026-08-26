import { useEffect } from 'react';  // ← add useEffect here
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import * as Sentry from "@sentry/react"; // Error monitoring — catches crashes/errors in the browser
import SocketManager from './components/SocketManager';

import Home from "./components/Home";
import Dsa from './components/Algorithms/Dsa';
import DtopicPage from './components/Algorithms/dtopic'; // Practice Page Component
import DpractisePage from './components/Algorithms/dpractise';


import Revision from './components/Revision/concept'; // Revision Page Component
import College from './components/College/Top'; // College Page Component

import NotesSubjectsPage from './components/Notessubjectspage';
import NotesChaptersPage from './components/Noteschapterspage';
import NotesChapterDetail from './components/Noteschapterdetail';


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
import CommerceAuditDashboard from './components/CommerceAuditDashboard';
import ProjectEnquiry from './components/ProjectEnquiry';
import ProjectPayment from './components/ProjectPayment';
import PurchaseProtectedRoute from './components/PurchaseProtectedRoute';



// ── SENTRY (error monitoring) ──
// Initialized once, as early as possible. If REACT_APP_SENTRY_DSN isn't set
// (e.g. you haven't added it to dash/.env yet), Sentry just quietly does
// nothing — it never breaks the app for a missing key.
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 0.2, // capture performance data for 20% of sessions (keeps free-tier usage low)
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Sentry.ErrorBoundary: if any component below crashes while rendering,
        this catches it, sends the error+stack trace to Sentry, and shows a
        simple fallback message instead of a blank white screen for the user */}
    <Sentry.ErrorBoundary fallback={<p style={{ textAlign: 'center', marginTop: '3rem' }}>Something went wrong. Please refresh the page.</p>}>
    <GoogleOAuthProvider clientId="631382593567-6vvhqv3hhts3m1s9ggp52gm78psuueq6.apps.googleusercontent.com">
    <BrowserRouter>
        <>
        <Routes>
            {/* ── PUBLIC ── */}
            <Route path="/" element={<Authentication />} />
            <Route path="/project-enquiry" element={<ProjectEnquiry />} />
            <Route path="/project-enquiry/:slug" element={<ProjectEnquiry />} />
            <Route path="/project-payment" element={<ProjectPayment />} />
            <Route path="/project-payment/:code" element={<ProjectPayment />} />

            {/* ── ADMIN ONLY ── */}
            <Route element={<AdminRoute />}>
              <Route path="/admin-dashboard" element={<Home />} />
              <Route path="/commerce-audit" element={<CommerceAuditDashboard />} />
            </Route>

            {/* ── ALL LOGGED-IN USERS ── */}
            <Route element={<PrivateRoute />}>
              <Route path="*" element={<Home />} />

              {/* ── STATIC-PATH BATCHES (dsa/web/data-analysis/aptitude) —
                  these don't carry a classId in the URL like /class/:classId
                  does. Instead, the admin sets a fixed "redirectPath" per
                  batch (see batches.model.js) — we pass that same path here
                  so the backend can look up which batch owns it. ── */}
              <Route element={<PurchaseProtectedRoute redirectPath="/dsa" />}>
                <Route path="/dsa"                element={<Dsa />} />
                <Route path="/dtopic"             element={<DtopicPage />} />
                <Route path="/dpractice/:topicId" element={<DpractisePage />} />
              </Route>

              <Route element={<PurchaseProtectedRoute redirectPath="/web" />}>
                <Route path="/web"                element={<Web />} />
                <Route path="/wtopic"             element={<WtopicPage />} />
                <Route path="/wpractice/:topicId" element={<WpractisePage />} />
              </Route>

              <Route element={<PurchaseProtectedRoute redirectPath="/data-analysis" />}>
                <Route path="/data-analysis"      element={<Data />} />
                <Route path="/atopic"             element={<AtopicPage />} />
                <Route path="/apractice/:topicId" element={<ApractisePage />} />
              </Route>

              <Route element={<PurchaseProtectedRoute redirectPath="/aptitude" />}>
                <Route path="/aptitude"           element={<Prac />} />
                <Route path="/ptopic"             element={<PtopicPage />} />
                <Route path="/ppractice/:topicId" element={<PpractisePage />} />
              </Route>

              {/* ── PAID / REGISTERED CONTENT (classId-based) — requires an
                  actual purchase or registration, checked live against the
                  backend via PurchaseProtectedRoute. Previously NONE of these
                  had any such check — only login was required. Note: /explore
                  routes are intentionally left OUTSIDE this guard, since
                  they're meant as free previews to entice a purchase. ── */}
              <Route element={<PurchaseProtectedRoute />}>
                <Route path="/revision/:classId/:subject/:chapterSlug" element={<Revision />} />
                <Route path="/college/:classId/:subject/:chapterSlug"  element={<College />} />

                <Route path="/class/:classId/:subject/:slug"           element={<ChapterDetail />} />

                <Route path="/class/:classId/:subject"                 element={<Subjectpage />} />
                <Route path="/revision/class/:classId/:subject"        element={<Subjectpage />} />
                <Route path="/college/class/:classId/:subject"         element={<Subjectpage />} />
                <Route path="/cds/class/:classId/:subject"             element={<Subjectpage />} />

                <Route path="/class/:classId"                          element={<Classpage />} />
                <Route path="/revision/class/:classId"                 element={<Classpage />} />
                <Route path="/college/class/:classId"                  element={<Classpage />} />
                <Route path="/cds/class/:classId"                      element={<Classpage />} />

                <Route path="/premium/class/:classId/:subject/:slug"   element={<ChapterDetail />} />
                <Route path="/premium/class/:classId/:subject"         element={<Subjectpage />} />
                <Route path="/premium/class/:classId"                  element={<Classpage />} />
                <Route path="/premium/class/:classId/explore"          element={<Explore />} />
                <Route path="/premium/class/:classId/test"             element={<TestSeries />} />
                <Route path="/premium/class/:classId/pyq"              element={<PYQSeries />} />
                <Route path="/premium/class/:classId/mentorship"       element={<MentorshipPage />} />
              </Route>

              {/* ── FREE PREVIEW ROUTES — intentionally NOT gated, so a
                  visitor can sample content before buying ── */}
              <Route path="/explore/:classId/:subject/:slug"         element={<ChapterDetail />} />
              <Route path="/class/:classId/explore"                  element={<Explore />} />
              <Route path="/revision/class/:classId/explore"         element={<Explore />} />
              <Route path="/college/class/:classId/explore"          element={<Explore />} />

              <Route path="/attempt-test"                            element={<TestAttemptPage />} />

              {/* ── NOTES (batchSlug-based) — same guard, different param name ── */}
              <Route element={<PurchaseProtectedRoute paramName="batchSlug" />}>
                <Route path="/notes/:batchSlug" element={<NotesSubjectsPage />} />
                <Route path="/notes/:batchSlug/:subjectSlug" element={<NotesChaptersPage />} />
                <Route path="/notes/:batchSlug/:subjectSlug/:chapterSlug" element={<NotesChapterDetail />} />
              </Route>
            </Route>
          </Routes>


          {/* ChatBot on all pages */}
          <ChatBot />
          <SocketManager />
        </>
    </BrowserRouter>
  </GoogleOAuthProvider>
  </Sentry.ErrorBoundary>
  </React.StrictMode>
);
