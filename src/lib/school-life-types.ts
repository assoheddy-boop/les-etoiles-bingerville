export type CycleId = "Maternelle" | "Primaire" | "Secondaire";
export type AttendanceStatus = "present" | "late" | "absent";
export type ActorRole = "parent" | "teacher" | "school";
export type FeeKind = "scolarite" | "cantine" | "inscription" | "other";
export type InvoiceStatus = "due" | "paid" | "pending";
export type WeekdayId = 1 | 2 | 3 | 4 | 5 | 6;
export type TransportEvent = "boarded" | "arrived" | "left_school" | "picked_up";
export type HealthKind = "fever" | "injury" | "sent_home" | "other";
export type LeaveType = "annual" | "sick" | "personal" | "unpaid" | "maternity" | "other";
export type LeaveStatus = "pending" | "approved" | "refused";
export type StaffPresenceStatus = "present" | "late" | "absent" | "half_day";
export type ContractType = "cdi" | "cdd" | "vacataire" | "stage";
export type StaffStatus = "active" | "on_leave" | "inactive";
export type JobTitleId =
  | "enseignant"
  | "atsem"
  | "menage"
  | "gardien"
  | "chauffeur"
  | "secretariat"
  | "comptabilite"
  | "other";
export type AdvanceStatus = "pending" | "approved" | "refused" | "deducted";
export type PayRubriqueKind = "earning" | "deduction";
export type PayrollRunStatus = "draft" | "validated" | "paid";
export type FinanceAccountType = "cash" | "wave" | "orange_money" | "bank";
export type ExpenseCategoryKind = "income" | "expense";
export type FinanceTxType = "in" | "out";
export type SupplierInvoiceStatus = "pending" | "paid" | "cancelled";
export type SocialDiscountType = "percent" | "fixed" | "installment";
export type SocialCaseStatus = "actif" | "clos";
export type EnrollmentStatus = "NOUVEAU" | "REINSCRIPTION" | "TRANSFERT" | "REAFFECTATION";
export type EnrollmentDocumentKey =
  | "photos"
  | "extraitNaissance"
  | "certificatScolarite"
  | "carnetCorrespondance"
  | "visiteMedicale"
  | "carteAcces"
  | "macaron"
  | "teeShirt"
  | "short"
  | "droitExamen"
  | "livretScolaire"
  | "manuelInformatique"
  | "carteIdentiteUnique"
  | "inscriptionLigne";

export const CYCLES: CycleId[] = ["Maternelle", "Primaire", "Secondaire"];

export const WEEKDAYS: Array<{ id: WeekdayId; label: string; short: string }> = [
  { id: 1, label: "Lundi", short: "Lun" },
  { id: 2, label: "Mardi", short: "Mar" },
  { id: 3, label: "Mercredi", short: "Mer" },
  { id: 4, label: "Jeudi", short: "Jeu" },
  { id: 5, label: "Vendredi", short: "Ven" },
  { id: 6, label: "Samedi", short: "Sam" },
];

export const CAMPUSES = [
  "Maternelle Les Étoiles",
  "Primaire Les Étoiles",
  "Collège Les Étoiles (non ouvert)",
] as const;

export type Establishment = {
  id: string;
  name: string;
  shortName: string;
  cycle: CycleId;
  /** Libellé du site physique (Bingerville / Adjamé). */
  campus: string;
  menDecision?: string;
  menDate?: string;
  address: string;
  phone?: string;
};

export type SchoolYear = {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  current: boolean;
};

export type Subject = {
  id: string;
  name: string;
  cycle?: CycleId;
};

export type TeacherAccount = {
  id: string;
  email: string;
  password: string;
  displayName: string;
  title: string;
  classIds: string[];
  subjectIds: string[];
  phone?: string;
};

export type SchoolClass = {
  id: string;
  name: string;
  cycle: CycleId;
  campus: string;
  establishmentId: string;
  schoolYearId: string;
  room?: string;
};

