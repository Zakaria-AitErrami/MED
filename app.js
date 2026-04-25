const STORAGE_KEY = "mici-suivi-state-v1";
const SESSION_KEY = "mici-suivi-session-v1";
const PAGE_SIZE = 5;

const appConfig = loadAppConfig();

const views = {
  doctor: {
    node: document.querySelector("#doctorView"),
    eyebrow: "Dashboard médecin",
    title: "Suivi intelligent des patients MICI",
  },
  patient: {
    node: document.querySelector("#patientView"),
    eyebrow: "Espace patient",
    title: "Questionnaire quotidien et feedback immédiat",
  },
  messages: {
    node: document.querySelector("#messagesView"),
    eyebrow: "Communication",
    title: "Messages sécurisés médecin-patient",
  },
  database: {
    node: document.querySelector("#databaseView"),
    eyebrow: "Base distante",
    title: "Connexion PostgreSQL distante via Supabase",
  },
};

let state = loadState();
let activeView = "doctor";
let selectedPatientId = state.patients[0]?.id ?? null;
let patientSessionId = null;
let statusFilter = "all";
let patientSearch = "";
let patientPage = 1;
let session = loadSession();
let dbConfig = loadDbConfig();

const els = {
  authShell: document.querySelector("#authShell"),
  appShell: document.querySelector("#appShell"),
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

function bindAuth() {
  els.doctorLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(els.doctorLoginForm);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    if (email !== appConfig.doctorEmail.toLowerCase() || password !== appConfig.doctorPassword) {
      showToast("Email ou mot de passe médecin incorrect.");
      return;
    }
    session = { role: "doctor", signedInAt: new Date().toISOString() };
    saveSession();
    activeView = "doctor";
    await ensureRemoteLoaded();
    renderAll();
    showToast("Connexion médecin active.");
  });

  els.patientLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await ensureRemoteLoaded();
    const form = new FormData(els.patientLoginForm);
    const code = String(form.get("patientCode") || "").trim().toUpperCase();
    const patient = findPatientByCode(code);
    if (!patient) {
      showToast("Code patient introuvable.");
      return;
    }
    session = { role: "patient", patientId: patient.id, signedInAt: new Date().toISOString() };
    patientSessionId = patient.id;
    selectedPatientId = patient.id;
    saveSession();
    activeView = "patient";
    renderAll();
    showToast("Connexion patient active.");
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
      showToast("Le code patient est obligatoire.");
      return;
    }
    if (findPatientByCode(code)) {
      showToast("Ce code patient existe déjà.");
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
      showToast("Nom, prénom, téléphone et traitement sont obligatoires.");
      return;
    }

    await savePatient(patient);
    await saveTreatment({
      id: createId("treatment"),
      patient_id: patient.id,
      label: patient.current_treatment,
      start_date: dateOnly(new Date().toISOString()),
      end_date: null,
      notes: "Traitement initial saisi à la création du patient.",
      created_at: new Date().toISOString(),
    });
    await saveMedicalEvent({
      id: createId("event"),
      patient_id: patient.id,
      type: "Création",
      title: "Patient ajouté au suivi",
      details: `Code d’accès: ${patient.code}`,
      event_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });

    selectedPatientId = patient.id;
    patientPage = 1;
    els.addPatientForm.reset();
    els.addPatientForm.elements.code.value = generateUniquePatientCode();
    renderAll();
    showToast(`Patient ${patientFullName(patient)} créé.`);
  });

  els.addPatientForm.elements.code.value = generateUniquePatientCode();
}

function bindPatientSpace() {
  els.patientCodeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = els.patientCode.value.trim().toUpperCase();
    const patient = findPatientByCode(code);
    if (!patient) {
      showToast("Code patient introuvable.");
      return;
    }
    patientSessionId = patient.id;
    selectedPatientId = patient.id;
    session = { role: "patient", patientId: patient.id, signedInAt: new Date().toISOString() };
    saveSession();
    activeView = "patient";
    showToast("Connexion patient active.");
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
    showToast("Questionnaire enregistré.");
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
      showToast("Choisis un patient et saisis un message.");
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
    showToast("Message envoyé.");
  });
}

