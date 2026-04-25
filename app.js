const STORAGE_KEY = "mici-suivi-state-v1";
const SESSION_KEY = "mici-suivi-session-v1";
const LANG_KEY = "mici-suivi-language-v1";
const PAGE_SIZE = 5;

const appConfig = loadAppConfig();
const I18N = {
  fr: {
    "app.title": "MICI TRACK - Suivi des patients",
    "brand.authSubtitle": "Connexion MICI TRACK",
    "brand.clinicalPlatform": "Plateforme clinique",
    "home.eyebrow": "Smart Patient Monitoring",
    "home.heroTitle": "Smart Patient Monitoring",
    "home.lede": "Suivez les patients au quotidien, détectez les risques plus tôt et donnez aux médecins une vue claire en temps réel de chaque cas.",
    "home.doctorAccess": "Accès médecin",
    "home.patientAccess": "Accès patient",
    "home.trust1": "Suivi à distance",
    "home.trust2": "Alertes intelligentes",
    "home.trust3": "Français / عربي",
    "home.aboutEyebrow": "Qui sommes-nous",
    "home.aboutTitle": "Smart Patient Monitoring",
    "home.aboutText": "Nous sommes une équipe qui améliore le suivi patient grâce à la technologie. Notre objectif est d’aider les médecins à gagner du temps et à prendre de meilleures décisions, tout en donnant aux patients un moyen simple de suivre leur santé au quotidien.",
    "home.featureDoctorTitle": "Pour le médecin",
    "home.featureDoctorText": "Dashboard, score clinique, recherche, pagination, création de patient et messagerie sécurisée.",
    "home.featurePatientTitle": "Pour le patient",
    "home.featurePatientText": "Connexion par code, questionnaire rapide, feedback immédiat et messages du médecin.",
    "home.featureMoroccoTitle": "Ancré au Maroc",
    "home.featureMoroccoText": "Interface bilingue français/arabe et expérience adaptée aux cabinets et patients locaux.",
    "home.backHome": "Retour à l’accueil",
    "auth.doctorTitle": "Connexion médecin",
    "auth.doctorSubtitle": "Accès au dashboard, création des patients et messagerie.",
    "auth.patientTitle": "Connexion patient",
    "auth.patientSubtitle": "Accès limité au questionnaire, feedback et messages reçus.",
    "auth.login": "Se connecter",
    "auth.enter": "Entrer",
    "common.email": "Email",
    "common.password": "Mot de passe",
    "common.patientCode": "Code patient",
    "nav.doctor": "Médecin",
    "nav.patient": "Patient",
    "nav.messages": "Messages",
    "nav.database": "Base distante",
    "views.doctorEyebrow": "Dashboard médecin",
    "views.doctorTitle": "Suivi intelligent des patients MICI",
    "views.patientEyebrow": "Espace patient",
    "views.patientTitle": "Questionnaire quotidien et feedback immédiat",
    "views.messagesEyebrow": "Communication",
    "views.messagesTitle": "Messages sécurisés médecin-patient",
    "views.databaseEyebrow": "Base distante",
    "views.databaseTitle": "Connexion PostgreSQL distante via Supabase",
    "actions.refresh": "Synchroniser",
    "actions.resetDemo": "Réinitialiser la démo",
    "actions.logout": "Déconnexion",
    "actions.generate": "Générer",
    "actions.createPatient": "Créer le patient",
    "actions.search": "Recherche",
    "actions.change": "Changer",
    "actions.submitFollowup": "Envoyer le suivi",
    "actions.send": "Envoyer",
    "doctor.addPatient": "Ajouter un patient",
    "doctor.addPatientHint": "Le code est unique et peut être généré automatiquement.",
    "doctor.patients": "Patients",
    "doctor.priorityHint": "Priorisation automatique selon symptômes et observance.",
    "patient.firstName": "Prénom",
    "patient.lastName": "Nom",
    "patient.phone": "Téléphone",
    "patient.noPhone": "Téléphone non renseigné",
    "patient.diagnosis": "Diagnostic",
    "patient.currentTreatment": "Traitement en cours",
    "patient.codeAccessHint": "Accès par code anonyme remis par le médecin.",
    "patient.dailyQuestionnaire": "Questionnaire quotidien",
    "question.treatmentTaken": "Traitement pris",
    "question.stools": "Nombre de selles",
    "question.blood": "Sang dans les selles",
    "question.fever": "Fièvre",
    "question.pain": "Douleur abdominale",
    "question.fatigue": "Fatigue",
    "question.sideEffects": "Effets secondaires",
    "question.generalState": "État général",
    "state.good": "Bien",
    "state.medium": "Moyen",
    "state.bad": "Mauvais",
    "messages.secureTitle": "Messagerie sécurisée",
    "messages.secureHint": "Convocation, conseil thérapeutique et suivi à distance.",
    "messages.doctorMessage": "Message médecin",
    "messages.history": "Historique",
    "messages.historyHint": "Messages médecin → patient et réponses enregistrées.",
    "database.configTitle": "Configuration Supabase",
    "database.configHint": "La connexion distante est lue depuis config.js, pas depuis le dashboard.",
    "database.modelTitle": "Modèle de données",
    "database.modelHint": "Tables utilisées par le prototype et prêtes pour les règles RLS.",
    "database.patientsTable": "nom, prénom, téléphone, code unique",
    "database.reportsTable": "questionnaire quotidien et score",
    "database.treatmentsTable": "historique thérapeutique",
    "database.eventsTable": "timeline et décisions",
    "database.messagesTable": "communication médecin-patient",
    "database.openSql": "Ouvrir le script SQL Supabase",
    "database.openConfig": "Ouvrir config.js",
    "database.mode": "Mode",
    "database.remoteMode": "Supabase distant",
    "database.localMode": "Démo locale",
    "database.projectUrl": "Project URL",
    "database.anonKey": "Anon key",
    "database.notConfigured": "Non configurée",
    "database.configInstruction": "Modifie config.js, puis recharge la page pour changer la connexion. Le dashboard ne demande plus la clé.",
    "status.all": "Tous",
    "status.green": "Stable",
    "status.orange": "À surveiller",
    "status.red": "Alerte",
    "status.never": "jamais",
    "status.now": "à l’instant",
    "status.hoursAgo": "il y a {count} h",
    "status.daysAgo": "il y a {count} j",
    "sync.local": "Mode démo local",
    "sync.remote": "Base distante connectée",
    "sync.loading": "Synchronisation...",
    "sync.failed": "Connexion distante impossible",
    "placeholders.treatment": "Biothérapie, CTC, mésalazine...",
    "placeholders.patientSearch": "Nom, prénom, code ou téléphone",
    "placeholders.sideEffects": "Aucun, nausées, céphalées...",
    "placeholders.message": "Merci de contacter le cabinet aujourd’hui...",
    "metrics.totalPatients": "Patients suivis",
    "metrics.totalPatientsHint": "codes anonymisés",
    "metrics.redAlerts": "Alertes rouges",
    "metrics.redAlertsHint": "nécessitent une action",
    "metrics.avgAdherence": "Observance moyenne",
    "metrics.avgAdherenceHint": "14 derniers jours",
    "metrics.reports24h": "Questionnaires 24h",
    "metrics.reports24hHint": "activité récente",
    "table.patient": "Patient",
    "table.phone": "Téléphone",
    "table.diagnosis": "Diagnostic",
    "table.treatment": "Traitement",
    "table.adherence": "Observance",
    "table.symptoms": "Symptômes",
    "table.lastActivity": "Dernière activité",
    "table.noResults": "Aucun patient ne correspond à la recherche.",
    "pagination.summary": "{start}-{end} sur {total} patient{plural}",
    "detail.alerts": "Alertes intelligentes",
    "detail.currentTreatment": "Traitement en cours",
    "detail.clinicalScore": "Score clinique",
    "detail.stools": "Nombre de selles",
    "detail.pain": "Douleur",
    "detail.fatigue": "Fatigue",
    "detail.adherence": "Observance",
    "detail.treatmentHistory": "Historique des traitements",
    "detail.medicalTimeline": "Timeline médicale",
    "detail.noPatient": "Aucun patient enregistré.",
    "detail.noRecentSymptoms": "Aucun symptôme récent",
    "detail.inProgress": "en cours",
    "symptoms.stools": "{count} selles",
    "symptoms.pain": "douleur {value}/10",
    "symptoms.fatigue": "fatigue {value}/10",
    "symptoms.blood": "sang",
    "symptoms.fever": "fièvre",
    "alerts.noQuestionnaire": "Aucun questionnaire quotidien enregistré.",
    "alerts.blood": "Sang dans les selles signalé.",
    "alerts.fever": "Fièvre signalée.",
    "alerts.highPain": "Douleur abdominale élevée.",
    "alerts.highStools": "Nombre de selles élevé.",
    "alerts.highFatigue": "Fatigue importante.",
    "alerts.missedTreatment": "Traitement non pris lors du dernier suivi.",
    "alerts.sideEffects": "Effets secondaires: {value}",
    "alerts.stale": "Questionnaire non rempli depuis plus de 48 h.",
    "alerts.lowAdherence": "Observance thérapeutique inférieure à 70%.",
    "alerts.worsening": "Aggravation progressive sur plusieurs jours.",
    "alerts.noWorsening": "Pas de signe d’aggravation détecté.",
    "feedback.redTitle": "Contactez votre médecin",
    "feedback.orangeTitle": "À surveiller",
    "feedback.greenTitle": "Votre état est stable",
    "feedback.redAdvice": "Contactez votre médecin ou le cabinet aujourd’hui.",
    "feedback.orangeAdvice": "Surveillez vos symptômes et remplissez le questionnaire demain.",
    "feedback.greenAdvice": "Votre état est stable, continuez votre traitement.",
    "feedback.lastFollowup": "Dernier suivi",
    "feedback.noQuestionnaire": "Aucun questionnaire",
    "feedback.notifications": "Notifications",
    "feedback.doctorMessages": "Messages médecin",
    "feedback.noRecentMessage": "Aucun message récent.",
    "feedback.connectPrompt": "Connectez-vous avec le code patient pour afficher le suivi.",
    "notifications.questionnaire": "Rappel questionnaire quotidien.",
    "notifications.treatment": "Rappel prise de traitement.",
    "notifications.priority": "Message prioritaire: contact médical recommandé.",
    "notifications.none": "Aucune notification urgente.",
    "message.doctor": "Médecin",
    "message.patient": "Patient",
    "message.none": "Aucun message.",
    "toast.doctorInvalid": "Email ou mot de passe médecin incorrect.",
    "toast.patientInvalid": "Code patient introuvable.",
    "toast.patientConnected": "Connexion patient active.",
    "toast.doctorConnected": "Connexion médecin active.",
    "toast.codeRequired": "Le code patient est obligatoire.",
    "toast.codeExists": "Ce code patient existe déjà.",
    "toast.requiredPatientFields": "Nom, prénom, téléphone et traitement sont obligatoires.",
    "toast.patientCreated": "Patient {name} créé.",
    "toast.messageRequired": "Choisis un patient et saisis un message.",
    "toast.messageSent": "Message envoyé.",
    "toast.reportSaved": "Questionnaire enregistré.",
    "toast.localUpdated": "Données locales à jour.",
    "toast.resetConfirm": "Réinitialiser les données locales de démonstration ?",
    "toast.resetDone": "Démo locale réinitialisée.",
    "toast.logout": "Déconnexion effectuée.",
    "toast.remoteEmpty": "Base distante connectée, mais aucune donnée trouvée.",
    "toast.remoteSynced": "Synchronisation Supabase terminée.",
    "toast.remoteReadFailed": "Impossible de lire la base distante.",
    "toast.supabaseReportFailed": "Échec Supabase, sauvegarde locale utilisée.",
    "toast.supabaseMessageFailed": "Échec Supabase, message gardé localement.",
    "toast.supabasePatientFailed": "Échec Supabase, patient gardé localement.",
    "event.creationType": "Création",
    "event.patientAdded": "Patient ajouté au suivi",
    "event.patientCodeDetail": "Code d’accès: {code}",
    "treatment.initialNote": "Traitement initial saisi à la création du patient."
  },
  ar: {
    "app.title": "MICI TRACK - منصة تتبع مرضى الأمعاء الالتهابية",
    "brand.authSubtitle": "دخول MICI TRACK",
    "brand.clinicalPlatform": "منصة سريرية",
    "home.eyebrow": "Smart Patient Monitoring",
    "home.heroTitle": "Smart Patient Monitoring",
    "home.lede": "تتبع حالة المرضى يوميا، اكتشف المخاطر مبكرا وامنح الطبيب رؤية واضحة وفورية لكل حالة.",
    "home.doctorAccess": "دخول الطبيب",
    "home.patientAccess": "دخول المريض",
    "home.trust1": "تتبع عن بعد",
    "home.trust2": "تنبيهات ذكية",
    "home.trust3": "Français / عربي",
    "home.aboutEyebrow": "من نحن",
    "home.aboutTitle": "Smart Patient Monitoring",
    "home.aboutText": "نحن فريق يعمل على تحسين تتبع المرضى عبر التكنولوجيا. هدفنا مساعدة الأطباء على ربح الوقت واتخاذ قرارات أفضل، مع منح المرضى طريقة سهلة لتتبع صحتهم يوميا.",
    "home.featureDoctorTitle": "للطبيب",
    "home.featureDoctorText": "لوحة متابعة، نتيجة سريرية، بحث، صفحات، إضافة المرضى ورسائل آمنة.",
    "home.featurePatientTitle": "للمريض",
    "home.featurePatientText": "دخول بالرمز، استبيان سريع، نتيجة فورية ورسائل الطبيب.",
    "home.featureMoroccoTitle": "بروح مغربية",
    "home.featureMoroccoText": "واجهة ثنائية اللغة فرنسية/عربية وتجربة مناسبة للعيادات والمرضى محليا.",
    "home.backHome": "العودة إلى الصفحة الرئيسية",
    "auth.doctorTitle": "دخول الطبيب",
    "auth.doctorSubtitle": "الوصول إلى لوحة المتابعة، إضافة المرضى والرسائل.",
    "auth.patientTitle": "دخول المريض",
    "auth.patientSubtitle": "وصول محدود للاستبيان، النتيجة والرسائل المستلمة.",
    "auth.login": "تسجيل الدخول",
    "auth.enter": "دخول",
    "common.email": "البريد الإلكتروني",
    "common.password": "كلمة المرور",
    "common.patientCode": "رمز المريض",
    "nav.doctor": "الطبيب",
    "nav.patient": "المريض",
    "nav.messages": "الرسائل",
    "nav.database": "قاعدة بعيدة",
    "views.doctorEyebrow": "لوحة الطبيب",
    "views.doctorTitle": "تتبع ذكي لمرضى MICI",
    "views.patientEyebrow": "فضاء المريض",
    "views.patientTitle": "استبيان يومي ونتيجة فورية",
    "views.messagesEyebrow": "التواصل",
    "views.messagesTitle": "رسائل آمنة بين الطبيب والمريض",
    "views.databaseEyebrow": "قاعدة بعيدة",
    "views.databaseTitle": "اتصال PostgreSQL بعيد عبر Supabase",
    "actions.refresh": "مزامنة",
    "actions.resetDemo": "إعادة ضبط demo",
    "actions.logout": "تسجيل الخروج",
    "actions.generate": "توليد",
    "actions.createPatient": "إنشاء المريض",
    "actions.search": "بحث",
    "actions.change": "تغيير",
    "actions.submitFollowup": "إرسال المتابعة",
    "actions.send": "إرسال",
    "doctor.addPatient": "إضافة مريض",
    "doctor.addPatientHint": "الرمز فريد ويمكن توليده تلقائيا.",
    "doctor.patients": "المرضى",
    "doctor.priorityHint": "ترتيب تلقائي حسب الأعراض والالتزام بالعلاج.",
    "patient.firstName": "الاسم الشخصي",
    "patient.lastName": "الاسم العائلي",
    "patient.phone": "الهاتف",
    "patient.noPhone": "الهاتف غير مسجل",
    "patient.diagnosis": "التشخيص",
    "patient.currentTreatment": "العلاج الحالي",
    "patient.codeAccessHint": "الدخول برمز مجهول يمنحه الطبيب.",
    "patient.dailyQuestionnaire": "الاستبيان اليومي",
    "question.treatmentTaken": "تم أخذ العلاج",
    "question.stools": "عدد مرات التبرز",
    "question.blood": "دم في البراز",
    "question.fever": "حمى",
    "question.pain": "ألم البطن",
    "question.fatigue": "التعب",
    "question.sideEffects": "أعراض جانبية",
    "question.generalState": "الحالة العامة",
    "state.good": "جيدة",
    "state.medium": "متوسطة",
    "state.bad": "سيئة",
    "messages.secureTitle": "رسائل آمنة",
    "messages.secureHint": "استدعاء، نصيحة علاجية وتتبع عن بعد.",
    "messages.doctorMessage": "رسالة الطبيب",
    "messages.history": "السجل",
    "messages.historyHint": "رسائل الطبيب إلى المريض والردود المسجلة.",
    "database.configTitle": "إعداد Supabase",
    "database.configHint": "الاتصال البعيد يقرأ من config.js وليس من لوحة التحكم.",
    "database.modelTitle": "نموذج البيانات",
    "database.modelHint": "الجداول المستعملة في النموذج والقابلة لقواعد RLS.",
    "database.patientsTable": "الاسم، الهاتف، الرمز الفريد",
    "database.reportsTable": "الاستبيان اليومي والنتيجة",
    "database.treatmentsTable": "تاريخ العلاجات",
    "database.eventsTable": "الخط الزمني والقرارات",
    "database.messagesTable": "تواصل الطبيب والمريض",
    "database.openSql": "فتح ملف SQL الخاص ب Supabase",
    "database.openConfig": "فتح config.js",
    "database.mode": "الوضع",
    "database.remoteMode": "Supabase بعيد",
    "database.localMode": "Demo محلي",
    "database.projectUrl": "رابط المشروع",
    "database.anonKey": "المفتاح العام",
    "database.notConfigured": "غير مهيأة",
    "database.configInstruction": "عدّل config.js ثم أعد تحميل الصفحة لتغيير الاتصال. لوحة التحكم لا تطلب المفتاح.",
    "status.all": "الكل",
    "status.green": "مستقر",
    "status.orange": "للمراقبة",
    "status.red": "إنذار",
    "status.never": "لا يوجد",
    "status.now": "الآن",
    "status.hoursAgo": "منذ {count} ساعة",
    "status.daysAgo": "منذ {count} يوم",
    "sync.local": "وضع demo محلي",
    "sync.remote": "قاعدة بعيدة متصلة",
    "sync.loading": "جاري المزامنة...",
    "sync.failed": "تعذر الاتصال بالقاعدة البعيدة",
    "placeholders.treatment": "بيولوجي، كورتيكويد، ميزالازين...",
    "placeholders.patientSearch": "الاسم، الرمز أو الهاتف",
    "placeholders.sideEffects": "لا شيء، غثيان، صداع...",
    "placeholders.message": "يرجى التواصل مع العيادة اليوم...",
    "metrics.totalPatients": "المرضى المتابعون",
    "metrics.totalPatientsHint": "رموز مجهولة",
    "metrics.redAlerts": "إنذارات حمراء",
    "metrics.redAlertsHint": "تحتاج إلى تدخل",
    "metrics.avgAdherence": "متوسط الالتزام",
    "metrics.avgAdherenceHint": "آخر 14 يوما",
    "metrics.reports24h": "استبيانات 24 ساعة",
    "metrics.reports24hHint": "نشاط حديث",
    "table.patient": "المريض",
    "table.phone": "الهاتف",
    "table.diagnosis": "التشخيص",
    "table.treatment": "العلاج",
    "table.adherence": "الالتزام",
    "table.symptoms": "الأعراض",
    "table.lastActivity": "آخر نشاط",
    "table.noResults": "لا يوجد مريض مطابق للبحث.",
    "pagination.summary": "{start}-{end} من {total} مريض",
    "detail.alerts": "تنبيهات ذكية",
    "detail.currentTreatment": "العلاج الحالي",
    "detail.clinicalScore": "النتيجة السريرية",
    "detail.stools": "عدد مرات التبرز",
    "detail.pain": "الألم",
    "detail.fatigue": "التعب",
    "detail.adherence": "الالتزام",
    "detail.treatmentHistory": "تاريخ العلاجات",
    "detail.medicalTimeline": "الخط الزمني الطبي",
    "detail.noPatient": "لا يوجد أي مريض مسجل.",
    "detail.noRecentSymptoms": "لا توجد أعراض حديثة",
    "detail.inProgress": "مستمر",
    "symptoms.stools": "{count} مرات تبرز",
    "symptoms.pain": "ألم {value}/10",
    "symptoms.fatigue": "تعب {value}/10",
    "symptoms.blood": "دم",
    "symptoms.fever": "حمى",
    "alerts.noQuestionnaire": "لم يتم تسجيل أي استبيان يومي.",
    "alerts.blood": "تم الإبلاغ عن دم في البراز.",
    "alerts.fever": "تم الإبلاغ عن حمى.",
    "alerts.highPain": "ألم بطني مرتفع.",
    "alerts.highStools": "عدد مرات التبرز مرتفع.",
    "alerts.highFatigue": "تعب مهم.",
    "alerts.missedTreatment": "لم يتم أخذ العلاج في آخر متابعة.",
    "alerts.sideEffects": "أعراض جانبية: {value}",
    "alerts.stale": "لم يتم ملء الاستبيان منذ أكثر من 48 ساعة.",
    "alerts.lowAdherence": "الالتزام بالعلاج أقل من 70%.",
    "alerts.worsening": "تدهور تدريجي خلال عدة أيام.",
    "alerts.noWorsening": "لم يتم رصد علامات تدهور.",
    "feedback.redTitle": "اتصل بطبيبك",
    "feedback.orangeTitle": "للمراقبة",
    "feedback.greenTitle": "حالتك مستقرة",
    "feedback.redAdvice": "اتصل بطبيبك أو بالعيادة اليوم.",
    "feedback.orangeAdvice": "راقب الأعراض واملأ الاستبيان غدا.",
    "feedback.greenAdvice": "حالتك مستقرة، واصل علاجك.",
    "feedback.lastFollowup": "آخر متابعة",
    "feedback.noQuestionnaire": "لا يوجد استبيان",
    "feedback.notifications": "الإشعارات",
    "feedback.doctorMessages": "رسائل الطبيب",
    "feedback.noRecentMessage": "لا توجد رسائل حديثة.",
    "feedback.connectPrompt": "سجل الدخول برمز المريض لعرض المتابعة.",
    "notifications.questionnaire": "تذكير بالاستبيان اليومي.",
    "notifications.treatment": "تذكير بأخذ العلاج.",
    "notifications.priority": "رسالة مهمة: يوصى بالتواصل الطبي.",
    "notifications.none": "لا توجد إشعارات عاجلة.",
    "message.doctor": "الطبيب",
    "message.patient": "المريض",
    "message.none": "لا توجد رسائل.",
    "toast.doctorInvalid": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "toast.patientInvalid": "رمز المريض غير موجود.",
    "toast.patientConnected": "تم دخول المريض.",
    "toast.doctorConnected": "تم دخول الطبيب.",
    "toast.codeRequired": "رمز المريض ضروري.",
    "toast.codeExists": "هذا الرمز موجود مسبقا.",
    "toast.requiredPatientFields": "الاسم، الهاتف والعلاج ضرورية.",
    "toast.patientCreated": "تم إنشاء المريض {name}.",
    "toast.messageRequired": "اختر مريضا واكتب رسالة.",
    "toast.messageSent": "تم إرسال الرسالة.",
    "toast.reportSaved": "تم حفظ الاستبيان.",
    "toast.localUpdated": "البيانات المحلية محدثة.",
    "toast.resetConfirm": "هل تريد إعادة ضبط بيانات demo المحلية؟",
    "toast.resetDone": "تمت إعادة ضبط demo المحلي.",
    "toast.logout": "تم تسجيل الخروج.",
    "toast.remoteEmpty": "تم الاتصال بالقاعدة البعيدة، لكن لا توجد بيانات.",
    "toast.remoteSynced": "تمت مزامنة Supabase.",
    "toast.remoteReadFailed": "تعذرت قراءة القاعدة البعيدة.",
    "toast.supabaseReportFailed": "تعذر Supabase، تم الحفظ محليا.",
    "toast.supabaseMessageFailed": "تعذر Supabase، تم حفظ الرسالة محليا.",
    "toast.supabasePatientFailed": "تعذر Supabase، تم حفظ المريض محليا.",
    "event.creationType": "إنشاء",
    "event.patientAdded": "تمت إضافة المريض للمتابعة",
    "event.patientCodeDetail": "رمز الدخول: {code}",
    "treatment.initialNote": "العلاج الأولي المدخل عند إنشاء المريض."
  }
};

