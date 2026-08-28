import path from "node:path";

/** Local JSON + uploads. On Vercel, writes go to Blob (`src/lib/persist.ts`) — never `/tmp`. */
export const bundledDataDir = path.join(process.cwd(), "data");
export const dataDir = bundledDataDir;

export const cmsFile = path.join(dataDir, "cms.json");
export const inboxFile = path.join(dataDir, "inbox.json");
export const ledgerFile = path.join(dataDir, "payment-ledger.json");
export const schoolLifeFile = path.join(dataDir, "school-life.json");
export const aiChatFile = path.join(dataDir, "ai-chat.json");
export const employeesFile = path.join(dataDir, "employees.json");
export const homeworkUploadsDir = path.join(dataDir, "uploads", "homeworks");
export const bundledHomeworkUploadsDir = path.join(bundledDataDir, "uploads", "homeworks");
export const lostItemUploadsDir = path.join(dataDir, "uploads", "lost-items");
export const bundledLostItemUploadsDir = path.join(bundledDataDir, "uploads", "lost-items");
export const studentPhotoUploadsDir = path.join(dataDir, "uploads", "students");
export const bundledStudentPhotoUploadsDir = path.join(bundledDataDir, "uploads", "students");