export type ParentAccount = {
  id: string;
  displayName: string;
  password: string;
  email?: string;
  phone?: string;
  studentIds: string[];
  /** Accès espace parents — défaut false pour les nouveaux, true pour les démos ETOILES-DEMO-001/002. */
  moduleParentsActive?: boolean;
};

export type RosterStudent = {
  id: string;
  firstName: string;
  lastName: string;
  classId: string;
  matricule?: string;
  nationalMatricule?: string;
  parentId?: string;
  parentName?: string;
  birthDate?: string;
  birthPlace?: string;
  gender?: "M" | "F";
  nationality?: string;
  fatherName?: string;
  motherName?: string;
  guardianName?: string;
  guardianPhone?: string;
  contactPhone?: string;
  contactEmail?: string;
  series?: string;
  /** Nom de fichier sous data/uploads/students/ ou URL /images/… */
  photo?: string;
};

export type StudentEnrollment = {
  id: string;
  studentId: string;
  schoolYearId: string;
  enrolledAt: string;
  enrollmentStatus: EnrollmentStatus;
  lv2?: string;
  birthCertNumber?: string;
  birthCertDate?: string;
  birthCertPlace?: string;
  previousSchool?: string;
  previousClass?: string;
  transferRef?: string;
  decisionNumber?: string;
  isScholarship: boolean;
  documentsChecklist: Record<string, boolean>;
  notes?: string;
  repeatYear: boolean;
};

export type TimetableSlot = {
  id: string;
  classId: string;
  dayOfWeek: WeekdayId;
  startTime: string;
  endTime: string;
  subjectId: string;
  teacherId: string;
  room?: string;
};

export type FeeType = {
  id: string;
  name: string;
  kind: FeeKind;
  amountFcfa: number;
  period: string;
  cycle?: CycleId;
  classId?: string;
};

export type StudentInvoice = {
  id: string;
  studentId: string;
  feeTypeId: string;
  kind: FeeKind;
  label: string;
  period: string;
  amountFcfa: number;
  status: InvoiceStatus;
  createdAt: string;
};

export type Grade = {
  id: string;
  studentId: string;
  teacherId: string;
  subject: string;
  value: number;
  maxValue: number;
  period: string;
  comment?: string;
  createdAt: string;
};

export type AttendanceEntry = {
  studentId: string;
  status: AttendanceStatus;
};

export type AttendanceSession = {
  id: string;
  date: string;
  classId: string;
  teacherId: string;
  recordedAt: string;
  entries: AttendanceEntry[];
};

export type Homework = {
  id: string;
  classId: string;
  teacherId: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  /** Nom du fichier stocké sous data/uploads/homeworks/ */
  attachment?: string;
  /** Nom affiché au téléchargement (fichier d’origine). */
  attachmentName?: string;
};

export type Bulletin = {
  id: string;
  studentId: string;
  period: string;
  average: number;
  comment: string;
  createdAt: string;
  /** Chemin relatif optionnel d’un PDF pré-généré ; sinon génération à la volée. */
  pdfPath?: string;
};

export type SchoolMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  studentId?: string;
  content: string;
  createdAt: string;
  readAt?: string;
};

export type BusStop = {
  id: string;
  name: string;
  time: string;
};

export type BusLine = {
  id: string;
  name: string;
  driverName: string;
  plate: string;
  note?: string;
  stops: BusStop[];
  studentIds: string[];
};

export type TransportLog = {
  id: string;
  studentId: string;
  busId: string;
  date: string;
  event: TransportEvent;
  note?: string;
  recordedAt: string;
  recordedBy: string;
};

export type PickupAuthorization = {
  id: string;
  studentId: string;
  date: string;
  code: string;
  authorizedPerson: string;
  authorizedPhone?: string;
  createdAt: string;
  createdBy: string;
  usedAt?: string;
};

export type HealthIncident = {
  id: string;
  studentId: string;
  kind: HealthKind;
  note: string;
  date: string;
  createdAt: string;
  recordedBy: string;
};

export type StaffDocumentNote = {
  id: string;
  filename: string;
  note?: string;
};

