/**
 * SISTEM DIGITAL - MEDIA AJAR INTERAKTIF
 * Aplikasi Utama: Manajemen State, Navigasi Minggu 1-14, Render Konten
 */

class SistemDigitalApp {
  constructor() {
    this.currentWeek = 1;
    this.currentSubmenuId = "w1-sub3"; // Default directly to Central Binary Hub!
    this.theme = localStorage.getItem("sd_theme") || "dark";
  }

  init() {
    this.applyTheme(this.theme);
    this.renderSidebarWeeks();
    this.bindGlobalEvents();
    this.switchWeek(this.currentWeek, this.currentSubmenuId);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sd_theme", theme);
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.innerHTML = theme === "dark" ? "☀️" : "🌙";
      themeBtn.title = theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap";
    }
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    this.applyTheme(this.theme);
  }

  bindGlobalEvents() {
    // Theme toggle
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => this.toggleTheme());
    }

    // Mobile nav toggle
    const mobileToggle = document.getElementById("mobile-nav-toggle");
    const sidebar = document.getElementById("sidebar");
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }

    // Search filter
    const searchInput = document.getElementById("search-topics");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        this.filterWeeks(query);
      });
    }
  }

  /**
   * Render Sidebar with Weeks 1 through 14
   */
  renderSidebarWeeks() {
    const listContainer = document.getElementById("weeks-nav-list");
    if (!listContainer || !window.WEEKS_DATA) return;

    let html = "";
    window.WEEKS_DATA.forEach((w) => {
      const isActive = w.week === this.currentWeek;
      html += `
        <li class="week-item ${isActive ? "active expanded" : ""}" id="week-item-${w.week}">
          <button class="week-header-btn" onclick="app.switchWeek(${w.week})">
            <div style="display: flex; align-items: center; overflow: hidden;">
              <span class="week-num-badge">M${w.week}</span>
              <span class="week-title-text" title="${w.title}">M${w.week}: ${w.title.split(":")[0]}</span>
            </div>
            <span class="week-status-pill ${w.status === "active" ? "status-active" : "status-upcoming"}">
              ${w.status === "active" ? "Aktif" : "Mendatang"}
            </span>
          </button>
          <ul class="week-submenus" id="week-submenus-${w.week}">
            ${w.submenus.map((sub) => `
              <li>
                <span class="submenu-link ${sub.id === this.currentSubmenuId ? "active-sub" : ""}" 
                      onclick="app.switchSubmenu('${sub.id}')">
                  ${sub.title}
                </span>
              </li>
            `).join("")}
          </ul>
        </li>
      `;
    });

    listContainer.innerHTML = html;
  }

  filterWeeks(query) {
    window.WEEKS_DATA.forEach((w) => {
      const item = document.getElementById(`week-item-${w.week}`);
      if (!item) return;

      const matchesWeek = w.title.toLowerCase().includes(query) || `minggu ${w.week}`.includes(query);
      const matchesSub = w.submenus.some(s => s.title.toLowerCase().includes(query));

      if (matchesWeek || matchesSub || !query) {
        item.style.display = "block";
        if (query && matchesSub) {
          item.classList.add("expanded");
        }
      } else {
        item.style.display = "none";
      }
    });
  }

  /**
   * Switch to a selected week
   */
  switchWeek(weekNum, specificSubmenuId = null) {
    this.currentWeek = weekNum;
    const weekData = window.WEEKS_DATA.find(w => w.week === weekNum);
    if (!weekData) return;

    // Update active class on sidebar
    document.querySelectorAll(".week-item").forEach(item => {
      item.classList.remove("active");
    });
    const activeItem = document.getElementById(`week-item-${weekNum}`);
    if (activeItem) {
      activeItem.classList.add("active");
      activeItem.classList.add("expanded");
    }

    // Set active submenu
    if (specificSubmenuId) {
      this.currentSubmenuId = specificSubmenuId;
    } else {
      // Default to first submenu, or lab if week 1
      this.currentSubmenuId = (weekNum === 1) ? "w1-sub3" : weekData.submenus[0].id;
    }

    // Update Topbar badge
    const weekBadge = document.getElementById("current-week-indicator");
    if (weekBadge) {
      weekBadge.innerHTML = `<span class="pulse-dot"></span> Minggu ${weekNum} dari 14`;
    }

    // Render horizontal tabs bar for active week
    this.renderWeekTabsBar(weekData);

    // Render Main Content
    this.renderContent(weekData);

    // Close mobile drawer if opened
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.remove("open");
  }

  /**
   * Switch specific submenu
   */
  switchSubmenu(subId) {
    this.currentSubmenuId = subId;
    const weekData = window.WEEKS_DATA.find(w => w.week === this.currentWeek);

    // Update active tab buttons
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.subid === subId);
    });

    // Update active submenus in sidebar
    document.querySelectorAll(".submenu-link").forEach(link => {
      link.classList.remove("active-sub");
    });
    const activeSidebarSub = document.querySelector(`[onclick*="${subId}"]`);
    if (activeSidebarSub) activeSidebarSub.classList.add("active-sub");

    this.renderContent(weekData);
  }

  renderWeekTabsBar(weekData) {
    const bar = document.getElementById("week-tabs-bar");
    if (!bar) return;

    let html = "";
    weekData.submenus.forEach((sub) => {
      const isActive = sub.id === this.currentSubmenuId;
      html += `
        <button class="tab-btn ${isActive ? "active" : ""}" data-subid="${sub.id}" onclick="app.switchSubmenu('${sub.id}')">
          <span>${sub.title}</span>
        </button>
      `;
    });

    bar.innerHTML = html;
  }

  /**
   * Main Content Router
   */
  renderContent(weekData) {
    const container = document.getElementById("main-content-display");
    if (!container) return;

    if (this.currentWeek === 1) {
      this.renderWeek1(container);
    } else if (this.currentWeek === 2) {
      this.renderWeek2(container);
    } else {
      this.renderUpcomingWeek(container, weekData);
    }
  }

  /* ------------------- WEEK 1 CONTENT ------------------- */
  renderWeek1(container) {
    const sub = this.currentSubmenuId;

    if (sub === "w1-sub1") {
      container.innerHTML = this.getWeek1Sub1Html();
    } else if (sub === "w1-sub2") {
      container.innerHTML = this.getWeek1Sub2Html();
    } else if (sub === "w1-sub3") {
      container.innerHTML = this.getWeek1Sub3HubHtml();
      window.centralBinaryEngine.init();
    } else if (sub === "w1-sub4") {
      container.innerHTML = this.getWeek1Sub4FractionHtml();
      window.centralBinaryEngine.init();
    } else if (sub === "w1-sub5") {
      container.innerHTML = this.getWeek1Sub5QuizHtml();
      window.quizEngine.init();
    } else {
      container.innerHTML = this.getWeek1Sub3HubHtml();
      window.centralBinaryEngine.init();
    }
  }

  getWeek1Sub1Html() {
    return `
      <div class="module-hero">
        <span class="module-hero-badge">MINGGU 1 • MATERI 01</span>
        <h2>Dasar-Dasar & Pengantar Sistem Digital</h2>
        <p>Pengenalan konsep fundamental sirkuit elektronik logika digital, perbandingan sistem analog versus digital, serta keandalannya dalam komputasi modern.</p>
        <div class="module-meta-tags">
          <span class="meta-tag">Dosen: <strong>Dr. Swadexi Istiqphara, S.T., M.T. et al.</strong></span>
          <span class="meta-tag">Institusi: <strong>Institut Teknologi Sumatera (ITERA)</strong></span>
          <span class="meta-tag">CPMK: <strong>CPMK-1 Dasar Sistem Digital</strong></span>
        </div>
      </div>

      <div class="content-grid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><span class="card-title-icon">⚡</span> Definisi & Karakteristik</h3>
          </div>
          <p style="color: var(--text-muted); margin-bottom: 1rem;">
            <strong>Sistem Digital</strong> adalah sistem yang bekerja dengan data berbasis angka biner (0 dan 1), digunakan untuk pengolahan informasi dengan akurasi dan integritas data yang sangat tinggi.
          </p>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem;">
            <li>🔹 <strong>Keandalan Tinggi:</strong> Mengurangi kesalahan distorsi gelombang yang sering terjadi dalam sistem analog akibat gangguan eksternal/noise.</li>
            <li>🔹 <strong>Discrete Nature:</strong> Bekerja dengan data dalam bentuk diskrit (terputus), bukan kontinu, sehingga mudah diproses, dimanipulasi, dan disimpan oleh mikroprosesor.</li>
          </ul>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><span class="card-title-icon">⚖️</span> Analog vs Digital</h3>
          </div>
          <table class="math-table">
            <thead>
              <tr><th>Parameter</th><th>Sistem Analog</th><th>Sistem Digital</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Prinsip Kerja</strong></td><td>Sinyal kontinu (gelombang tak terputus)</td><td>Sinyal diskrit (level biner 0 dan 1)</td></tr>
              <tr><td><strong>Akurasi</strong></td><td>Rentan interferensi & distorsi</td><td>Sangat presisi tanpa degradasi sinyal</td></tr>
              <tr><td><strong>Aplikasi</strong></td><td>Radio FM/AM konvensional, termometer raksa</td><td>Komputer, Smartphone, IoT, Mikrokontroler</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card" style="margin-bottom: 2rem;">
        <div class="card-header">
          <h3 class="card-title"><span class="card-title-icon">🌐</span> Penerapan Nyata Sistem Digital</h3>
        </div>
        <div class="content-grid" style="margin-bottom: 0;">
          <div style="background: var(--bg-glass); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
            <h4 style="color: var(--cyan-primary); margin-bottom: 6px;">1. Otomasi Rumah (Smart Home)</h4>
            <p style="font-size: 0.88rem; color: var(--text-muted);">Kendali jarak jauh lampu pintar, efisiensi energi otomatis, dan kunci keamanan digital berbasis IoT.</p>
          </div>
          <div style="background: var(--bg-glass); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
            <h4 style="color: var(--indigo-primary); margin-bottom: 6px;">2. Telekomunikasi Global</h4>
            <p style="font-size: 0.88rem; color: var(--text-muted);">Jaringan 4G/5G, konektivitas nirkabel Wi-Fi & Bluetooth, konferensi video terenkripsi.</p>
          </div>
          <div style="background: var(--bg-glass); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
            <h4 style="color: var(--emerald-primary); margin-bottom: 6px;">3. Elektronik Konsumen</h4>
            <p style="font-size: 0.88rem; color: var(--text-muted);">Smart TV, konsol video game interaktif, jam pintar (smartwatch) dengan sensor biometrik.</p>
          </div>
        </div>
      </div>
    `;
  }

  getWeek1Sub2Html() {
    return `
      <div class="module-hero">
        <span class="module-hero-badge">MINGGU 1 • MATERI 02</span>
        <h2>Sistem Bilangan dalam Komputasi Digital</h2>
        <p>Memahami 4 basis bilangan utama: Biner (basis 2), Oktal (basis 8), Desimal (basis 10), dan Heksadesimal (basis 16), beserta terminologi bit, nibble, byte, MSB, dan LSB.</p>
      </div>

      <div class="content-grid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><span class="card-title-icon">🔢</span> 4 Sistem Bilangan Utama</h3>
          </div>
          <table class="math-table">
            <thead>
              <tr><th>Sistem Bilangan</th><th>Radix (Basis)</th><th>Himpunan Simbol / Digit</th></tr>
            </thead>
            <tbody>
              <tr><td><strong style="color: var(--cyan-primary)">Biner</strong></td><td>Basis 2</td><td><code>0, 1</code></td></tr>
              <tr><td><strong style="color: var(--emerald-primary)">Oktal</strong></td><td>Basis 8</td><td><code>0, 1, 2, 3, 4, 5, 6, 7</code></td></tr>
              <tr><td><strong style="color: var(--amber-primary)">Desimal</strong></td><td>Basis 10</td><td><code>0, 1, 2, 3, 4, 5, 6, 7, 8, 9</code></td></tr>
              <tr><td><strong style="color: var(--indigo-primary)">Heksadesimal</strong></td><td>Basis 16</td><td><code>0-9, A, B, C, D, E, F</code> (A=10 s.d. F=15)</td></tr>
            </tbody>
          </table>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><span class="card-title-icon">🧩</span> Istilah Penting Representasi Bit</h3>
          </div>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem;">
            <li><strong>Bit (Binary Digit):</strong> Satuan data terkecil berharga 0 atau 1.</li>
            <li><strong>MSB (Most Significant Bit):</strong> Bit dengan posisi pangkat tertinggi (terletak paling kiri).</li>
            <li><strong>LSB (Least Significant Bit):</strong> Bit dengan posisi pangkat terendah (terletak paling kanan, bobot 2⁰).</li>
            <li><strong>Nibble (4 Bit):</strong> Gabungan 4 bit biner, tepat merepresentasikan <strong>1 digit Heksadesimal</strong> (0000 s.d. 1111 = 0 s.d. F).</li>
            <li><strong>Byte (8 Bit):</strong> Gabungan 8 bit biner (2 nibble), standar satuan data dalam arsitektur komputer.</li>
            <li><strong>Word:</strong> Biasanya 16 bit, 32 bit, atau 64 bit tergantung arsitektur mikroprosesor.</li>
          </ul>
        </div>
      </div>

      <div class="callout callout-success">
        <div class="callout-title">💡 Mengapa Heksadesimal & Oktal Sangat Populer dalam Pemrograman Hardware?</div>
        <p>Deretan biner 16-bit atau 32-bit sangat panjang dan sulit dibaca manusia (rawan salah baca). Dengan mengelompokkan biner per <strong>4 bit menjadi 1 karakter Heksa</strong> (atau per <strong>3 bit menjadi Oktal</strong>), representasi data dan alamat memori (RAM address) menjadi ringkas dan mudah dipelihara tanpa mengubah nilai fisik bit sedikitpun!</p>
      </div>
    `;
  }

  getWeek1Sub3HubHtml() {
    return `
      <div class="module-hero">
        <span class="module-hero-badge">MINGGU 1 • FITUR UTAMA INTERAKTIF</span>
        <h2>Laboratorium Sentral Biner (Central Binary Hub)</h2>
        <p>Eksplorasi metode konversi paling efisien dan intuitif: <strong>Semua bilangan dikonversikan ke BINER terlebih dahulu sebagai poros sentral</strong>. Dari biner sentral, nilai dapat langsung dikonversi ke Heksa (kelompok 4-bit), ke Oktal (kelompok 3-bit), dan ke Desimal (penjumlahan bobot 2ⁿ).</p>
      </div>

      <!-- Converter Controls -->
      <div class="converter-panel">
        <div class="converter-input-grid">
          <div class="form-group">
            <label class="form-label" for="hub-input-base">Basis Asal (Input Base):</label>
            <select id="hub-input-base" class="form-select">
              <option value="10" selected>Desimal (Basis 10)</option>
              <option value="2">Biner (Basis 2)</option>
              <option value="16">Heksadesimal (Basis 16)</option>
              <option value="8">Oktal (Basis 8)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="hub-input-val">Nilai Input Bilangan:</label>
            <input type="text" id="hub-input-val" class="form-input" value="258" placeholder="Contoh: 258 atau 25 atau 0.625">
          </div>

          <div style="display: flex; align-items: flex-end;">
            <button class="btn btn-primary" onclick="centralBinaryEngine.processInput(document.getElementById('hub-input-val').value.trim(), parseInt(document.getElementById('hub-input-base').value, 10))">
              ⚡ Hitung & Visualisasikan
            </button>
          </div>
        </div>

        <div id="hub-error-msg" style="display: none; padding: 10px 14px; border-radius: var(--radius-sm); background: rgba(244, 63, 94, 0.15); border: 1px solid var(--rose-primary); color: #fda4af; margin-bottom: 1rem; font-size: 0.9rem;"></div>

        <div class="preset-buttons-wrap">
          <span class="preset-title">💡 Contoh Soal Slide Kuliah:</span>
          <button class="preset-btn" data-base="10" data-val="258">258₁₀ (Soal Terstruktur 1)</button>
          <button class="preset-btn" data-base="10" data-val="25">25₁₀ (Slide 30)</button>
          <button class="preset-btn" data-base="10" data-val="125">125₁₀ (Slide 31)</button>
          <button class="preset-btn" data-base="16" data-val="2F">2F₁₆ (Slide 32)</button>
          <button class="preset-btn" data-base="2" data-val="1011">1011₂</button>
          <button class="preset-btn" data-base="10" data-val="0.625">0.625₁₀ (Pecahan)</button>
        </div>
      </div>

      <!-- CENTRAL BINARY STREAM DISPLAY -->
      <div class="central-hub-display">
        <div class="central-badge-title">
          <span>⚡ Jembatan Sentral: Aliran Bit Biner (Central Binary Bridge)</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          <em>Klik pada kotak bit di bawah untuk mengubah nilai bit (0 ↔ 1) secara interaktif!</em>
        </p>
        <div class="binary-stream-box" id="central-binary-stream">
          <!-- Rendered via central-binary.js -->
        </div>
      </div>

      <!-- SPOKES: HEXADECIMAL, OCTAL, DECIMAL -->
      <div class="spokes-grid">
        <!-- Hexadecimal Spoke (4-bit grouping) -->
        <div class="spoke-card hex-card">
          <div class="spoke-header">
            <h4 class="spoke-title"><span style="color: var(--indigo-primary);">⬢</span> Ke Heksadesimal</h4>
            <span class="spoke-rule-pill">Kelompok 4 Bit (Nibble)</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            Dikelompokkan per <strong>4 bit</strong> dari kanan ke kiri (tambah padding 0 di MSB jika kurang):
          </p>
          <div class="groups-container" id="hex-groups-container">
            <!-- Rendered by JS -->
          </div>
          <div class="spoke-final-result">
            <span class="result-label">Nilai Heksadesimal:</span>
            <span class="result-val-badge" id="hex-result-badge">--</span>
          </div>
        </div>

        <!-- Octal Spoke (3-bit grouping) -->
        <div class="spoke-card octal-card">
          <div class="spoke-header">
            <h4 class="spoke-title"><span style="color: var(--emerald-primary);">⬡</span> Ke Oktal</h4>
            <span class="spoke-rule-pill">Kelompok 3 Bit</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            Dikelompokkan per <strong>3 bit</strong> dari kanan ke kiri (tambah padding 0 di MSB jika kurang):
          </p>
          <div class="groups-container" id="octal-groups-container">
            <!-- Rendered by JS -->
          </div>
          <div class="spoke-final-result">
            <span class="result-label">Nilai Oktal:</span>
            <span class="result-val-badge" id="octal-result-badge">--</span>
          </div>
        </div>

        <!-- Decimal Spoke (Summation of 2^n) -->
        <div class="spoke-card decimal-card">
          <div class="spoke-header">
            <h4 class="spoke-title"><span style="color: var(--amber-primary);">🔢</span> Ke Desimal</h4>
            <span class="spoke-rule-pill">Σ Bobot 2ⁿ Aktif</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            Jumlahkan bobot pangkat $2^i$ untuk seluruh bit yang bernilai 1:
          </p>
          <div class="decimal-weights-flow">
            <div class="weights-grid" id="decimal-weights-container">
              <!-- Rendered by JS -->
            </div>
            <div class="summation-equation" id="decimal-sum-equation">
              <!-- Rendered by JS -->
            </div>
          </div>
          <div class="spoke-final-result">
            <span class="result-label">Nilai Desimal:</span>
            <span class="result-val-badge" id="decimal-result-badge">--</span>
          </div>
        </div>
      </div>

      <!-- Step-by-Step Solver Accordion -->
      <div style="margin-top: 2.5rem;">
        <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
          <span>📝</span> Pembahasan Langkah Demi Langkah (Step-by-Step Solver)
        </h3>
        <div id="step-by-step-solver">
          <!-- Rendered by JS -->
        </div>
      </div>

      <!-- Interactive 8/16 Bit Board -->
      <div class="bit-board-panel" style="margin-top: 2.5rem;">
        <div class="board-switch-wrap">
          <div>
            <h3 style="font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
              <span>🕹️</span> Laboratorium Saklar Bit (Interactive Bit Board)
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              Nyalakan saklar LED bit fisik untuk langsung melihat transformasi angka desimal, heksa, dan oktal secara real-time!
            </p>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <select id="board-size-select" class="form-select" style="padding: 6px 12px; font-size: 0.85rem; width: auto;">
              <option value="8" selected>Register 8-Bit</option>
              <option value="12">Register 12-Bit</option>
              <option value="16">Register 16-Bit</option>
            </select>
            <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="centralBinaryEngine.invertBitBoard()">Inversi (NOT)</button>
            <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="centralBinaryEngine.resetBitBoard()">Reset 0</button>
          </div>
        </div>

        <div class="board-bits-row" id="board-bits-row">
          <!-- Rendered by JS -->
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem; background: rgba(0,0,0,0.25); padding: 1rem; border-radius: var(--radius-sm);">
          <div>
            <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Biner Fisik:</span>
            <div id="board-stat-bin" style="font-family: var(--font-mono); font-size: 1.1rem; color: var(--cyan-primary); font-weight: 700;">00000000</div>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Desimal Unsigned:</span>
            <div id="board-stat-dec" style="font-family: var(--font-mono); font-size: 1.1rem; color: var(--amber-primary); font-weight: 700;">0</div>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Heksadesimal:</span>
            <div id="board-stat-hex" style="font-family: var(--font-mono); font-size: 1.1rem; color: #a5b4fc; font-weight: 700;">0x00</div>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Oktal:</span>
            <div id="board-stat-oct" style="font-family: var(--font-mono); font-size: 1.1rem; color: #6ee7b7; font-weight: 700;">0o0</div>
          </div>
        </div>
      </div>
    `;
  }

  getWeek1Sub4FractionHtml() {
    return `
      <div class="module-hero">
        <span class="module-hero-badge">MINGGU 1 • MATERI 04</span>
        <h2>Bilangan Pecahan dalam Sistem Digital (Fractional Binary)</h2>
        <p>Memahami konversi angka desimal dengan koma/pecahan ke sistem biner, oktal, dan heksadesimal dengan aturan perkalian 2 berulang dan pengelompokan bit dari kiri ke kanan.</p>
      </div>

      <div class="content-grid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><span class="card-title-icon">➗</span> Contoh Kuliah: Desimal 0.625₁₀ ke Biner</h3>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.75rem;">
            Kalikan pecahan dengan 2 secara berulang, dan catat angka bulat (1 atau 0) dari atas ke bawah:
          </p>
          <table class="math-table">
            <thead>
              <tr><th>Perkalian</th><th>Hasil</th><th>Angka Bulat (Bit)</th></tr>
            </thead>
            <tbody>
              <tr><td>0.625 × 2</td><td>1.25</td><td><strong style="color: var(--cyan-primary)">1</strong></td></tr>
              <tr><td>0.25 × 2</td><td>0.50</td><td><strong style="color: var(--cyan-primary)">0</strong></td></tr>
              <tr><td>0.50 × 2</td><td>1.00</td><td><strong style="color: var(--cyan-primary)">1</strong></td></tr>
            </tbody>
          </table>
          <p style="font-family: var(--font-mono); font-size: 1.05rem; margin-top: 10px;">
            Hasil: <strong>(0.625)₁₀ = (0.101)₂</strong>
          </p>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><span class="card-title-icon">📐</span> Pengelompokan Pecahan ke Heksa & Oktal</h3>
          </div>
          <div class="callout callout-warning" style="margin-top: 0;">
            <div class="callout-title">⚠️ Aturan Kritis Pecahan:</div>
            <p>Berbeda dengan bilangan bulat yang dikelompokkan dari kanan ke kiri, pecahan biner dikelompokkan dari <strong>KIRI ke KANAN</strong> (menjauhi tanda titik). Jika bit kurang, tambahkan <strong>0 di belakang (LSB)</strong>!</p>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.9rem; line-height: 1.8;">
            • <strong>Ke Heksadesimal (4 bit):</strong> 0.101₂ ditambah 0 di belakang → <code>0.1010₂</code> = <strong>0.A₁₆</strong> (karena 1010₂ = 10 = A).<br/>
            • <strong>Ke Oktal (3 bit):</strong> 0.101₂ sudah tepat 3 bit → <code>0.101₂</code> = <strong>0.5₈</strong>.
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><span class="card-title-icon">🧪</span> Coba Konversi Pecahan di Central Hub</h3>
        </div>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">
          Klik tombol di bawah untuk langsung menguji angka pecahan di Central Binary Hub:
        </p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="app.switchSubmenu('w1-sub3'); setTimeout(() => centralBinaryEngine.setPreset('0.625', 10), 100);">Uji 0.625₁₀ (Contoh Slide)</button>
          <button class="btn btn-outline" onclick="app.switchSubmenu('w1-sub3'); setTimeout(() => centralBinaryEngine.setPreset('101.101', 2), 100);">Uji 101.101₂ (Gabungan Bulat + Pecahan)</button>
          <button class="btn btn-outline" onclick="app.switchSubmenu('w1-sub3'); setTimeout(() => centralBinaryEngine.setPreset('1A.8', 16), 100);">Uji 1A.8₁₆</button>
        </div>
      </div>
    `;
  }

  getWeek1Sub5QuizHtml() {
    return `
      <div class="module-hero">
        <span class="module-hero-badge">MINGGU 1 • EVALUASI INTERAKTIF</span>
        <h2>Latihan Soal Terstruktur & Kuis Mandiri</h2>
        <p>Uji pemahaman Anda mengenai konversi Biner, Heksadesimal, Oktal, dan Desimal berbasis Central Binary. Dilengkapi kunci pembahasan dan generator soal latihan tanpa batas.</p>
      </div>

      <div class="quiz-panel">
        <div class="quiz-header">
          <div>
            <span id="quiz-counter" style="font-size: 0.85rem; color: var(--text-dim); text-transform: uppercase; font-family: var(--font-mono); font-weight: 700;">Soal 1 dari 5</span>
            <h3 style="font-size: 1.25rem; font-weight: 800; margin-top: 4px;">Uji Kemampuan Konversi Central Binary</h3>
          </div>
          <div style="display: flex; gap: 12px; align-items: center;">
            <div class="quiz-score-badge">
              <span>🏆 Skor:</span>
              <span id="quiz-score-val">0 Poin</span>
            </div>
            <button class="btn btn-outline" id="quiz-random-btn" style="padding: 6px 12px; font-size: 0.8rem;">
              🎲 Generate Soal Acak
            </button>
          </div>
        </div>

        <div class="question-box">
          <div class="question-prompt" id="quiz-prompt">
            <!-- Rendered by quiz.js -->
          </div>
          <div class="quiz-answers-grid" id="quiz-options-grid">
            <!-- Rendered by quiz.js -->
          </div>
          <div class="quiz-feedback-box" id="quiz-feedback">
            <!-- Feedback -->
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button class="btn btn-primary" id="quiz-next-btn" style="display: none;">
            Soal Berikutnya ➔
          </button>
        </div>
      </div>
    `;
  }

  /* ------------------- WEEK 2 CONTENT (FROM SLIDES) ------------------- */
  renderWeek2(container) {
    container.innerHTML = `
      <div class="module-hero">
        <span class="module-hero-badge">MINGGU 2 • MATERI & PRAKTEK</span>
        <h2>Representasi Bilangan Negatif & Aritmatika Biner</h2>
        <p>Mempelajari tiga skema bilangan bertanda (Sign-Magnitude, 1's Complement, 2's Complement), rumus nilai 2's Complement, pengurangan via penjumlahan, dan deteksi overflow.</p>
        <div class="module-meta-tags">
          <span class="meta-tag">Dosen: <strong>Dr. Swadexi Istiqphara, S.T., M.T. et al.</strong></span>
          <span class="meta-tag">Sub-CPMK: <strong>CPMK-2 Representasi Negatif & Operasi Aritmatika</strong></span>
        </div>
      </div>

      <div class="content-grid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><span class="card-title-icon">📊</span> Perbandingan 3 Skema Bertanda (8-Bit)</h3>
          </div>
          <table class="math-table">
            <thead>
              <tr><th>Skema</th><th>Rentang (8-bit)</th><th>-X dari +X</th><th>Karakteristik & Catatan</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Sign-Magnitude</strong></td><td>-127 s.d. +127</td><td>Set MSB = 1</td><td>Ada dua angka nol (+0 dan -0), sirkuit rumit</td></tr>
              <tr><td><strong>1's Complement (C1)</strong></td><td>-127 s.d. +127</td><td>NOT semua bit</td><td>Masih ada +0 & -0, butuh <em>end-around carry</em></td></tr>
              <tr><td><strong style="color: var(--cyan-primary)">2's Complement (C2)</strong></td><td><strong>-128 s.d. +127</strong></td><td><strong>NOT + 1</strong></td><td><strong>Standar CPU/MCU</strong> (Hanya satu nol, aritmetika sederhana)</td></tr>
            </tbody>
          </table>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><span class="card-title-icon">⚙️</span> Algoritma 3 Langkah Desimal → 2's Complement</h3>
          </div>
          <div style="font-size: 0.9rem; line-height: 1.8; color: var(--text-muted);">
            Contoh konversi <strong>-13₁₀</strong> ke 8-bit (C2):
            <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; font-family: var(--font-mono); margin: 8px 0;">
              1. Tulis +13 dalam biner 8-bit : <code>0000 1101</code><br/>
              2. Inversi semua bit (NOT)       : <code>1111 0010</code><br/>
              3. Tambahkan 1 pada LSB         : <code>1111 0011</code><br/>
              ------------------------------------------------<br/>
              Hasil akhir (-13)               : <strong>1111 0011₂ (0xF3)</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><span class="card-title-icon">➕</span> Pengurangan via Penjumlahan (C2)</h3>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.75rem;">
            Prinsip utama pada ALU CPU: <code>A - B = A + (C2 dari B)</code>. CPU tidak membutuhkan sirkuit pengurang terpisah, cukup menggunakan satu modul sirkuit <strong>Adder</strong>!
          </p>
          <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; font-family: var(--font-mono); font-size: 0.88rem;">
            Contoh: 18 - 25 = 18 + (-25)<br/>
            • 18 = 0001 0010₂<br/>
            • 25 = 0001 1001₂ → C2 = 1110 0111₂<br/>
            • 0001 0010 + 1110 0111 = <strong>1111 1001₂ (-7₁₀)</strong>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><span class="card-title-icon">🚨</span> Deteksi Kondisi Overflow (C2)</h3>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.75rem;">
            Overflow terjadi ketika hasil operasi melebihi rentang bit (dua positif menghasilkan negatif, atau dua negatif menghasilkan positif).
          </p>
          <div class="callout callout-warning" style="margin: 0;">
            <div class="callout-title">Deteksi Cepat Gerbang Logika:</div>
            <p><strong>Overflow Flag = (Carry ke MSB) XOR (Carry keluar MSB)</strong><br/>
            Contoh: (+100) + (+60) = +160 (di luar batas +127 pada 8-bit). Bit hasil menghasilkan MSB=1 (-104) yang memicu overflow flag = 1!</p>
          </div>
        </div>
      </div>
    `;
  }

  /* ------------------- WEEKS 3-14 PLACEHOLDERS ------------------- */
  renderUpcomingWeek(container, weekData) {
    container.innerHTML = `
      <div class="module-hero">
        <span class="module-hero-badge">MINGGU ${weekData.week} • SILABUS MATA KULIAH</span>
        <h2>${weekData.title}</h2>
        <p>${weekData.overview}</p>
        <div class="module-meta-tags">
          <span class="meta-tag">Jadwal: <strong>${weekData.date}</strong></span>
          <span class="meta-tag">Capaian: <strong>${weekData.cpmk}</strong></span>
          <span class="meta-tag">Status: <strong>${weekData.status === 'active' ? 'Aktif' : 'Terjadwal Sesuai Kalender Akademik'}</strong></span>
        </div>
      </div>

      <div class="card" style="margin-bottom: 2rem;">
        <div class="card-header">
          <h3 class="card-title"><span class="card-title-icon">📚</span> Rincian Submateri Minggu ${weekData.week}</h3>
        </div>
        <div class="content-grid" style="margin-bottom: 0;">
          ${weekData.submenus.map((sub, idx) => `
            <div style="background: var(--bg-glass); border: 1px solid var(--border-glass); border-radius: var(--radius-sm); padding: 1.25rem;">
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan-primary); font-weight: 700;">SUBTOPIK 0${idx + 1}</span>
              <h4 style="margin: 6px 0; font-size: 1rem;">${sub.title}</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted);">Materi ajar interaktif, simulasi sirkuit, dan latihan soal untuk subtopik ini akan aktif sesuai jadwal tatap muka perkuliahan.</p>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="callout callout-success">
        <div class="callout-title">💡 Integrasi Berkelanjutan (Weekly Expansion)</div>
        <p>Media ajar HTML5 ini telah dirancang dengan arsitektur modular. Setiap minggu materi baru, simulasi interaktif gerbang logika, K-Map solver, sirkuit kombinasi, dan simulator flip-flop dapat ditambahkan langsung ke dalam file <code>weeks-data.js</code> dan modul terkait tanpa mengubah arsitektur utama.</p>
      </div>
    `;
  }
}

window.app = new SistemDigitalApp();
document.addEventListener("DOMContentLoaded", () => {
  window.app.init();
});