const views = {
  doctor: {
    node: document.querySelector("#doctorView"),
    eyebrowKey: "views.doctorEyebrow",
    titleKey: "views.doctorTitle",
  },
  patient: {
    node: document.querySelector("#patientView"),
    eyebrowKey: "views.patientEyebrow",
    titleKey: "views.patientTitle",
  },
  messages: {
    node: document.querySelector("#messagesView"),
    eyebrowKey: "views.messagesEyebrow",
    titleKey: "views.messagesTitle",
  },
  database: {
    node: document.querySelector("#databaseView"),
    eyebrowKey: "views.databaseEyebrow",
    titleKey: "views.databaseTitle",
  },
};

let currentLang = loadLanguage();
let state = loadState();
let activeView = "doctor";
let selectedPatientId = state.patients[0]?.id ?? null;
let patientSessionId = null;
let statusFilter = "all";
let patientSearch = "";
let patientPage = 1;
let session = loadSession();
let dbConfig = loadDbConfig();
let showAuth = false;
let activeAuthRole = "doctor";
let heroAnimationId = null;

const els = {
  homeShell: document.querySelector("#homeShell"),
  homeHeroCanvas: document.querySelector("#homeHeroCanvas"),
  homeDoctorButton: document.querySelector("#homeDoctorButton"),
  homePatientButton: document.querySelector("#homePatientButton"),
  backHomeButton: document.querySelector("#backHomeButton"),
  authShell: document.querySelector("#authShell"),
  appShell: document.querySelector("#appShell"),
  authGrid: document.querySelector("#authGrid"),
  doctorLoginForm: document.querySelector("#doctorLoginForm"),
  patientLoginForm: document.querySelector("#patientLoginForm"),
  authDemoCodes: document.querySelector("#authDemoCodes"),
  navTabs: document.querySelectorAll(".nav-tab"),
  sectionEyebrow: document.querySelector("#sectionEyebrow"),
  sectionTitle: document.querySelector("#sectionTitle"),
  metricGrid: document.querySelector("#metricGrid"),
  addPatientForm: document.querySelector("#addPatientForm"),
  generateCodeButton: document.querySelector("#generateCodeButton"),
  patientSearch: document.querySelector("#patientSearch"),
  patientTable: document.querySelector("#patientTable"),
  patientPagination: document.querySelector("#patientPagination"),
  patientDetail: document.querySelector("#patientDetail"),
  patientCodeForm: document.querySelector("#patientCodeForm"),
  patientCode: document.querySelector("#patientCode"),
  demoCodes: document.querySelector("#demoCodes"),
  patientLoginPanel: document.querySelector("#patientLoginPanel"),
  questionnairePanel: document.querySelector("#questionnairePanel"),
  patientGreeting: document.querySelector("#patientGreeting"),
  dailyForm: document.querySelector("#dailyForm"),
  patientLogout: document.querySelector("#patientLogout"),
  patientFeedback: document.querySelector("#patientFeedback"),
  messagePatient: document.querySelector("#messagePatient"),
  messageForm: document.querySelector("#messageForm"),
  messageList: document.querySelector("#messageList"),
  dbStatus: document.querySelector("#dbStatus"),
  syncState: document.querySelector("#syncState"),
  refreshButton: document.querySelector("#refreshButton"),
  seedButton: document.querySelector("#seedButton"),
  logoutButton: document.querySelector("#logoutButton"),
  toast: document.querySelector("#toast"),
};