export type StaffProfile = {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: JobTitleId;
  contractType: ContractType;
  status: StaffStatus;
  startDate: string;
  campus: string;
  establishmentId?: string;
  teacherId?: string;
  email?: string;
  phone?: string;
  baseSalary: number;
  documents: StaffDocumentNote[];
  notes?: string;
};

export type LeaveRequest = {
  id: string;
  staffId: string;
  teacherId?: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  adminNote?: string;
  createdAt: string;
  reviewedAt?: string;
};

export type StaffPresence = {
  id: string;
  staffId: string;
  teacherId?: string;
  date: string;
  status: StaffPresenceStatus;
  note?: string;
};

/** Ancien champ conservé pour hydrater les JSON déjà écrits. */
export type PayrollNote = {
  id: string;
  teacherId?: string;
  staffId?: string;
  month: string;
  note: string;
};

export type SalaryAdvance = {
  id: string;
  staffId: string;
  amount: number;
  reason: string;
  status: AdvanceStatus;
  adminNote?: string;
  createdAt: string;
  reviewedAt?: string;
};

export type StaffEvaluation = {
  id: string;
  staffId: string;
  date: string;
  score: number;
  comment: string;
  createdAt: string;
};

export type PayRubrique = {
  id: string;
  code?: string;
  name: string;
  type: PayRubriqueKind;
  amount?: number;
  percent?: number;
};

export type PayrollRun = {
  id: string;
  month: string;
  status: PayrollRunStatus;
  totalNet: number;
  createdAt: string;
  paidAt?: string;
  accountId?: string;
};

export type PayslipLine = {
  id: string;
  code?: string;
  label: string;
  kind: PayRubriqueKind;
  amount: number;
  base?: number;
  rate?: number;
  rateLabel?: string;
};

export type Payslip = {
  id: string;
  payrollRunId: string;
  staffId: string;
  month: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  advances: number;
  netPay: number;
  lines: PayslipLine[];
  createdAt: string;
};

export type FinanceAccount = {
  id: string;
  name: string;
  type: FinanceAccountType;
  balance: number;
  establishmentId?: string;
};

export type ExpenseCategory = {
  id: string;
  name: string;
  kind: ExpenseCategoryKind;
};

export type FinanceTransaction = {
  id: string;
  type: FinanceTxType;
  accountId: string;
  categoryId?: string;
  date: string;
  label: string;
  amount: number;
  reference?: string;
  invoiceId?: string;
  supplierInvoiceId?: string;
  payrollRunId?: string;
  createdAt: string;
};

export type SupplierInvoice = {
  id: string;
  supplier: string;
  amount: number;
  status: SupplierInvoiceStatus;
  dueDate?: string;
  description?: string;
  categoryId?: string;
  paidAt?: string;
  accountId?: string;
  createdAt: string;
};

export type BudgetLine = {
  id: string;
  categoryId: string;
  plannedAmount: number;
  year: string;
};

export type SocialCase = {
  id: string;
  studentId: string;
  motif: string;
  discountType: SocialDiscountType;
  discountValue: number;
  note?: string;
  status: SocialCaseStatus;
  createdAt: string;
  closedAt?: string;
};

export type LostItem = {
  id: string;
  description: string;
  place: string;
  foundAt: string;
  createdAt: string;
  recordedBy: string;
  /** Chemin public (/images/…) ou nom de fichier sous data/uploads/lost-items/ */
  photo?: string;
  claimed: boolean;
  claimedByParentId?: string;
  claimedAt?: string;
};

export type StaffRole = "fondateur" | "directeur" | "vie_scolaire";

export type ActivityLogAction =
  | "login"
  | "validate_lesson"
  | "homework_create"
  | "grade_save"
  | "bulletin_deposit"
  | "assessment_submit"
  | "message_send"
  | "module_toggle";

export type ActivityActorRole = "teacher" | StaffRole | "superadmin";

export type ActivityLog = {
  id: string;
  at: string;
  actorId: string;
  actorRole: ActivityActorRole;
  action: ActivityLogAction;
  payload: Record<string, string | number | boolean | null>;
};

export type LessonValidation = {
  id: string;
  teacherId: string;
  slotId: string;
  date: string;
  classId: string;
  subjectId: string;
  chapter: string;
  content: string;
  validatedAt: string;
};

