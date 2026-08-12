import type { ImageMetadata } from "astro";

import bronzArtist from "../assets/projects/bronz/artist.png";
import bronzLive from "../assets/projects/bronz/live.png";
import bronzRelease from "../assets/projects/bronz/release.png";
import bronzVideo from "../assets/projects/bronz/video.png";
import aboutPerformance from "../assets/projects/joe2shine/about-performance.webp";
import crowd from "../assets/projects/joe2shine/crowd.webp";
import energyBooth from "../assets/projects/joe2shine/energy-booth.webp";
import livePerformance from "../assets/projects/joe2shine/live-performance.webp";
import joe2ShineLogo from "../assets/projects/joe2shine/logo.png";
import pohgoAbout from "../assets/projects/pohgo/about.png";
import pohgoDelivery from "../assets/projects/pohgo/delivery.png";
import pohgoHighlight from "../assets/projects/pohgo/highlight.png";
import pohgoMenu from "../assets/projects/pohgo/menu.png";
import type { ui } from "../i18n/ui";
import type { PortfolioProject } from "./projects";

export type CaseStudyTranslationKey = keyof typeof ui.en;
export type CaseStudyVisualLayout = "portrait" | "landscape" | "wide" | "closing";

export interface CaseStudyFactGroup {
  labelKey: CaseStudyTranslationKey;
  itemKeys: CaseStudyTranslationKey[];
}

export interface CaseStudyGalleryItem {
  image: ImageMetadata;
  altKey: CaseStudyTranslationKey;
  captionKey?: CaseStudyTranslationKey;
  layout: CaseStudyVisualLayout;
  delay?: number;
}

export interface CaseStudyDefinition {
  slug: string;
  projectId: PortfolioProject["id"];
  leadKey: CaseStudyTranslationKey;
  logo?: ImageMetadata;
  coverImage?: ImageMetadata;
  overview: {
    titleKey: CaseStudyTranslationKey;
    paragraphKeys: CaseStudyTranslationKey[];
    facts: CaseStudyFactGroup[];
  };
  gallery?: {
    titleKey: CaseStudyTranslationKey;
    introKey: CaseStudyTranslationKey;
    items: CaseStudyGalleryItem[];
  };
}