init();

function init() {
  bindLanguage();
  bindHome();
  bindAuth();
  bindNavigation();
  bindFilters();
  bindPatientAdmin();
  bindPatientSpace();
  bindMessages();
  bindGlobalActions();
  bindRangeOutputs();
  renderAll();
  if (hasRemoteConfig()) {
    loadRemoteData();
  }
}

function bindHome() {
  els.homeDoctorButton.addEventListener("click", () => {
    showAuth = true;
    activeAuthRole = "doctor";
    renderAll();
    els.doctorLoginForm.elements.email.focus();
  });

  els.homePatientButton.addEventListener("click", () => {
    showAuth = true;
    activeAuthRole = "patient";
    renderAll();
    els.patientLoginForm.elements.patientCode.focus();
  });

  els.backHomeButton.addEventListener("click", () => {
    showAuth = false;
    renderAll();
  });

  window.addEventListener("resize", () => drawHeroScene(performance.now()));
  startHeroScene();
}

function startHeroScene() {
  const animate = (time) => {
    drawHeroScene(time);
    heroAnimationId = requestAnimationFrame(animate);
  };
  if (!heroAnimationId) heroAnimationId = requestAnimationFrame(animate);
}

function drawHeroScene(time = 0) {
  const canvas = els.homeHeroCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f8fbfd";
  ctx.fillRect(0, 0, width, height);

  const drift = Math.sin(time / 1800) * 18;
  const baseX = currentLang === "ar" ? width * 0.18 : width * 0.72;
  const points = [
    [baseX, height * 0.1],
    [baseX + 90, height * 0.22],
    [baseX - 110 + drift, height * 0.38],
    [baseX + 70, height * 0.55],
    [baseX - 70, height * 0.72],
    [baseX + 30, height * 0.88],
  ];

  ctx.lineWidth = Math.max(28, width * 0.032);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(15, 139, 141, 0.12)";
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let index = 1; index < points.length; index += 1) {
    const [x, y] = points[index];
    const [px, py] = points[index - 1];
    ctx.quadraticCurveTo(px + (x - px) * 0.65, py + (y - py) * 0.18, x, y);
  }
  ctx.stroke();

  ctx.lineWidth = Math.max(5, width * 0.006);
  ctx.strokeStyle = "rgba(15, 139, 141, 0.42)";
  ctx.stroke();

  const pulse = (Math.sin(time / 420) + 1) / 2;
  const nodes = [
    [width * 0.18, height * 0.24, "#c1272d"],
    [width * 0.28, height * 0.6, "#006233"],
    [width * 0.82, height * 0.36, "#0f8b8d"],
    [width * 0.75, height * 0.76, "#3f6fb5"],
  ];
  nodes.forEach(([x, y, color], index) => {
    const radius = 5 + pulse * 4 + index;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  ctx.strokeStyle = "rgba(24, 33, 47, 0.07)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 58) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + width * 0.08, height);
    ctx.stroke();
  }
}