function bindGlobalActions() {
  els.refreshButton.addEventListener("click", async () => {
    if (hasRemoteConfig()) {
      await loadRemoteData();
    } else {
      renderAll();
      showToast("Données locales à jour.");
    }
  });

  els.seedButton.addEventListener("click", () => {
    if (!isDoctor()) return;
    if (!confirm("Réinitialiser les données locales de démonstration ?")) return;
    state = createDemoData();
    saveLocalState();
    selectedPatientId = state.patients[0]?.id ?? null;
    patientSessionId = null;
    renderAll();
    showToast("Démo locale réinitialisée.");
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
  els.sectionEyebrow.textContent = views[viewName].eyebrow;
  els.sectionTitle.textContent = views[viewName].title;
}

function renderAll() {
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
  els.authShell.hidden = authenticated;
  els.appShell.hidden = !authenticated;
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
  renderAll();
  showToast("Déconnexion effectuée.");
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
    { label: "Patients suivis", value: state.patients.length, hint: "codes anonymisés" },
    { label: "Alertes rouges", value: redCount, hint: "nécessitent une action" },
    { label: "Observance moyenne", value: `${avgAdherence}%`, hint: "14 derniers jours" },
    { label: "Questionnaires 24h", value: reports24h, hint: "activité récente" },
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
      <span>Patient</span>
      <span>Téléphone</span>
      <span>Diagnostic</span>
      <span>Traitement</span>
      <span>Observance</span>
      <span>Symptômes</span>
      <span>Dernière activité</span>
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
        : `<div class="timeline-item">Aucun patient ne correspond à la recherche.</div>`
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
  els.patientPagination.innerHTML = `
    <span class="muted">${start}-${end} sur ${totalRows} patient${totalRows > 1 ? "s" : ""}</span>
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
    els.patientDetail.innerHTML = `<div class="detail-body"><p>Aucun patient enregistré.</p></div>`;
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
        <p>${escapeHtml(patient.code)} · ${escapeHtml(patient.phone || "Téléphone non renseigné")} · ${escapeHtml(patient.diagnosis)}</p>
      </div>
      <span class="status-pill ${analysis.status}">
        <span class="status-dot ${analysis.status}"></span>${escapeHtml(analysis.label)}
      </span>
    </div>
    <div class="detail-body">
      <div class="detail-summary">
        <div>
          <h3>Traitement en cours</h3>
          <div class="timeline-item">${escapeHtml(patient.current_treatment)}</div>
          <h3>Alertes intelligentes</h3>
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
            <span>Score clinique</span>
          </div>
        </div>
      </div>

      <div class="chart-grid">
        ${chartTile("Nombre de selles", "stoolsChart")}
        ${chartTile("Douleur", "painChart")}
        ${chartTile("Fatigue", "fatigueChart")}
        ${chartTile("Observance", "adherenceChart")}
      </div>

      <div>
        <h3>Historique des traitements</h3>
        <div class="treatment-list">
          ${treatments
            .map(
              (item) => `
                <div class="treatment-item">
                  <strong>${escapeHtml(item.label)}</strong>
                  <time>${formatDate(item.start_date)}${item.end_date ? ` - ${formatDate(item.end_date)}` : " - en cours"}</time>
                  <span class="muted">${escapeHtml(item.notes || "")}</span>
                </div>
              `,
            )
            .join("")}
        </div>
      </div>

      <div>
        <h3>Timeline médicale</h3>
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
    els.patientFeedback.innerHTML = `<p>Connectez-vous avec le code patient pour afficher le suivi.</p>`;
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
      ? "Contactez votre médecin ou le cabinet aujourd’hui."
      : analysis.status === "orange"
        ? "Surveillez vos symptômes et remplissez le questionnaire demain."
        : "Votre état est stable, continuez votre traitement.";

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
        <strong>Dernier suivi</strong>
        <time>${latest ? formatDateTime(latest.submitted_at) : "Aucun questionnaire"}</time>
        <span class="muted">${escapeHtml(analysis.symptoms)}</span>
      </div>
      <div>
        <h3>Notifications</h3>
        <div class="timeline">
          ${buildPatientNotifications(activePatient, analysis)
            .map((item) => `<div class="timeline-item">${escapeHtml(item)}</div>`)
            .join("")}
        </div>
      </div>
      <div>
        <h3>Messages médecin</h3>
        <div class="message-list">
          ${
            messages.length
              ? messages
                  .map(
                    (message) => `
                      <div class="message-item">
                        <strong>${message.direction === "doctor_to_patient" ? "Médecin" : "Patient"}</strong>
                        <span>${escapeHtml(message.content)}</span>
                        <time>${formatDateTime(message.created_at)}</time>
                      </div>
                    `,
                  )
                  .join("")
              : `<div class="message-item"><span class="muted">Aucun message récent.</span></div>`
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
              <strong>${escapeHtml(patient ? `${patientFullName(patient)} · ${patient.code}` : "Patient")} · ${message.direction === "doctor_to_patient" ? "Médecin" : "Patient"}</strong>
              <span>${escapeHtml(message.content)}</span>
              <time>${formatDateTime(message.created_at)}</time>
            </div>
          `;
        })
        .join("")
    : `<div class="message-item"><span class="muted">Aucun message.</span></div>`;
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
    reasons.push("Aucun questionnaire quotidien enregistré.");
  } else {
    if (latest.blood) reasons.push("Sang dans les selles signalé.");
    if (latest.fever) reasons.push("Fièvre signalée.");
    if (latest.pain >= 7) reasons.push("Douleur abdominale élevée.");
    if (latest.stools >= 8) reasons.push("Nombre de selles élevé.");
    if (latest.fatigue >= 8) reasons.push("Fatigue importante.");
    if (!latest.treatment_taken) reasons.push("Traitement non pris lors du dernier suivi.");
    if (latest.side_effects) reasons.push(`Effets secondaires: ${latest.side_effects}`);

    const staleDays = daysSince(latest.submitted_at);
    if (staleDays >= 2) {
      score += 2;
      reasons.push("Questionnaire non rempli depuis plus de 48 h.");
    }
  }

  if (adherence < 70) {
    score += 2;
    reasons.push("Observance thérapeutique inférieure à 70%.");
  }

  if (detectWorseningTrend(reports)) {
    score += 2;
    reasons.push("Aggravation progressive sur plusieurs jours.");
  }

  score = Math.min(15, score);

  let status = "green";
  let label = "Stable";
  if (score >= 8) {
    status = "red";
    label = "Alerte";
  } else if (score >= 4) {
    status = "orange";
    label = "À surveiller";
  }

  if (!reasons.length) reasons.push("Pas de signe d’aggravation détecté.");

  return {
    status,
    label,
    score,
    adherence,
    reasons,
    symptoms: summarizeSymptoms(latest),
    lastActivity: latest ? relativeTime(latest.submitted_at) : "jamais",
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
  if (!report) return "Aucun symptôme récent";
  const parts = [`${report.stools} selles`, `douleur ${report.pain}/10`, `fatigue ${report.fatigue}/10`];
  if (report.blood) parts.push("sang");
  if (report.fever) parts.push("fièvre");
  return parts.join(" · ");
}

