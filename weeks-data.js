/**
 * SISTEM DIGITAL - MEDIA AJAR INTERAKTIF
 * Database Silabus, Materi, dan Modul Perkuliahan Minggu 1 - 14
 * Disesuaikan dengan Kurikulum ITERA / Teknik Informatika & Elektro
 */

const WEEKS_DATA = [
  {
    week: 1,
    title: "Pendahuluan Sistem Digital & Sistem Bilangan",
    date: "25 Agustus 2025",
    lecturers: ["Dr. Swadexi Istiqphara, S.T., M.T.", "Efa Maydhona, S.T., M.T.", "Nia Saputri Utami, S.T., M.T."],
    cpmk: "CPMK-1 & CPMK-2: Mampu memahami dasar sistem digital dan mempraktekkan konversi sistem bilangan digital",
    badge: "Interactive Module Ready",
    status: "active",
    submenus: [
      { id: "w1-sub1", title: "1. Pengantar Sistem Digital", type: "theory" },
      { id: "w1-sub2", title: "2. Sistem Bilangan Komputasi", type: "theory" },
      { id: "w1-sub3", title: "3. Lab Sentral Biner (Central Hub)", type: "interactive-hub" },
      { id: "w1-sub4", title: "4. Bilangan Pecahan (Fractional)", type: "interactive-fraction" },
      { id: "w1-sub5", title: "5. Latihan & Kuis Mandiri", type: "interactive-quiz" }
    ],
    overview: "Minggu ini membahas konsep fundamental yang membedakan sistem analog dan sistem digital, representasi data berbasis biner dalam sirkuit elektronik, serta teknik konversi antar sistem bilangan (Desimal, Biner, Oktal, Heksadesimal) dengan metode <strong>Central Binary Hub</strong>."
  },
  {
    week: 2,
    title: "Representasi Bilangan Negatif & Aritmatika Biner",
    date: "1 September 2025",
    lecturers: ["Dr. Swadexi Istiqphara, S.T., M.T.", "Efa Maydhona, S.T., M.T.", "Nia Saputri Utami, S.T., M.T."],
    cpmk: "CPMK-2: Mampu mengidentifikasi metode representasi bilangan negatif (1's & 2's complement) dan melakukan operasi aritmatika biner",
    badge: "Materi & Latihan",
    status: "active",
    submenus: [
      { id: "w2-sub1", title: "1. Tiga Skema Bilangan Bertanda", type: "theory-signed" },
      { id: "w2-sub2", title: "2. Aturan & Algoritma 2's Complement", type: "theory-c2" },
      { id: "w2-sub3", title: "3. Pengurangan via Penjumlahan & Overflow", type: "theory-arithmetic" },
      { id: "w2-sub4", title: "4. Negatif dalam Hex & Octal", type: "theory-hex-oct" },
      { id: "w2-sub5", title: "5. Latihan Terstruktur Minggu 2", type: "exercise-w2" }
    ],
    overview: "Mempelajari representasi bilangan negatif pada register CPU/MCU menggunakan skema Sign-Magnitude, 1's Complement, dan standar industri 2's Complement, serta pengoperasian pengurangan biner menggunakan sirkuit adder dengan proteksi overflow."
  },
  {
    week: 3,
    title: "Aljabar Boolean & Gerbang Logika Dasar",
    date: "8 September 2025",
    cpmk: "CPMK-3: Mampu menerapkan hukum aljabar Boolean dan mengkarakterisasi gerbang logika dasar",
    badge: "Materi Terjadwal",
    status: "upcoming",
    submenus: [
      { id: "w3-sub1", title: "1. Aksioma & Hukum Aljabar Boolean", type: "placeholder" },
      { id: "w3-sub2", title: "2. Gerbang Logika Dasar (AND, OR, NOT)", type: "placeholder" },
      { id: "w3-sub3", title: "3. Gerbang Universal (NAND & NOR)", type: "placeholder" },
      { id: "w3-sub4", title: "4. Gerbang Komparasi (XOR & XNOR)", type: "placeholder" }
    ],
    overview: "Membahas postulat aljabar Boolean, hukum De Morgan, tabel kebenaran (*truth table*), serta implementasi gerbang logika primer dan universal dalam rangkaian digital."
  },
  {
    week: 4,
    title: "Penyederhanaan Logika & Peta Karnaugh (K-Map)",
    date: "15 September 2025",
    cpmk: "CPMK-3: Mampu menyederhanakan persamaan logika menggunakan Peta Karnaugh (K-Map) hingga 4 variabel",
    badge: "Materi Terjadwal",
    status: "upcoming",
    submenus: [
      { id: "w4-sub1", title: "1. Bentuk Kanonik: SOP & POS", type: "placeholder" },
      { id: "w4-sub2", title: "2. K-Map 2 & 3 Variabel", type: "placeholder" },
      { id: "w4-sub3", title: "3. K-Map 4 Variabel & Pengelompokan", type: "placeholder" },
      { id: "w4-sub4", title: "4. Kondisi Don't Care (X)", type: "placeholder" }
    ],
    overview: "Teknik minimisasi sirkuit logika terintegrasi menggunakan metode grafis Peta Karnaugh untuk efisiensi jumlah gerbang dan propagation delay."
  },
  {
    week: 5,
    title: "Rangkaian Kombinasional: Adders & Aritmatika Dasar",
    date: "22 September 2025",
    cpmk: "CPMK-4: Mampu merancang sirkuit penjumlah dan pengurang biner",
    badge: "Materi Terjadwal",
    status: "upcoming",
    submenus: [
      { id: "w5-sub1", title: "1. Half Adder & Full Adder", type: "placeholder" },
      { id: "w5-sub2", title: "2. Ripple Carry Adder 4-bit", type: "placeholder" },
      { id: "w5-sub3", title: "3. Adder-Subtractor Sirkuit Terpadu", type: "placeholder" },
      { id: "w5-sub4", title: "4. Fast Carry: Carry Look-Ahead", type: "placeholder" }
    ],
    overview: "Perancangan blok bangunan dasar Arithmetic Logic Unit (ALU) pada CPU untuk penjumlahan dan pengurangan biner bertanda."
  },
  {
    week: 6,
    title: "Multiplexer, Demultiplexer, Enkoder & Dekoder",
    date: "29 September 2025",
    cpmk: "CPMK-4: Mampu merancang unit perute data dan konverter kode digital",
    badge: "Materi Terjadwal",
    status: "upcoming",
    submenus: [
      { id: "w6-sub1", title: "1. Multiplexer (Data Selector)", type: "placeholder" },
      { id: "w6-sub2", title: "2. Demultiplexer & Decoder", type: "placeholder" },
      { id: "w6-sub3", title: "3. Driver BCD to 7-Segment Display", type: "placeholder" },
      { id: "w6-sub4", title: "4. Priority Encoder", type: "placeholder" }
    ],
    overview: "Routing sinyal data digital dan interfacing perangkat penampil (display) pada sistem tertanam modern."
  },
  {
    week: 7,
    title: "Komparator Digital, Parity, & Desain MSI",
    date: "6 Oktober 2025",
    cpmk: "CPMK-4: Mampu menganalisis sirkuit komparasi nilai dan deteksi error transmisi",
    badge: "Materi Terjadwal",
    status: "upcoming",
    submenus: [
      { id: "w7-sub1", title: "1. Magnitude Comparator (A > B, A = B, A < B)", type: "placeholder" },
      { id: "w7-sub2", title: "2. Pembangkit & Pemeriksa Paritas (Parity)", type: "placeholder" },
      { id: "w7-sub3", title: "3. Cascading Perangkat Kombinasional", type: "placeholder" }
    ],
    overview: "Prinsip komparasi multivariabel dan proteksi integritas data digital pada transmisi komunikasi serial."
  },
  {
    week: 8,
    title: "Review Tengah Semester & Ujian Tengah Semester (UTS)",
    date: "13 Oktober 2025",
    cpmk: "Evaluasi Komprehensif CPMK 1 s.d. 4",
    badge: "Evaluasi / Ujian",
    status: "upcoming",
    submenus: [
      { id: "w8-sub1", title: "1. Review Komprehensif Minggu 1 - 7", type: "placeholder" },
      { id: "w8-sub2", title: "2. Simulasi Bank Soal UTS", type: "placeholder" },
      { id: "w8-sub3", title: "3. Pembahasan Studi Kasus Kombinasional", type: "placeholder" }
    ],
    overview: "Pengujian pemahaman teoritis dan keterampilan analitis mahasiswa dalam merancang dan menyederhanakan sistem digital kombinasi."
  },
  {
    week: 9,
    title: "Rangkaian Sekuensial: Latches & Flip-Flops",
    date: "20 Oktober 2025",
    cpmk: "CPMK-5: Mampu menganalisis elemen penyimpan biner bistabil dan sinyal clock",
    badge: "Materi Terjadwal",
    status: "upcoming",
    submenus: [
      { id: "w9-sub1", title: "1. SR Latch & Gated Latch", type: "placeholder" },
      { id: "w9-sub2", title: "2. Edge-Triggered D Flip-Flop", type: "placeholder" },
      { id: "w9-sub3", title: "3. JK Flip-Flop & T Flip-Flop", type: "placeholder" },
      { id: "w9-sub4", title: "4. Karakteristik Timing (Setup & Hold Time)", type: "placeholder" }
    ],
    overview: "Peralihan dari sirkuit kombinasi ke sekuensial yang memiliki memori keadaan sebelumnya (*state memory*) yang dipicu oleh sinyal detak (*clock*)."
  },
  {
    week: 10,
    title: "Register & Shift Registers",
    date: "27 Oktober 2025",
    cpmk: "CPMK-5: Mampu merancang register geser untuk manipulasi data bit",
    badge: "Materi Terjadwal",
    status: "upcoming",
    submenus: [
      { id: "w10-sub1", title: "1. Buffer Register Paralel", type: "placeholder" },
      { id: "w10-sub2", title: "2. Shift Register SISO, SIPO, PISO, PIPO", type: "placeholder" },
      { id: "w10-sub3", title: "3. Universal Shift Register (74LS194)", type: "placeholder" },
      { id: "w10-sub4", title: "4. Ring Counter & Johnson Counter", type: "placeholder" }
    ],
    overview: "Konsep penyimpanan kata (*word storage*) dan transfer bit serial ke paralel pada protokol seperti SPI dan I2C."
  },
  {
    week: 11,
    title: "Pencacah Digital (Asynchronous & Synchronous Counters)",
    date: "3 November 2025",
    cpmk: "CPMK-5: Mampu merancang pencacah modulus n bertingkat",
    badge: "Materi Terjadwal",
    status: "upcoming",
    submenus: [
      { id: "w11-sub1", title: "1. Ripple Counter (Asinkron)", type: "placeholder" },
      { id: "w11-sub2", title: "2. Synchronous Binary Counter", type: "placeholder" },
      { id: "w11-sub3", title: "3. Up/Down Counter Terkendali", type: "placeholder" },
      { id: "w11-sub4", title: "4. Modulo-N & BCD Decade Counter", type: "placeholder" }
    ],
    overview: "Pencacah detak frekuensi, pembagi pulsa jam (*frequency divider*), dan generator urutan logika."
  },
  {
    week: 12,
    title: "Finite State Machine (FSM): Model Mealy & Moore",
    date: "10 November 2025",
    cpmk: "CPMK-6: Mampu memodelkan dan mengimplementasikan pengendali berbasis FSM",
    badge: "Materi Terjadwal",
    status: "upcoming",
    submenus: [
      { id: "w12-sub1", title: "1. Konsep State Diagram & State Table", type: "placeholder" },
      { id: "w12-sub2", title: "2. Perbedaan Mesin Mealy vs Moore", type: "placeholder" },
      { id: "w12-sub3", title: "3. Reduksi Keadaan & State Assignment", type: "placeholder" },
      { id: "w12-sub4", title: "4. Studi Kasus: Kontrol Lampu Lalu Lintas", type: "placeholder" }
    ],
    overview: "Metode pemodelan mesin kontrol logika otomatis menggunakan diagram transisi status dan tabel eksitasi flip-flop."
  },
  {
    week: 13,
    title: "Memori Semikonduktor & Programmable Logic Devices (PLD)",
    date: "17 November 2025",
    cpmk: "CPMK-6: Mampu mengidentifikasi arsitektur memori RAM/ROM dan dasar FPGA",
    badge: "Materi Terjadwal",
    status: "upcoming",
    submenus: [
      { id: "w13-sub1", title: "1. Organisasi Memori & Hirarki Address Bus", type: "placeholder" },
      { id: "w13-sub2", title: "2. Static RAM (SRAM) vs Dynamic RAM (DRAM)", type: "placeholder" },
      { id: "w13-sub3", title: "3. ROM, PROM, EPROM, & Flash Memory", type: "placeholder" },
      { id: "w13-sub4", title: "4. Pengantar CPLD & Arsitektur FPGA", type: "placeholder" }
    ],
    overview: "Struktur internal memori semikonduktor berkecepatan tinggi dan pengenalan sintesis perangkat keras yang dapat diprogram."
  },
  {
    week: 14,
    title: "Arsitektur CPU Sederhana & Showcase Proyek Akhir",
    date: "24 November 2025",
    cpmk: "CPMK-6: Mampu mengintegrasikan subsistem digital menjadi prosesor sederhana",
    badge: "Proyek Akhir",
    status: "upcoming",
    submenus: [
      { id: "w14-sub1", title: "1. Struktur Datapath & Jalur Bus", type: "placeholder" },
      { id: "w14-sub2", title: "2. Control Unit & Siklus Fetch-Decode-Execute", type: "placeholder" },
      { id: "w14-sub3", title: "3. Set Instruksi Sederhana (ISA)", type: "placeholder" },
      { id: "w14-sub4", title: "4. Presentasi Proyek Akhir Sistem Digital", type: "placeholder" }
    ],
    overview: "Integrasi seluruh konsep mulai dari gerbang logika, ALU, register, dan kontroler sekuensial menjadi arsitektur mikrokomputer fungsional."
  }
];

window.WEEKS_DATA = WEEKS_DATA;