function bindLanguage() {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      currentLang = button.dataset.lang;
      localStorage.setItem(LANG_KEY, currentLang);
      renderAll();
    });
  });
}

function applyLanguage() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  document.title = t("app.title");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    node.setAttribute("title", t(node.dataset.i18nTitle));
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === currentLang);
  });
}

function t(key, params = {}) {
  const phrase = I18N[currentLang]?.[key] ?? I18N.fr[key] ?? key;
  return Object.entries(params).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    phrase,
  );
}

function loadLanguage() {
  const saved = localStorage.getItem(LANG_KEY);
  return saved === "ar" ? "ar" : "fr";
}

function bindAuth() {
  els.doctorLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(els.doctorLoginForm);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    if (email !== appConfig.doctorEmail.toLowerCase() || password !== appConfig.doctorPassword) {
      showToast(t("toast.doctorInvalid"));
      return;
    }
    session = { role: "doctor", signedInAt: new Date().toISOString() };
    showAuth = false;
    saveSession();
    activeView = "doctor";
    await ensureRemoteLoaded();
    renderAll();
    showToast(t("toast.doctorConnected"));
  });

  els.patientLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await ensureRemoteLoaded();
    const form = new FormData(els.patientLoginForm);
    const code = String(form.get("patientCode") || "").trim().toUpperCase();
    const patient = findPatientByCode(code);
    if (!patient) {
      showToast(t("toast.patientInvalid"));
      return;
    }
    session = { role: "patient", patientId: patient.id, signedInAt: new Date().toISOString() };
    showAuth = false;
    patientSessionId = patient.id;
    selectedPatientId = patient.id;
    saveSession();
    activeView = "patient";
    renderAll();
    showToast(t("toast.patientConnected"));
  });
}

function bindNavigation() {
  els.navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (!canAccessView(tab.dataset.view)) return;
      setView(tab.dataset.view);
    });
  });
}

function bindFilters() {
  document.querySelectorAll(".segment").forEach((button) => {
    button.addEventListener("click", () => {
      statusFilter = button.dataset.filter;
      patientPage = 1;
      document.querySelectorAll(".segment").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      renderDoctor();
    });
  });
}

function bindPatientAdmin() {
  els.patientSearch.addEventListener("input", () => {
    patientSearch = els.patientSearch.value;
    patientPage = 1;
    renderDoctor();
  });

  els.generateCodeButton.addEventListener("click", () => {
    els.addPatientForm.elements.code.value = generateUniquePatientCode();
  });

  els.addPatientForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!isDoctor()) return;

    const form = new FormData(els.addPatientForm);
    const code = normalizeCode(form.get("code"));
    if (!code) {
      showToast(t("toast.codeRequired"));
      return;
    }
    if (findPatientByCode(code)) {
      showToast(t("toast.codeExists"));
      return;
    }

    const patient = {
      id: createId("patient"),
      first_name: cleanText(form.get("first_name")),
      last_name: cleanText(form.get("last_name")),
      phone: cleanText(form.get("phone")),
      code,
      diagnosis: String(form.get("diagnosis") || "Crohn"),
      current_treatment: cleanText(form.get("current_treatment")),
      created_at: new Date().toISOString(),
    };

    if (!patient.first_name || !patient.last_name || !patient.phone || !patient.current_treatment) {
      showToast(t("toast.requiredPatientFields"));
      return;
    }

    await savePatient(patient);
    await saveTreatment({
      id: createId("treatment"),
      patient_id: patient.id,
      label: patient.current_treatment,
      start_date: dateOnly(new Date().toISOString()),
      end_date: null,
      notes: t("treatment.initialNote"),
      created_at: new Date().toISOString(),
    });
    await saveMedicalEvent({
      id: createId("event"),
      patient_id: patient.id,
      type: t("event.creationType"),
      title: t("event.patientAdded"),
      details: t("event.patientCodeDetail", { code: patient.code }),
      event_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });

    selectedPatientId = patient.id;
    patientPage = 1;
    els.addPatientForm.reset();
    els.addPatientForm.elements.code.value = generateUniquePatientCode();
    renderAll();
    showToast(t("toast.patientCreated", { name: patientFullName(patient) }));
  });

  els.addPatientForm.elements.code.value = generateUniquePatientCode();
}

function bindPatientSpace() {
  els.patientCodeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = els.patientCode.value.trim().toUpperCase();
    const patient = findPatientByCode(code);
    if (!patient) {
      showToast(t("toast.patientInvalid"));
      return;
    }
    patientSessionId = patient.id;
    selectedPatientId = patient.id;
    session = { role: "patient", patientId: patient.id, signedInAt: new Date().toISOString() };
    showAuth = false;
    saveSession();
    activeView = "patient";
    showToast(t("toast.patientConnected"));
    renderAll();
  });

  els.patientLogout.addEventListener("click", () => {
    logout();
  });

  els.dailyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!patientSessionId) return;

    const form = new FormData(els.dailyForm);
    const report = {
      id: createId("report"),
      patient_id: patientSessionId,
      treatment_taken: form.get("treatment_taken") === "on",
      stools: Number(form.get("stools") || 0),
      blood: form.get("blood") === "on",
      pain: Number(form.get("pain") || 0),
      fever: form.get("fever") === "on",
      fatigue: Number(form.get("fatigue") || 0),
      side_effects: String(form.get("side_effects") || "").trim(),
      general_state: String(form.get("general_state") || "good"),
      submitted_at: new Date().toISOString(),
    };
    report.score = calculateBaseScore(report);

    await saveReport(report);
    selectedPatientId = patientSessionId;
    renderAll();
    showToast(t("toast.reportSaved"));
  });
}

function bindRangeOutputs() {
  document.querySelectorAll('input[type="range"]').forEach((range) => {
    const output = document.querySelector(`[data-range-for="${range.name}"]`);
    const update = () => {
      if (output) output.textContent = range.value;
    };
    range.addEventListener("input", update);
    update();
  });
}