function patientFeedbackTitle(status) {
  if (status === "red") return "Contactez votre médecin";
  if (status === "orange") return "À surveiller";
  return "Votre état est stable";
}

function buildPatientNotifications(patient, analysis) {
  const notifications = [];
  const reports = getReports(patient.id);
  const latest = reports.at(-1);
  if (!latest || daysSince(latest.submitted_at) >= 1) notifications.push("Rappel questionnaire quotidien.");
  if (!latest?.treatment_taken) notifications.push("Rappel prise de traitement.");
  if (analysis.status === "red") notifications.push("Message prioritaire: contact médical recommandé.");
  if (!notifications.length) notifications.push("Aucune notification urgente.");
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
      showToast("Échec Supabase, sauvegarde locale utilisée.");
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
      showToast("Échec Supabase, message gardé localement.");
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
      showToast("Échec Supabase, patient gardé localement.");
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
    updateSyncState("Synchronisation...");
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
      showToast("Base distante connectée, mais aucune donnée trouvée.");
    }
    selectedPatientId = selectedPatientId && state.patients.some((item) => item.id === selectedPatientId)
      ? selectedPatientId
      : state.patients[0]?.id ?? null;
    patientSessionId = patientSessionId && state.patients.some((item) => item.id === patientSessionId)
      ? patientSessionId
      : null;
    if (!options.skipRender) renderAll();
    if (!options.quiet) showToast("Synchronisation Supabase terminée.");
  } catch (error) {
    console.error(error);
    updateSyncState("Connexion distante impossible");
    showToast("Impossible de lire la base distante.");
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
  const text = customText || (hasRemoteConfig() ? "Base distante connectée" : "Mode démo local");
  els.syncState.innerHTML = `<span class="status-dot ${dotClass}"></span><span>${escapeHtml(text)}</span>`;
}

function renderDatabase() {
  if (!els.dbStatus || !isDoctor()) return;
  const urlText = dbConfig?.url ? maskUrl(dbConfig.url) : "Non configurée";
  const keyText = dbConfig?.key ? `${dbConfig.key.slice(0, 8)}…${dbConfig.key.slice(-6)}` : "Non configurée";
  els.dbStatus.innerHTML = `
    <div class="db-status-row">
      <strong>Mode</strong>
      <span>${hasRemoteConfig() ? "Supabase distant" : "Démo locale"}</span>
    </div>
    <div class="db-status-row">
      <strong>Project URL</strong>
      <span>${escapeHtml(urlText)}</span>
    </div>
    <div class="db-status-row">
      <strong>Anon key</strong>
      <span>${escapeHtml(keyText)}</span>
    </div>
    <div class="timeline-item">
      Modifie <strong>config.js</strong>, puis recharge la page pour changer la connexion. Le dashboard ne demande plus la clé.
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
  if (hours < 1) return "à l’instant";
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fr-FR", {
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
