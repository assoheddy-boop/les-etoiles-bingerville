import { cmsSeed } from "./cms-seed";
import type { CmsContent, InboxMessage, NewsArticle } from "./cms-types";
import { readJsonDocument, writeJsonDocument } from "./persist";

export async function readCms(): Promise<CmsContent> {
  const raw = await readJsonDocument("cms");
  if (!raw) return structuredClone(cmsSeed);
  try {
    const parsed = JSON.parse(raw) as CmsContent;
    return {
      ...cmsSeed,
      ...parsed,
      histoire: { ...cmsSeed.histoire, ...parsed.histoire },
      motDuProviseur: { ...cmsSeed.motDuProviseur, ...parsed.motDuProviseur },
      informations: { ...cmsSeed.informations, ...parsed.informations },
      news: parsed.news?.length ? parsed.news : cmsSeed.news,
    };
  } catch {
    return structuredClone(cmsSeed);
  }
}

export async function writeCms(next: CmsContent) {
  await writeJsonDocument("cms", next);
}

export async function publishedNews(): Promise<NewsArticle[]> {
  const cms = await readCms();
  return cms.news
    .filter((item) => item.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function newsBySlug(slug: string): Promise<NewsArticle | undefined> {
  const cms = await readCms();
  return cms.news.find((item) => item.slug === slug && item.status === "published");
}

export async function readInbox(): Promise<InboxMessage[]> {
  const raw = await readJsonDocument("inbox");
  if (!raw) return [];
  try {
    return JSON.parse(raw) as InboxMessage[];
  } catch {
    return [];
  }
}

export async function writeInbox(next: InboxMessage[]) {
  await writeJsonDocument("inbox", next);
}

export async function appendInbox(message: InboxMessage) {
  const current = await readInbox();
  current.unshift(message);
  await writeInbox(current);
}