function bindMessages() {
  els.messageForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(els.messageForm);
    const patientId = String(form.get("patient_id") || "");
    const content = String(form.get("content") || "").trim();
    if (!patientId || !content) {
      showToast(t("toast.messageRequired"));
      return;
    }

    await saveMessage({
      id: createId("message"),
      patient_id: patientId,
      direction: "doctor_to_patient",
      content,
      created_at: new Date().toISOString(),
      read_at: null,
    });
    els.messageForm.reset();
    renderAll();
    showToast(t("toast.messageSent"));
  });
}

function bindGlobalActions() {
  els.refreshButton.addEventListener("click", async () => {
    if (hasRemoteConfig()) {
      await loadRemoteData();
    } else {
      renderAll();
      showToast(t("toast.localUpdated"));
    }
  });

  els.seedButton.addEventListener("click", () => {
    if (!isDoctor()) return;
    if (!confirm(t("toast.resetConfirm"))) return;
    state = createDemoData();
    saveLocalState();
    selectedPatientId = state.patients[0]?.id ?? null;
    patientSessionId = null;
    renderAll();
    showToast(t("toast.resetDone"));
  });

  els.logoutButton.addEventListener("click", logout);
}

function setView(viewName) {
  if (!canAccessView(viewName)) {
    viewName = defaultViewForSession();
  }
  activeView = viewName;
  Object.entries(views).forEach(([key, view]) => {
    view.node.classList.toggle("is-visible", key === viewName);
  });
  els.navTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === viewName));
  els.sectionEyebrow.textContent = t(views[viewName].eyebrowKey);
  els.sectionTitle.textContent = t(views[viewName].titleKey);
}

function renderAll() {
  applyLanguage();
  applyAccessState();
  renderAuthCodes();
  if (!session?.role) {
    updateSyncState();
    return;
  }
  setView(activeView);
  updateSyncState();
  if (isDoctor()) {
    renderDoctor();
    renderMessages();
    renderDatabase();
  }
  if (isPatient()) {
    patientSessionId = session.patientId;
    selectedPatientId = session.patientId;
  }
  renderPatient();
}

function applyAccessState() {
  const authenticated = Boolean(session?.role);
  els.homeShell.hidden = authenticated || showAuth;
  els.authShell.hidden = authenticated || !showAuth;
  els.appShell.hidden = !authenticated;
  els.doctorLoginForm.hidden = activeAuthRole !== "doctor";
  els.patientLoginForm.hidden = activeAuthRole !== "patient";
  els.authGrid.classList.add("is-single");
  els.refreshButton.hidden = !isDoctor();
  els.seedButton.hidden = !isDoctor();

  if (session?.role === "patient") {
    patientSessionId = session.patientId;
    selectedPatientId = session.patientId;
    activeView = "patient";
  }

  if (session?.role === "doctor" && !canAccessView(activeView)) {
    activeView = "doctor";
  }

  els.navTabs.forEach((tab) => {
    const allowed = canAccessView(tab.dataset.view);
    tab.hidden = !allowed;
    tab.classList.toggle("is-active", allowed && tab.dataset.view === activeView);
  });
}

function canAccessView(viewName) {
  if (session?.role === "patient") return viewName === "patient";
  if (session?.role === "doctor") return ["doctor", "messages", "database"].includes(viewName);
  return false;
}

function defaultViewForSession() {
  if (session?.role === "patient") return "patient";
  if (session?.role === "doctor") return "doctor";
  return "doctor";
}

function isDoctor() {
  return session?.role === "doctor";
}

function isPatient() {
  return session?.role === "patient";
}

function saveSession() {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function loadSession() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    if (saved?.role === "doctor") return saved;
    if (saved?.role === "patient" && saved.patientId) return saved;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
  }
  return null;
}

function logout() {
  session = null;
  patientSessionId = null;
  sessionStorage.removeItem(SESSION_KEY);
  activeView = "doctor";
  showAuth = false;
  renderAll();
  showToast(t("toast.logout"));
}

function renderAuthCodes() {
  if (!appConfig.showDemoHelpers) {
    els.authDemoCodes.innerHTML = "";
    return;
  }
  els.authDemoCodes.innerHTML = state.patients
    .slice(0, 4)
    .map((patient) => `<button class="code-chip" type="button" data-code="${escapeHtml(patient.code)}">${escapeHtml(patient.code)}</button>`)
    .join("");
  els.authDemoCodes.querySelectorAll(".code-chip").forEach((button) => {
    button.addEventListener("click", () => {
      els.patientLoginForm.elements.patientCode.value = button.dataset.code;
    });
  });
}

async function ensureRemoteLoaded() {
  if (!hasRemoteConfig()) return;
  await loadRemoteData({ quiet: true, skipRender: true });
}

function renderDoctor() {
  if (!isDoctor()) return;
  els.patientSearch.value = patientSearch;
  const analytics = state.patients.map((patient) => ({ patient, ...analyzePatient(patient) }));
  renderMetrics(analytics);
  renderPatientTable(analytics);
  renderPatientDetail();
}

