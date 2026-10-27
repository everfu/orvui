export interface NotFoundProps {
  code?: string;
  title?: string;
  description?: string;
  homeHref?: string;
  homeLabel?: string;
  browseHref?: string;
  browseLabel?: string;
}
export const NOT_FOUND_DEFAULTS = {
  code: "404",
  title: "Page not found",
  description:
    "The page you are looking for moved, vanished, or never existed.",
  homeHref: "/",
  homeLabel: "Back home",
  browseHref: "/components/motion",
  browseLabel: "Browse components",
};
