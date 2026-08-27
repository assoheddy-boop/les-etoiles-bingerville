export type NewsStatus = "draft" | "published";

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  publishedAt: string;
  status: NewsStatus;
};

export type CmsContent = {
  histoire: {
    title: string;
    body: string;
    editorialNote: string;
  };
  motDuProviseur: {
    title: string;
    authorLabel: string;
    body: string;
    editorialNote: string;
  };
  informations: {
    title: string;
    intro: string;
    items: { title: string; body: string }[];
  };
  news: NewsArticle[];
};

export type InboxKind = "contact" | "inscription";

export type InboxMessage = {
  id: string;
  kind: InboxKind;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  cycle?: string;
  message: string;
  convertedStudentId?: string;
};