function renderMetrics(analytics) {
  const redCount = analytics.filter((item) => item.status === "red").length;
  const reports24h = state.reports.filter((report) => hoursSince(report.submitted_at) <= 24).length;
  const adherenceValues = analytics.map((item) => item.adherence).filter((value) => Number.isFinite(value));
  const avgAdherence = Math.round(
    adherenceValues.reduce((sum, value) => sum + value, 0) / Math.max(1, adherenceValues.length),
  );

  const metrics = [
    { label: t("metrics.totalPatients"), value: state.patients.length, hint: t("metrics.totalPatientsHint") },
    { label: t("metrics.redAlerts"), value: redCount, hint: t("metrics.redAlertsHint") },
    { label: t("metrics.avgAdherence"), value: `${avgAdherence}%`, hint: t("metrics.avgAdherenceHint") },
    { label: t("metrics.reports24h"), value: reports24h, hint: t("metrics.reports24hHint") },
  ];

  els.metricGrid.innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric">
          <span>${escapeHtml(metric.label)}</span>
          <strong>${escapeHtml(String(metric.value))}</strong>
          <small>${escapeHtml(metric.hint)}</small>
        </article>
      `,
    )
    .join("");
}

function renderPatientTable(analytics) {
  const rank = { red: 0, orange: 1, green: 2 };
  const filteredRows = analytics
    .filter((item) => statusFilter === "all" || item.status === statusFilter)
    .filter((item) => patientMatchesSearch(item.patient, patientSearch))
    .sort((a, b) => rank[a.status] - rank[b.status] || b.score - a.score);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  patientPage = Math.min(Math.max(1, patientPage), totalPages);
  const startIndex = (patientPage - 1) * PAGE_SIZE;
  const rows = filteredRows.slice(startIndex, startIndex + PAGE_SIZE);

  els.patientTable.innerHTML = `
    <div class="table-header" aria-hidden="true">
      <span>${t("table.patient")}</span>
      <span>${t("table.phone")}</span>
      <span>${t("table.diagnosis")}</span>
      <span>${t("table.treatment")}</span>
      <span>${t("table.adherence")}</span>
      <span>${t("table.symptoms")}</span>
      <span>${t("table.lastActivity")}</span>
    </div>
    ${
      rows.length
        ? rows
            .map(
              ({ patient, status, label, adherence, symptoms, lastActivity }) => `
          <button class="patient-row ${patient.id === selectedPatientId ? "is-selected" : ""}" data-patient-id="${escapeHtml(patient.id)}">
            <span class="patient-code">
              <span class="patient-code-main">
                <span class="status-dot ${status}"></span>
                ${escapeHtml(patientFullName(patient))}
              </span>
              <small>${escapeHtml(patient.code)}</small>
            </span>
            <span>${escapeHtml(patient.phone || "-")}</span>
            <span>${escapeHtml(patient.diagnosis)}</span>
            <span>${escapeHtml(patient.current_treatment)}</span>
            <span>${adherence}%</span>
            <span>${escapeHtml(symptoms)}</span>
            <span>
              <span class="status-pill ${status}">
                <span class="status-dot ${status}"></span>${escapeHtml(label)}
              </span>
              <small class="muted">${escapeHtml(lastActivity)}</small>
            </span>
          </button>
        `,
            )
            .join("")
        : `<div class="timeline-item">${t("table.noResults")}</div>`
    }
  `;

  els.patientTable.querySelectorAll(".patient-row").forEach((row) => {
    row.addEventListener("click", () => {
      selectedPatientId = row.dataset.patientId;
      renderDoctor();
    });
  });

  renderPagination(filteredRows.length, totalPages);
}

function renderPagination(totalRows, totalPages) {
  const start = totalRows === 0 ? 0 : (patientPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(totalRows, patientPage * PAGE_SIZE);
  const plural = currentLang === "fr" && totalRows > 1 ? "s" : "";
  els.patientPagination.innerHTML = `
    <span class="muted">${t("pagination.summary", { start, end, total: totalRows, plural })}</span>
    <div class="pagination-actions">
      <button type="button" data-page-action="prev" ${patientPage <= 1 ? "disabled" : ""}>‹</button>
      <button type="button" data-page-action="next" ${patientPage >= totalPages ? "disabled" : ""}>›</button>
    </div>
  `;

  els.patientPagination.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      patientPage += button.dataset.pageAction === "next" ? 1 : -1;
      renderDoctor();
    });
  });
}

function renderPatientDetail() {
  const patient = state.patients.find((item) => item.id === selectedPatientId) ?? state.patients[0];
  if (!patient) {
    els.patientDetail.innerHTML = `<div class="detail-body"><p>${t("detail.noPatient")}</p></div>`;
    return;
  }
  selectedPatientId = patient.id;
  const analysis = analyzePatient(patient);
  const reports = getReports(patient.id);
  const treatments = state.treatments.filter((item) => item.patient_id === patient.id);
  const events = state.medical_events.filter((item) => item.patient_id === patient.id);

  els.patientDetail.innerHTML = `
    <div class="panel-header">
      <div>
        <h2>${escapeHtml(patientFullName(patient))}</h2>
        <p>${escapeHtml(patient.code)} · ${escapeHtml(patient.phone || t("patient.noPhone"))} · ${escapeHtml(patient.diagnosis)}</p>
      </div>
      <span class="status-pill ${analysis.status}">
        <span class="status-dot ${analysis.status}"></span>${escapeHtml(analysis.label)}
      </span>
    </div>
    <div class="detail-body">
      <div class="detail-summary">
        <div>
          <h3>${t("detail.currentTreatment")}</h3>
          <div class="timeline-item">${escapeHtml(patient.current_treatment)}</div>
          <h3>${t("detail.alerts")}</h3>
          <div class="alert-list">
            ${analysis.reasons
              .map(
                (reason) => `
                  <div class="alert-item ${analysis.status === "orange" ? "orange" : ""}">
                    ${escapeHtml(reason)}
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="score-block">
          <div>
            <strong>${analysis.score}</strong>
            <span>${t("detail.clinicalScore")}</span>
          </div>
        </div>
      </div>

      <div class="chart-grid">
        ${chartTile(t("detail.stools"), "stoolsChart")}
        ${chartTile(t("detail.pain"), "painChart")}
        ${chartTile(t("detail.fatigue"), "fatigueChart")}
        ${chartTile(t("detail.adherence"), "adherenceChart")}
      </div>

      <div>
        <h3>${t("detail.treatmentHistory")}</h3>
        <div class="treatment-list">
          ${treatments
            .map(
              (item) => `
                <div class="treatment-item">
                  <strong>${escapeHtml(item.label)}</strong>
                  <time>${formatDate(item.start_date)}${item.end_date ? ` - ${formatDate(item.end_date)}` : ` - ${t("detail.inProgress")}`}</time>
                  <span class="muted">${escapeHtml(item.notes || "")}</span>
                </div>
              `,
            )
            .join("")}
        </div>
      </div>

      <div>
        <h3>${t("detail.medicalTimeline")}</h3>
        <div class="timeline">
          ${events
            .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
            .map(
              (event) => `
                <div class="timeline-item">
                  <strong>${escapeHtml(event.title)}</strong>
                  <time>${formatDateTime(event.event_date)} · ${escapeHtml(event.type)}</time>
                  <span class="muted">${escapeHtml(event.details || "")}</span>
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  drawCharts(reports);
}

function chartTile(label, id) {
  return `
    <div class="chart-tile">
      <span>${label}</span>
      <canvas id="${id}" width="320" height="120" aria-label="${label}"></canvas>
    </div>
  `;
}

function drawCharts(reports) {
  const recent = reports.slice(-10);
  drawLineChart(document.querySelector("#stoolsChart"), recent.map((item) => item.stools), "#3f6fb5", 12);
  drawLineChart(document.querySelector("#painChart"), recent.map((item) => item.pain), "#b55f79", 10);
  drawLineChart(document.querySelector("#fatigueChart"), recent.map((item) => item.fatigue), "#d98b12", 10);
  drawLineChart(
    document.querySelector("#adherenceChart"),
    recent.map((item) => (item.treatment_taken ? 100 : 0)),
    "#1f9d63",
    100,
  );
}

function drawLineChart(canvas, values, color, maxValue) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 320;
  const height = canvas.clientHeight || 104;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "#dce2ea";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, height - 18);
  ctx.lineTo(width, height - 18);
  ctx.stroke();

  if (!values.length) return;

  const pad = 10;
  const innerWidth = Math.max(1, width - pad * 2);
  const innerHeight = Math.max(1, height - pad * 2 - 8);
  const step = values.length === 1 ? innerWidth : innerWidth / (values.length - 1);
  const points = values.map((value, index) => {
    const normalized = Math.max(0, Math.min(1, value / maxValue));
    return {
      x: pad + step * index,
      y: pad + innerHeight - normalized * innerHeight,
    };
  });

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  ctx.fillStyle = color;
  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderPatient() {
  els.demoCodes.innerHTML = state.patients
    .map((patient) => `<button class="code-chip" data-code="${escapeHtml(patient.code)}">${escapeHtml(patient.code)}</button>`)
    .join("");
  els.demoCodes.querySelectorAll(".code-chip").forEach((button) => {
    button.addEventListener("click", () => {
      els.patientCode.value = button.dataset.code;
      els.patientCodeForm.requestSubmit();
    });
  });

  const patient = state.patients.find((item) => item.id === patientSessionId);
  els.patientLoginPanel.hidden = Boolean(patient) || isPatient();
  els.questionnairePanel.hidden = !patient;
  if (patient) {
    els.patientGreeting.textContent = `${patientFullName(patient)} · ${patient.code} · ${patient.diagnosis}`;
  }
  renderPatientFeedback(patient);
}

function renderPatientFeedback(patient) {
  const activePatient = patient ?? state.patients.find((item) => item.id === patientSessionId) ?? null;
  if (!activePatient) {
    els.patientFeedback.innerHTML = `<p>${t("feedback.connectPrompt")}</p>`;
    return;
  }
  const analysis = analyzePatient(activePatient);
  const latest = getReports(activePatient.id).at(-1);
  const messages = state.messages
    .filter((message) => message.patient_id === activePatient.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  const recommendation =
    analysis.status === "red"
      ? t("feedback.redAdvice")
      : analysis.status === "orange"
        ? t("feedback.orangeAdvice")
        : t("feedback.greenAdvice");

  els.patientFeedback.innerHTML = `
    <div class="feedback-card">
      <div class="feedback-status ${analysis.status}">
        <div>
          <strong>${escapeHtml(patientFeedbackTitle(analysis.status))}</strong>
          <div>${escapeHtml(recommendation)}</div>
        </div>
        <span>${analysis.score}/15</span>
      </div>
      <div class="timeline-item">
        <strong>${t("feedback.lastFollowup")}</strong>
        <time>${latest ? formatDateTime(latest.submitted_at) : t("feedback.noQuestionnaire")}</time>
        <span class="muted">${escapeHtml(analysis.symptoms)}</span>
      </div>
      <div>
        <h3>${t("feedback.notifications")}</h3>
        <div class="timeline">
          ${buildPatientNotifications(activePatient, analysis)
            .map((item) => `<div class="timeline-item">${escapeHtml(item)}</div>`)
            .join("")}
        </div>
      </div>
      <div>
        <h3>${t("feedback.doctorMessages")}</h3>
        <div class="message-list">
          ${
            messages.length
              ? messages
                  .map(
                    (message) => `
                      <div class="message-item">
                        <strong>${message.direction === "doctor_to_patient" ? t("message.doctor") : t("message.patient")}</strong>
                        <span>${escapeHtml(message.content)}</span>
                        <time>${formatDateTime(message.created_at)}</time>
                      </div>
                    `,
                  )
                  .join("")
              : `<div class="message-item"><span class="muted">${t("feedback.noRecentMessage")}</span></div>`
          }
        </div>
      </div>
    </div>
  `;
}

function renderMessages() {
  if (!isDoctor()) return;
  els.messagePatient.innerHTML = state.patients
    .map(
      (patient) =>
        `<option value="${escapeHtml(patient.id)}">${escapeHtml(patientFullName(patient))} · ${escapeHtml(patient.code)}</option>`,
    )
    .join("");

  const items = [...state.messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  els.messageList.innerHTML = items.length
    ? items
        .map((message) => {
          const patient = state.patients.find((item) => item.id === message.patient_id);
          return `
            <div class="message-item">
              <strong>${escapeHtml(patient ? `${patientFullName(patient)} · ${patient.code}` : t("message.patient"))} · ${message.direction === "doctor_to_patient" ? t("message.doctor") : t("message.patient")}</strong>
              <span>${escapeHtml(message.content)}</span>
              <time>${formatDateTime(message.created_at)}</time>
            </div>
          `;
        })
        .join("")
    : `<div class="message-item"><span class="muted">${t("message.none")}</span></div>`;
}

function patientMatchesSearch(patient, query) {
  const term = normalizeSearch(query);
  if (!term) return true;
  const haystack = normalizeSearch(
    [patient.first_name, patient.last_name, patient.code, patient.phone].filter(Boolean).join(" "),
  );
  const digitTerm = digitsOnly(query);
  return haystack.includes(term) || (digitTerm.length >= 3 && digitsOnly(patient.phone).includes(digitTerm));
}

function patientFullName(patient) {
  return [patient.first_name, patient.last_name].filter(Boolean).join(" ") || patient.code;
}

function findPatientByCode(code) {
  const normalizedCode = normalizeCode(code);
  return state.patients.find((patient) => normalizeCode(patient.code) === normalizedCode);
}

function normalizeCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "-");
}

function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}+]+/gu, " ")
    .trim();
}