export type AssessmentKind = "controle" | "composition";
export type AssessmentStatus = "planifie" | "fait" | "en_retard";

export type Assessment = {
  id: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  kind: AssessmentKind;
  date: string;
  topic: string;
  attachment?: string;
  attachmentName?: string;
  status: AssessmentStatus;
  validated: boolean;
  createdAt: string;
  submittedAt?: string;
};

export type ModuleId =
  | "parents"
  | "enseignants"
  | "vie_scolaire"
  | "direction"
  | "secretariat"
  | "comptabilite"
  | "paiements"
  | "notes"
  | "devoirs"
  | "examens"
  | "presence"
  | "discipline"
  | "chat_ia"
  | "notifications_sms"
  | "whatsapp"
  | "finances"
  | "rapports"
  | "controle_enseignants"
  | "avances"
  | "premium";

export type ModuleScope = "global" | "role" | "establishment" | "user";

export type ModuleOverride = {
  moduleId: string;
  scope: ModuleScope;
  scopeId?: string;
  enabled: boolean;
  at: string;
  by: string;
};

export type ModuleHistoryEntry = {
  id: string;
  moduleId: string;
  scope: ModuleScope;
  scopeId?: string;
  enabled: boolean;
  at: string;
  by: string;
};

export type ModuleControlStore = {
  modules: Array<{ id: string; label: string; defaultOn: boolean }>;
  overrides: ModuleOverride[];
  history: ModuleHistoryEntry[];
};

export type CashPaymentStatus = "pending" | "validated";

export type CashPayment = {
  id: string;
  parentId: string;
  studentId?: string;
  invoiceId?: string;
  amount: number;
  date: string;
  recordedBy: string;
  validatedBy?: string;
  validatedAt?: string;
  status: CashPaymentStatus;
  mode: "cash";
};

export type SchoolLifeData = {
  schoolYears: SchoolYear[];
  currentSchoolYearId: string;
  establishments: Establishment[];
  subjects: Subject[];
  teachers: TeacherAccount[];
  classes: SchoolClass[];
  parents: ParentAccount[];
  students: RosterStudent[];
  timetableSlots: TimetableSlot[];
  feeTypes: FeeType[];
  invoices: StudentInvoice[];
  bulletins: Bulletin[];
  attendance: AttendanceSession[];
  homeworks: Homework[];
  grades: Grade[];
  messages: SchoolMessage[];
  busLines: BusLine[];
  transportLogs: TransportLog[];
  pickupAuths: PickupAuthorization[];
  healthIncidents: HealthIncident[];
  leaveRequests: LeaveRequest[];
  staffPresence: StaffPresence[];
  payrollNotes: PayrollNote[];
  staffProfiles: StaffProfile[];
  salaryAdvances: SalaryAdvance[];
  staffEvaluations: StaffEvaluation[];
  payRubriques: PayRubrique[];
  payrollRuns: PayrollRun[];
  payslips: Payslip[];
  financeAccounts: FinanceAccount[];
  expenseCategories: ExpenseCategory[];
  financeTransactions: FinanceTransaction[];
  supplierInvoices: SupplierInvoice[];
  budgetLines: BudgetLine[];
  socialCases: SocialCase[];
  lostItems: LostItem[];
  enrollments: StudentEnrollment[];
  /** Module « Contrôle des enseignants » — défaut true en démo. */
  teacherControlEnabled: boolean;
  /** Jours sans message parent avant alerte. */
  teacherControlNoMessageDays: number;
  lessonValidations: LessonValidation[];
  assessments: Assessment[];
  activityLogs: ActivityLog[];
  moduleControl: ModuleControlStore;
  cashPayments: CashPayment[];
};

export type Actor = {
  id: string;
  name: string;
  role: ActorRole;
};

export type MessagePartner = {
  id: string;
  name: string;
  label: string;
};

export type ParentChildView = {
  id: string;
  studentName: string;
  parentName: string;
  matricule: string;
  cycle: CycleId;
  classroom: string;
  classId: string;
};
