import { useEffect } from 'react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import * as Sentry from "@sentry/react";
import SocketManager from './features/dashboard/SocketManager';

import Home from "./features/dashboard/Home";
import Dsa from './features/learning-tracks/algorithms/Dsa';
import DtopicPage from './features/learning-tracks/algorithms/dtopic';
import DpractisePage from './features/learning-tracks/algorithms/dpractise';

import Revision from './features/learning-tracks/revision/concept';
import College from './features/learning-tracks/college/Top';

import NotesSubjectsPage from './features/notes/Notessubjectspage';
import NotesChaptersPage from './features/notes/Noteschapterspage';
import NotesChapterDetail from './features/notes/Noteschapterdetail';

import Web from './features/learning-tracks/web-development/Web';
import WtopicPage from './features/learning-tracks/web-development/wtopic';
import WpractisePage from './features/learning-tracks/web-development/wpractise';

import Data from './features/learning-tracks/data-analysis/data';
import AtopicPage from './features/learning-tracks/data-analysis/atopic';
import ApractisePage from './features/learning-tracks/data-analysis/apractise';

import Prac from './features/learning-tracks/aptitude/Prac';
import PtopicPage from './features/learning-tracks/aptitude/ptopic';
import PpractisePage from './features/learning-tracks/aptitude/ppractise';

import Authentication from './features/auth/authentication';
import MentorshipPage from './features/batches/mentorship';

import Classpage from './features/batches/Classpage';
import Subjectpage from './features/batches/Subjectpage';
import ChapterDetail from './features/batches/Chapterd';
import Explore from './features/batches/Explore';
import ChatBot from './features/pochi/chatbot';

import TestSeries from './features/batches/TestSeries';
import PYQSeries from './features/batches/PYQSeries';
import TestAttemptPage from "./features/batches/testattempt";

import PrivateRoute from './shared/guards/PrivateRoute';
import AdminRoute   from './shared/guards/AdminRoute';
import CommerceAuditDashboard from './features/commerce/CommerceAuditDashboard';
import ProjectEnquiry from './features/client-agent/ProjectEnquiry';
import ProjectPayment from './features/client-agent/ProjectPayment';
import PurchaseProtectedRoute from './shared/guards/PurchaseProtectedRoute';
import DiscountRecoveryModal from './features/revenue-recovery/DiscountRecoveryModal';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 0.2,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
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

              <Route path="/explore/:classId/:subject/:slug"         element={<ChapterDetail />} />
              <Route path="/class/:classId/explore"                  element={<Explore />} />
              <Route path="/revision/class/:classId/explore"         element={<Explore />} />
              <Route path="/college/class/:classId/explore"          element={<Explore />} />

              <Route path="/attempt-test"                            element={<TestAttemptPage />} />

              <Route element={<PurchaseProtectedRoute paramName="batchSlug" />}>
                <Route path="/notes/:batchSlug" element={<NotesSubjectsPage />} />
                <Route path="/notes/:batchSlug/:subjectSlug" element={<NotesChaptersPage />} />
                <Route path="/notes/:batchSlug/:subjectSlug/:chapterSlug" element={<NotesChapterDetail />} />
              </Route>
            </Route>
          </Routes>

          <DiscountRecoveryModal />
          <ChatBot />
          <SocketManager />
        </>
    </BrowserRouter>
  </GoogleOAuthProvider>
  </Sentry.ErrorBoundary>
  </React.StrictMode>
);