function cleanText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function generateUniquePatientCode() {
  let code = "";
  do {
    code = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
  } while (findPatientByCode(code));
  return code;
}

function analyzePatient(patient) {
  const reports = getReports(patient.id);
  const latest = reports.at(-1);
  const adherence = calculateAdherence(reports);
  const reasons = [];
  let score = latest ? calculateBaseScore(latest) : 3;

  if (!latest) {
    reasons.push(t("alerts.noQuestionnaire"));
  } else {
    if (latest.blood) reasons.push(t("alerts.blood"));
    if (latest.fever) reasons.push(t("alerts.fever"));
    if (latest.pain >= 7) reasons.push(t("alerts.highPain"));
    if (latest.stools >= 8) reasons.push(t("alerts.highStools"));
    if (latest.fatigue >= 8) reasons.push(t("alerts.highFatigue"));
    if (!latest.treatment_taken) reasons.push(t("alerts.missedTreatment"));
    if (latest.side_effects) reasons.push(t("alerts.sideEffects", { value: latest.side_effects }));

    const staleDays = daysSince(latest.submitted_at);
    if (staleDays >= 2) {
      score += 2;
      reasons.push(t("alerts.stale"));
    }
  }

  if (adherence < 70) {
    score += 2;
    reasons.push(t("alerts.lowAdherence"));
  }

  if (detectWorseningTrend(reports)) {
    score += 2;
    reasons.push(t("alerts.worsening"));
  }

  score = Math.min(15, score);

  let status = "green";
  let label = t("status.green");
  if (score >= 8) {
    status = "red";
    label = t("status.red");
  } else if (score >= 4) {
    status = "orange";
    label = t("status.orange");
  }

  if (!reasons.length) reasons.push(t("alerts.noWorsening"));

  return {
    status,
    label,
    score,
    adherence,
    reasons,
    symptoms: summarizeSymptoms(latest),
    lastActivity: latest ? relativeTime(latest.submitted_at) : t("status.never"),
  };
}

function calculateBaseScore(report) {
  let score = 0;
  if (report.stools >= 10) score += 3;
  else if (report.stools >= 6) score += 2;
  else if (report.stools >= 4) score += 1;
  if (report.blood) score += 3;
  if (report.pain >= 8) score += 3;
  else if (report.pain >= 5) score += 2;
  else if (report.pain >= 3) score += 1;
  if (report.fever) score += 3;
  if (report.fatigue >= 8) score += 2;
  else if (report.fatigue >= 5) score += 1;
  if (!report.treatment_taken) score += 2;
  if (report.general_state === "bad") score += 2;
  if (report.general_state === "medium") score += 1;
  if (report.side_effects) score += 1;
  return Math.min(15, score);
}

function calculateAdherence(reports) {
  const recent = reports.filter((report) => daysSince(report.submitted_at) <= 14);
  if (!recent.length) return 0;
  const taken = recent.filter((report) => report.treatment_taken).length;
  return Math.round((taken / recent.length) * 100);
}

function detectWorseningTrend(reports) {
  if (reports.length < 6) return false;
  const lastThree = reports.slice(-3);
  const previousThree = reports.slice(-6, -3);
  const severity = (items) =>
    items.reduce((sum, item) => sum + item.stools * 0.8 + item.pain + item.fatigue + (item.blood ? 3 : 0), 0) /
    items.length;
  return severity(lastThree) - severity(previousThree) >= 3;
}

function summarizeSymptoms(report) {
  if (!report) return t("detail.noRecentSymptoms");
  const parts = [
    t("symptoms.stools", { count: report.stools }),
    t("symptoms.pain", { value: report.pain }),
    t("symptoms.fatigue", { value: report.fatigue }),
  ];
  if (report.blood) parts.push(t("symptoms.blood"));
  if (report.fever) parts.push(t("symptoms.fever"));
  return parts.join(" · ");
}

function patientFeedbackTitle(status) {
  if (status === "red") return t("feedback.redTitle");
  if (status === "orange") return t("feedback.orangeTitle");
  return t("feedback.greenTitle");
}

function buildPatientNotifications(patient, analysis) {
  const notifications = [];
  const reports = getReports(patient.id);
  const latest = reports.at(-1);
  if (!latest || daysSince(latest.submitted_at) >= 1) notifications.push(t("notifications.questionnaire"));
  if (!latest?.treatment_taken) notifications.push(t("notifications.treatment"));
  if (analysis.status === "red") notifications.push(t("notifications.priority"));
  if (!notifications.length) notifications.push(t("notifications.none"));
  return notifications;
}

function getReports(patientId) {
  return state.reports
    .filter((report) => report.patient_id === patientId)
    .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));
}

async function saveReport(report) {
  if (hasRemoteConfig()) {
    try {
      await insertRemote("daily_reports", report);
      await loadRemoteData({ quiet: true });
      return;
    } catch (error) {
      console.error(error);
      showToast(t("toast.supabaseReportFailed"));
    }
  }
  state.reports.push(report);
  saveLocalState();
}

async function saveMessage(message) {
  if (hasRemoteConfig()) {
    try {
      await insertRemote("messages", message);
      await loadRemoteData({ quiet: true });
      return;
    } catch (error) {
      console.error(error);
      showToast(t("toast.supabaseMessageFailed"));
    }
  }
  state.messages.push(message);
  saveLocalState();
}

async function savePatient(patient) {
  if (hasRemoteConfig()) {
    try {
      await insertRemote("patients", patient);
      await loadRemoteData({ quiet: true });
      return;
    } catch (error) {
      console.error(error);
      showToast(t("toast.supabasePatientFailed"));
    }
  }
  state.patients.push(patient);
  saveLocalState();
}

async function saveTreatment(treatment) {
  if (hasRemoteConfig()) {
    try {
      await insertRemote("treatments", treatment);
      await loadRemoteData({ quiet: true });
      return;
    } catch (error) {
      console.error(error);
    }
  }
  state.treatments.push(treatment);
  saveLocalState();
}

async function saveMedicalEvent(event) {
  if (hasRemoteConfig()) {
    try {
      await insertRemote("medical_events", event);
      await loadRemoteData({ quiet: true });
      return;
    } catch (error) {
      console.error(error);
    }
  }
  state.medical_events.push(event);
  saveLocalState();
}

async function loadRemoteData(options = {}) {
  if (!hasRemoteConfig()) return;
  try {
    updateSyncState(t("sync.loading"));
    const [patients, reports, treatments, events, messages] = await Promise.all([
      fetchRemote("patients", "created_at.asc"),
      fetchRemote("daily_reports", "submitted_at.asc"),
      fetchRemote("treatments", "start_date.asc"),
      fetchRemote("medical_events", "event_date.asc"),
      fetchRemote("messages", "created_at.desc"),
    ]);
    state = migrateState({
      patients: normalizeRows(patients),
      reports: normalizeRows(reports),
      treatments: normalizeRows(treatments),
      medical_events: normalizeRows(events),
      messages: normalizeRows(messages),
    });
    if (!state.patients.length) {
      showToast(t("toast.remoteEmpty"));
    }
    selectedPatientId = selectedPatientId && state.patients.some((item) => item.id === selectedPatientId)
      ? selectedPatientId
      : state.patients[0]?.id ?? null;
    patientSessionId = patientSessionId && state.patients.some((item) => item.id === patientSessionId)
      ? patientSessionId
      : null;
    if (!options.skipRender) renderAll();
    if (!options.quiet) showToast(t("toast.remoteSynced"));
  } catch (error) {
    console.error(error);
    updateSyncState(t("sync.failed"));
    showToast(t("toast.remoteReadFailed"));
  }
}

async function fetchRemote(table, order) {
  const url = `${dbConfig.url}/rest/v1/${table}?select=*&order=${encodeURIComponent(order)}`;
  const response = await fetch(url, {
    headers: remoteHeaders(),
  });
  if (!response.ok) throw new Error(`${table}: ${response.status}`);
  return response.json();
}

