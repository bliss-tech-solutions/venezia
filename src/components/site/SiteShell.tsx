"use client";

import { Preloader } from "../Preloader";
import { Header } from "../Header";
import { Footer } from "../sections/Footer";
import { ExplorerProvider } from "../explorer/ExplorerContext";
import { FloorView } from "../explorer/FloorView";
import { ResidenceView } from "../explorer/ResidenceView";
import { PanoViewer } from "../explorer/PanoViewer";
import { Lightbox } from "../explorer/Lightbox";
import { SmoothScroll } from "./SmoothScroll";
import { PageTransitionProvider } from "./PageTransition";
import { Cursor, ScrollProgress } from "./Cursor";

/**
 * Everything that persists across pages: smooth scroll, page curtain,
 * header/footer, and the residence explorer overlays (so a floor, 3D flat
 * or 360° room can be opened from any page).
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <PageTransitionProvider>
        <ExplorerProvider>
          <Preloader />
          <ScrollProgress />
          <Header />
          {children}
          <Footer />
          <FloorView />
          <ResidenceView />
          <PanoViewer />
          <Lightbox />
          <Cursor />
        </ExplorerProvider>
      </PageTransitionProvider>
    </SmoothScroll>
  );
}
