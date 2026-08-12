import type { ImageMetadata } from "astro";

import bronzPreview from "../assets/projects/bronz.webp";
import chopChopPreviewEn from "../assets/projects/chopchop-en.png";
import chopChopPreviewHr from "../assets/projects/chopchop.png";
import joe2ShinePreview from "../assets/projects/joe2shine.webp";
import kinoEdisonPreview from "../assets/projects/kino-edison.png";
import lsWashPreview from "../assets/projects/ls-wash.webp";
import pohgoPreview from "../assets/projects/pohgo.webp";

export type ProjectType = "website" | "app";
export type ProjectStatus = "live" | "in-development";

export interface PortfolioProject {
  id: "ls-wash" | "joe2shine" | "bronz" | "pohgo" | "kino-edison" | "chopchop";
  type: ProjectType;
  status: ProjectStatus;
  href: string;
  collaborator?: {
    name: string;
    href: string;
  };
  image: ImageMetadata;
  imageHr?: ImageMetadata;
  imagePosition: string;
  featured: boolean;
}

export const projects: PortfolioProject[] = [
  /* {
    id: "ls-wash",
    type: "website",
    status: "live",
    href: "https://lswash.hr/",
    image: lsWashPreview,
    imagePosition: "center",
    featured: true,
  }, */
  {
    id: "joe2shine",
    type: "website",
    status: "live",
    href: "https://joe2shine.com/",
    image: joe2ShinePreview,
    imagePosition: "center",
    featured: true,
  },
  {
    id: "bronz",
    type: "website",
    status: "live",
    href: "https://bronz.hr/",
    image: bronzPreview,
    imagePosition: "62% center",
    featured: false,
  },
  {
    id: "pohgo",
    type: "website",
    status: "live",
    href: "https://pohgo.hr/",
    image: pohgoPreview,
    imagePosition: "center top",
    featured: true,
  },
  {
    id: "kino-edison",
    type: "website",
    status: "live",
    href: "https://kino-edison.hr/",
    collaborator: {
      name: "Striboss Design",
      href: "https://striboss.com/",
    },
    image: kinoEdisonPreview,
    imagePosition: "center top",
    featured: false,
  },
  {
    id: "chopchop",
    type: "app",
    status: "in-development",
    href: "https://app.fronta.hr/",
    image: chopChopPreviewEn,
    imageHr: chopChopPreviewHr,
    imagePosition: "center top",
    featured: true,
  },
];

export const getFeaturedProjects = () => projects.filter((project) => project.featured);

export const getProjectsByType = (type: ProjectType) =>
  projects.filter((project) => project.type === type);

export const getProjectImage = (project: PortfolioProject, lang: "en" | "hr") =>
  lang === "hr" && project.imageHr ? project.imageHr : project.image;

export const getProjectById = (id: PortfolioProject["id"]) =>
  projects.find((project) => project.id === id);