async function insertRemote(table, row) {
  const response = await fetch(`${dbConfig.url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      ...remoteHeaders(),
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });
  if (!response.ok) throw new Error(`${table}: ${response.status}`);
  return response.json();
}

function remoteHeaders() {
  return {
    apikey: dbConfig.key,
    Authorization: `Bearer ${dbConfig.key}`,
  };
}

function normalizeRows(rows) {
  return rows.map((row) => ({ ...row }));
}

function hasRemoteConfig() {
  return Boolean(dbConfig?.url && dbConfig?.key);
}

function updateSyncState(customText) {
  const dotClass = hasRemoteConfig() ? "green" : "neutral";
  const text = customText || (hasRemoteConfig() ? t("sync.remote") : t("sync.local"));
  els.syncState.innerHTML = `<span class="status-dot ${dotClass}"></span><span>${escapeHtml(text)}</span>`;
}

function renderDatabase() {
  if (!els.dbStatus || !isDoctor()) return;
  const urlText = dbConfig?.url ? maskUrl(dbConfig.url) : t("database.notConfigured");
  const keyText = dbConfig?.key ? `${dbConfig.key.slice(0, 8)}…${dbConfig.key.slice(-6)}` : t("database.notConfigured");
  els.dbStatus.innerHTML = `
    <div class="db-status-row">
      <strong>${t("database.mode")}</strong>
      <span>${hasRemoteConfig() ? t("database.remoteMode") : t("database.localMode")}</span>
    </div>
    <div class="db-status-row">
      <strong>${t("database.projectUrl")}</strong>
      <span>${escapeHtml(urlText)}</span>
    </div>
    <div class="db-status-row">
      <strong>${t("database.anonKey")}</strong>
      <span>${escapeHtml(keyText)}</span>
    </div>
    <div class="timeline-item">
      ${t("database.configInstruction")}
    </div>
  `;
}

function loadAppConfig() {
  const raw = globalThis.MICI_CONFIG || {};
  const doctor = raw.doctor || {};
  return {
    supabaseUrl: raw.supabaseUrl || raw.SUPABASE_URL || "",
    supabaseAnonKey: raw.supabaseAnonKey || raw.SUPABASE_ANON_KEY || "",
    doctorEmail: doctor.email || raw.doctorEmail || "medecin@mici.local",
    doctorPassword: doctor.password || raw.doctorPassword || "demo1234",
    showDemoHelpers: Boolean(raw.showDemoHelpers),
  };
}

function loadDbConfig() {
  const url = String(appConfig.supabaseUrl || "").trim().replace(/\/$/, "");
  const key = String(appConfig.supabaseAnonKey || "").trim();
  return url && key ? { url, key } : null;
}

function maskUrl(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}`;
  } catch {
    return url;
  }
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.patients?.length) return migrateState(saved);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  const demo = createDemoData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
  return demo;
}

function saveLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function migrateState(input) {
  const fallbackNames = [
    ["Youssef", "Benali", "+212 600 100 204"],
    ["Meryem", "El Fassi", "+212 600 100 319"],
    ["Karim", "Alaoui", "+212 600 100 772"],
    ["Nadia", "Bennani", "+212 600 100 880"],
  ];
  return {
    patients: (input.patients || []).map((patient, index) => {
      const [firstName, lastName, phone] = fallbackNames[index % fallbackNames.length];
      return {
        ...patient,
        first_name: patient.first_name || firstName,
        last_name: patient.last_name || lastName,
        phone: patient.phone || phone,
      };
    }),
    reports: input.reports || [],
    treatments: input.treatments || [],
    medical_events: input.medical_events || [],
    messages: input.messages || [],
  };
}

function createDemoData() {
  const patients = [
    {
      id: "patient-001",
      first_name: "Youssef",
      last_name: "Benali",
      phone: "+212 600 100 204",
      code: "PAT-2048",
      diagnosis: "Crohn",
      current_treatment: "Biothérapie anti-TNF",
      created_at: daysAgoIso(48),
    },
    {
      id: "patient-002",
      first_name: "Meryem",
      last_name: "El Fassi",
      phone: "+212 600 100 319",
      code: "PAT-3190",
      diagnosis: "RCH",
      current_treatment: "Mésalazine + CTC décroissance",
      created_at: daysAgoIso(42),
    },
    {
      id: "patient-003",
      first_name: "Karim",
      last_name: "Alaoui",
      phone: "+212 600 100 772",
      code: "PAT-7721",
      diagnosis: "Crohn",
      current_treatment: "Ustékinumab",
      created_at: daysAgoIso(30),
    },
    {
      id: "patient-004",
      first_name: "Nadia",
      last_name: "Bennani",
      phone: "+212 600 100 880",
      code: "PAT-8805",
      diagnosis: "RCH",
      current_treatment: "Vedolizumab",
      created_at: daysAgoIso(18),
    },
  ];

  const reportPatterns = {
    "patient-001": [
      [3, false, 2, false, 3, true, "good", ""],
      [2, false, 1, false, 2, true, "good", ""],
      [3, false, 2, false, 3, true, "good", ""],
      [2, false, 1, false, 2, true, "good", ""],
      [3, false, 2, false, 2, true, "good", ""],
      [3, false, 1, false, 2, true, "good", ""],
      [2, false, 1, false, 2, true, "good", ""],
    ],
    "patient-002": [
      [4, false, 3, false, 4, true, "medium", ""],
      [5, false, 4, false, 5, true, "medium", ""],
      [5, false, 4, false, 5, true, "medium", ""],
      [6, false, 5, false, 6, true, "medium", "nausées légères"],
      [7, true, 5, false, 6, true, "medium", ""],
      [7, false, 6, false, 7, false, "medium", ""],
      [8, false, 6, false, 7, true, "medium", ""],
    ],
    "patient-003": [
      [5, false, 4, false, 6, true, "medium", ""],
      [7, true, 6, false, 7, false, "medium", ""],
      [9, true, 8, true, 8, false, "bad", "céphalées et nausées"],
      [10, true, 8, true, 9, false, "bad", ""],
      [11, true, 9, true, 9, true, "bad", ""],
    ],
    "patient-004": [
      [3, false, 2, false, 3, true, "good", ""],
      [3, false, 2, false, 4, true, "good", ""],
      [4, false, 3, false, 4, true, "medium", ""],
      [3, false, 2, false, 3, true, "good", ""],
      [3, false, 2, false, 3, true, "good", ""],
      [2, false, 1, false, 2, true, "good", ""],
    ],
  };

  const reports = Object.entries(reportPatterns).flatMap(([patientId, pattern]) => {
    const offset = pattern.length - 1;
    return pattern.map(([stools, blood, pain, fever, fatigue, treatmentTaken, generalState, sideEffects], index) => {
      const report = {
        id: createId(`report-${patientId}-${index}`),
        patient_id: patientId,
        treatment_taken: treatmentTaken,
        stools,
        blood,
        pain,
        fever,
        fatigue,
        side_effects: sideEffects,
        general_state: generalState,
        submitted_at: daysAgoIso(offset - index, 8 + (index % 4)),
      };
      report.score = calculateBaseScore(report);
      return report;
    });
  });

  const treatments = [
    {
      id: "treatment-001",
      patient_id: "patient-001",
      label: "Anti-TNF 40 mg toutes les 2 semaines",
      start_date: dateOnly(daysAgoIso(120)),
      end_date: null,
      notes: "Bonne tolérance, observance satisfaisante.",
    },
    {
      id: "treatment-002",
      patient_id: "patient-002",
      label: "Mésalazine 4 g/j",
      start_date: dateOnly(daysAgoIso(90)),
      end_date: null,
      notes: "CTC ajouté lors de la dernière poussée.",
    },
    {
      id: "treatment-003",
      patient_id: "patient-003",
      label: "Ustékinumab 90 mg",
      start_date: dateOnly(daysAgoIso(65)),
      end_date: null,
      notes: "Réévaluation nécessaire si symptômes persistants.",
    },
    {
      id: "treatment-004",
      patient_id: "patient-004",
      label: "Vedolizumab entretien",
      start_date: dateOnly(daysAgoIso(150)),
      end_date: null,
      notes: "Rémission clinique partielle.",
    },
  ];

  const medical_events = [
    {
      id: "event-001",
      patient_id: "patient-001",
      type: "Consultation",
      title: "Contrôle trimestriel",
      event_date: daysAgoIso(18, 11),
      details: "Score bas, poursuite du traitement.",
    },
    {
      id: "event-002",
      patient_id: "patient-002",
      type: "Alerte",
      title: "Augmentation du transit",
      event_date: daysAgoIso(2, 15),
      details: "Surveillance renforcée pendant 72 h.",
    },
    {
      id: "event-003",
      patient_id: "patient-003",
      type: "Alerte rouge",
      title: "Sang, fièvre et douleur",
      event_date: daysAgoIso(0, 9),
      details: "Contact recommandé et bilan biologique à discuter.",
    },
    {
      id: "event-004",
      patient_id: "patient-004",
      type: "Bilan",
      title: "Calprotectine demandée",
      event_date: daysAgoIso(9, 10),
      details: "Suivi de réponse au traitement.",
    },
  ];

  const messages = [
    {
      id: "message-001",
      patient_id: "patient-003",
      direction: "doctor_to_patient",
      content: "Merci de contacter le cabinet aujourd’hui pour organiser une évaluation.",
      created_at: daysAgoIso(0, 10),
      read_at: null,
    },
    {
      id: "message-002",
      patient_id: "patient-002",
      direction: "doctor_to_patient",
      content: "Continuez le questionnaire quotidien, nous surveillons l’évolution.",
      created_at: daysAgoIso(1, 12),
      read_at: null,
    },
  ];

  return { patients, reports, treatments, medical_events, messages };
}

function createId(prefix) {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function daysAgoIso(days, hour = 9) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 15, 0, 0);
  return date.toISOString();
}

function dateOnly(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function daysSince(value) {
  return Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000);
}

function hoursSince(value) {
  return (Date.now() - new Date(value).getTime()) / 3_600_000;
}

function relativeTime(value) {
  const hours = Math.max(0, Math.round(hoursSince(value)));
  if (hours < 1) return t("status.now");
  if (hours < 24) return t("status.hoursAgo", { count: hours });
  const days = Math.floor(hours / 24);
  return t("status.daysAgo", { count: days });
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat(currentLang === "ar" ? "ar-MA" : "fr-FR", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat(currentLang === "ar" ? "ar-MA" : "fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => els.toast.classList.remove("is-visible"), 2600);
}