// To publish another case study, add its assets and one definition here.
// The localized route and project-list detail link are generated automatically.
export const caseStudies: CaseStudyDefinition[] = [
  {
    slug: "joe2shine",
    projectId: "joe2shine",
    leadKey: "projects.joe2shine.caseStudy.lead",
    logo: joe2ShineLogo,
    overview: {
      titleKey: "projects.joe2shine.caseStudy.overviewTitle",
      paragraphKeys: [
        "projects.joe2shine.caseStudy.overview1",
        "projects.joe2shine.caseStudy.overview2",
      ],
      facts: [
        {
          labelKey: "caseStudy.work.label",
          itemKeys: [
            "projects.joe2shine.caseStudy.work1",
            "projects.joe2shine.caseStudy.work2",
            "projects.joe2shine.caseStudy.work3",
            "projects.joe2shine.caseStudy.work4",
            "projects.joe2shine.caseStudy.work5",
          ],
        },
        {
          labelKey: "caseStudy.technology.label",
          itemKeys: [
            "projects.joe2shine.caseStudy.tech1",
            "projects.joe2shine.caseStudy.tech2",
            "projects.joe2shine.caseStudy.tech3",
          ],
        },
      ],
    },
    gallery: {
      titleKey: "projects.joe2shine.caseStudy.galleryTitle",
      introKey: "projects.joe2shine.caseStudy.galleryIntro",
      items: [
        {
          image: livePerformance,
          altKey: "projects.joe2shine.caseStudy.gallery1",
          captionKey: "projects.joe2shine.caseStudy.gallery1",
          layout: "portrait",
        },
        {
          image: energyBooth,
          altKey: "projects.joe2shine.caseStudy.gallery2",
          captionKey: "projects.joe2shine.caseStudy.gallery2",
          layout: "landscape",
          delay: 100,
        },
        {
          image: crowd,
          altKey: "projects.joe2shine.caseStudy.gallery2",
          layout: "wide",
        },
        {
          image: aboutPerformance,
          altKey: "projects.joe2shine.caseStudy.gallery3",
          captionKey: "projects.joe2shine.caseStudy.gallery3",
          layout: "closing",
        },
      ],
    },
  },
  {
    slug: "bronz",
    projectId: "bronz",
    leadKey: "projects.bronz.caseStudy.lead",
    overview: {
      titleKey: "projects.bronz.caseStudy.overviewTitle",
      paragraphKeys: [
        "projects.bronz.caseStudy.overview1",
        "projects.bronz.caseStudy.overview2",
      ],
      facts: [
        {
          labelKey: "caseStudy.work.label",
          itemKeys: [
            "projects.bronz.caseStudy.work1",
            "projects.bronz.caseStudy.work2",
            "projects.bronz.caseStudy.work3",
            "projects.bronz.caseStudy.work4",
            "projects.bronz.caseStudy.work5",
          ],
        },
        {
          labelKey: "caseStudy.features.label",
          itemKeys: [
            "projects.bronz.caseStudy.feature1",
            "projects.bronz.caseStudy.feature2",
            "projects.bronz.caseStudy.feature3",
            "projects.bronz.caseStudy.feature4",
            "projects.bronz.caseStudy.feature5",
          ],
        },
      ],
    },
    gallery: {
      titleKey: "projects.bronz.caseStudy.galleryTitle",
      introKey: "projects.bronz.caseStudy.galleryIntro",
      items: [
        {
          image: bronzRelease,
          altKey: "projects.bronz.caseStudy.gallery1",
          captionKey: "projects.bronz.caseStudy.gallery1",
          layout: "portrait",
        },
        {
          image: bronzVideo,
          altKey: "projects.bronz.caseStudy.gallery2",
          captionKey: "projects.bronz.caseStudy.gallery2",
          layout: "landscape",
          delay: 100,
        },
        {
          image: bronzLive,
          altKey: "projects.bronz.caseStudy.gallery3",
          captionKey: "projects.bronz.caseStudy.gallery3",
          layout: "portrait",
        },
        {
          image: bronzArtist,
          altKey: "projects.bronz.caseStudy.gallery4",
          layout: "closing",
        },
      ],
    },
  },
  {
    slug: "pohgo",
    projectId: "pohgo",
    leadKey: "projects.pohgo.caseStudy.lead",
    overview: {
      titleKey: "projects.pohgo.caseStudy.overviewTitle",
      paragraphKeys: [
        "projects.pohgo.caseStudy.overview1",
        "projects.pohgo.caseStudy.overview2",
      ],
      facts: [
        {
          labelKey: "caseStudy.work.label",
          itemKeys: [
            "projects.pohgo.caseStudy.work1",
            "projects.pohgo.caseStudy.work2",
            "projects.pohgo.caseStudy.work3",
            "projects.pohgo.caseStudy.work4",
            "projects.pohgo.caseStudy.work5",
          ],
        },
        {
          labelKey: "caseStudy.features.label",
          itemKeys: [
            "projects.pohgo.caseStudy.feature1",
            "projects.pohgo.caseStudy.feature2",
            "projects.pohgo.caseStudy.feature3",
            "projects.pohgo.caseStudy.feature4",
            "projects.pohgo.caseStudy.feature5",
          ],
        },
      ],
    },
    gallery: {
      titleKey: "projects.pohgo.caseStudy.galleryTitle",
      introKey: "projects.pohgo.caseStudy.galleryIntro",
      items: [
        {
          image: pohgoHighlight,
          altKey: "projects.pohgo.caseStudy.gallery1",
          captionKey: "projects.pohgo.caseStudy.gallery1",
          layout: "portrait",
        },
        {
          image: pohgoAbout,
          altKey: "projects.pohgo.caseStudy.gallery2",
          captionKey: "projects.pohgo.caseStudy.gallery2",
          layout: "wide",
          delay: 100,
        },
        {
          image: pohgoMenu,
          altKey: "projects.pohgo.caseStudy.gallery3",
          captionKey: "projects.pohgo.caseStudy.gallery3",
          layout: "portrait",
        },
        {
          image: pohgoDelivery,
          altKey: "projects.pohgo.caseStudy.gallery4",
          captionKey: "projects.pohgo.caseStudy.gallery4",
          layout: "closing",
        },
      ],
    },
  },
];

export const getCaseStudyBySlug = (slug?: string) =>
  caseStudies.find((caseStudy) => caseStudy.slug === slug);

export const getCaseStudyByProjectId = (projectId: PortfolioProject["id"]) =>
  caseStudies.find((caseStudy) => caseStudy.projectId === projectId);

export const getNextCaseStudy = (slug: string) => {
  if (caseStudies.length < 2) return undefined;

  const currentIndex = caseStudies.findIndex((caseStudy) => caseStudy.slug === slug);
  if (currentIndex === -1) return undefined;

  return caseStudies[(currentIndex + 1) % caseStudies.length];
};

export const hasCaseStudy = (projectId: PortfolioProject["id"]) =>
  Boolean(getCaseStudyByProjectId(projectId));
