/**
 * SISTEM DIGITAL - MEDIA AJAR INTERAKTIF
 * Engine Kuis & Latihan Mandiri Interaktif
 * Termasuk soal-soal terstruktur dari materi kuliah & bank soal interaktif.
 */

class QuizEngine {
  constructor() {
    this.currentQuestionIdx = 0;
    this.score = 0;
    this.answeredCount = 0;
    this.questions = [
      {
        id: 1,
        title: "Konversi Desimal 258₁₀ ke Hexadesimal & Oktal (Metode Sentral Biner)",
        category: "Minggu 1: Central Binary",
        prompt: "Diberikan bilangan desimal <strong>258₁₀</strong>. Dengan menggunakan metode <em>Central Binary Hub</em> (ubah ke biner terlebih dahulu, lalu kelompokkan 4-bit dan 3-bit), berapakah representasi Heksadesimal dan Oktalnya?",
        options: [
          { text: "Hex: 102₁₆, Oktal: 402₈", correct: true },
          { text: "Hex: 1A2₁₆, Oktal: 302₈", correct: false },
          { text: "Hex: 201₁₆, Oktal: 420₈", correct: false },
          { text: "Hex: 0FE₁₆, Oktal: 504₈", correct: false }
        ],
        explanation: `
          <strong>Pembahasan Lengkap:</strong><br/>
          1. <strong>Ke Biner Pusat:</strong> 258 ÷ 2 = 129 sisa 0, 129 ÷ 2 = 64 sisa 1, ..., hingga 1 ÷ 2 = 0 sisa 1.<br/>
          Diperoleh: <code>258₁₀ = 100000010₂</code> (9 bit).<br/>
          2. <strong>Ke Heksadesimal (Kelompok 4 bit):</strong><br/>
          Tambahkan padding nol di MSB agar genap 12 bit: <code>0001 0000 0010₂</code><br/>
          • 0001₂ = <strong>1</strong><br/>
          • 0000₂ = <strong>0</strong><br/>
          • 0010₂ = <strong>2</strong><br/>
          Hasil: <strong>102₁₆</strong>.<br/>
          3. <strong>Ke Oktal (Kelompok 3 bit):</strong><br/>
          9 bit sudah pas kelipatan 3: <code>100 000 010₂</code><br/>
          • 100₂ = <strong>4</strong><br/>
          • 000₂ = <strong>0</strong><br/>
          • 010₂ = <strong>2</strong><br/>
          Hasil: <strong>402₈</strong>.
        `
      },
      {
        id: 2,
        title: "Konversi Bilangan Pecahan 0.625₁₀ ke Heksadesimal & Oktal",
        category: "Minggu 1: Bilangan Pecahan",
        prompt: "Berapakah representasi Heksadesimal dan Oktal dari bilangan pecahan desimal <strong>0.625₁₀</strong>?",
        options: [
          { text: "Hex: 0.A₁₆, Oktal: 0.5₈", correct: true },
          { text: "Hex: 0.5₁₆, Oktal: 0.A₈", correct: false },
          { text: "Hex: 0.C₁₆, Oktal: 0.4₈", correct: false },
          { text: "Hex: 0.8₁₆, Oktal: 0.6₈", correct: false }
        ],
        explanation: `
          <strong>Pembahasan:</strong><br/>
          1. <strong>Ubah pecahan desimal ke biner:</strong><br/>
          • 0.625 × 2 = 1.25 (simpan 1)<br/>
          • 0.25 × 2 = 0.50 (simpan 0)<br/>
          • 0.50 × 2 = 1.00 (simpan 1)<br/>
          Maka <code>0.625₁₀ = 0.101₂</code>.<br/>
          2. <strong>Ke Heksadesimal (4-bit kelompok pecahan ke kanan):</strong><br/>
          0.101₂ + padding 0 di kanan = <code>0.1010₂</code> = <strong>0.A₁₆</strong> (karena 1010₂ = 10 = A).<br/>
          3. <strong>Ke Oktal (3-bit kelompok pecahan ke kanan):</strong><br/>
          0.101₂ sudah 3 bit = <strong>0.5₈</strong> (karena 101₂ = 5).
        `
      },
      {
        id: 3,
        title: "Konversi Bilangan Heksadesimal 2F₁₆ ke Desimal",
        category: "Minggu 1: Sistem Bilangan",
        prompt: "Jika bilangan heksadesimal <strong>2F₁₆</strong> diubah melalui Central Binary, tentukan bentuk biner dan nilai desimalnya!",
        options: [
          { text: "Biner: 0010 1111₂, Desimal: 47₁₀", correct: true },
          { text: "Biner: 0011 1110₂, Desimal: 62₁₀", correct: false },
          { text: "Biner: 0010 1110₂, Desimal: 46₁₀", correct: false },
          { text: "Biner: 0001 1111₂, Desimal: 31₁₀", correct: false }
        ],
        explanation: `
          <strong>Pembahasan:</strong><br/>
          1. Digit 2₁₆ = <code>0010₂</code>.<br/>
          2. Digit F₁₆ (15₁₀) = <code>1111₂</code>.<br/>
          3. Gabungkan Biner Sentral: <code>00101111₂</code>.<br/>
          4. Desimal: 32 + 8 + 4 + 2 + 1 = <strong>47₁₀</strong>.
        `
      },
      {
        id: 4,
        title: "Aturan Pengelompokan Bit Konversi ke Heksadesimal & Oktal",
        category: "Minggu 1: Kaidah Konversi",
        prompt: "Mengapa konversi dari Biner ke Heksadesimal dikelompokkan per <strong>4 bit</strong> dan ke Oktal per <strong>3 bit</strong>?",
        options: [
          { text: "Karena 2⁴ = 16 (basis Heksa) dan 2³ = 8 (basis Oktal)", correct: true },
          { text: "Karena arsitektur CPU hanya memproses 3 dan 4 bit", correct: false },
          { text: "Karena angka 4 dan 3 adalah bilangan prima", correct: false },
          { text: "Karena standar IEEE 754 mewajibkannya", correct: false }
        ],
        explanation: `
          <strong>Pembahasan:</strong><br/>
          Sistem bilangan biner memiliki basis 2. Basis oktal adalah 8 (dimana 8 = 2³), sehingga 1 digit oktal tepat mewakili 3 bit biner.<br/>
          Basis heksadesimal adalah 16 (dimana 16 = 2⁴), sehingga 1 digit heksadesimal tepat mewakili 4 bit biner (1 nibble).
        `
      },
      {
        id: 5,
        title: "Pengenalan 2's Complement: Nilai Biner Bertanda 1110 0110₂",
        category: "Minggu 2 Preview: Bilangan Negatif",
        prompt: "Pada sistem bertanda 8-bit Two's Complement (C2), berapakah nilai desimal dari biner <strong>1110 0110₂</strong>?",
        options: [
          { text: "-26₁₀", correct: true },
          { text: "-37₁₀", correct: false },
          { text: "+230₁₀", correct: false },
          { text: "-102₁₀", correct: false }
        ],
        explanation: `
          <strong>Pembahasan (Sesuai Slide Pertemuan 2):</strong><br/>
          • MSB = 1 (bilangan bertanda negatif).<br/>
          • Nilai unsigned U = 128 + 64 + 32 + 4 + 2 = 230.<br/>
          • Cara cepat rumus C2: Nilai = -(2⁸ - U) = -(256 - 230) = <strong>-26₁₀</strong>.<br/>
          Atau ambil NOT + 1: NOT(1110 0110) = 0001 1001 (25) + 1 = 0001 1010 (26) ⇒ <strong>-26</strong>.
        `
      }
    ];
  }

  init() {
    this.renderQuestion();
    this.bindEvents();
  }

  bindEvents() {
    const nextBtn = document.getElementById("quiz-next-btn");
    const randomBtn = document.getElementById("quiz-random-btn");

    if (nextBtn) {
      nextBtn.onclick = () => {
        this.currentQuestionIdx = (this.currentQuestionIdx + 1) % this.questions.length;
        this.renderQuestion();
      };
    }

    if (randomBtn) {
      randomBtn.onclick = () => {
        this.generateRandomProblem();
      };
    }
  }

  renderQuestion() {
    const q = this.questions[this.currentQuestionIdx];
    const counterElem = document.getElementById("quiz-counter");
    const promptElem = document.getElementById("quiz-prompt");
    const optionsGrid = document.getElementById("quiz-options-grid");
    const feedbackBox = document.getElementById("quiz-feedback");
    const nextBtn = document.getElementById("quiz-next-btn");

    if (!promptElem || !optionsGrid) return;

    if (counterElem) {
      counterElem.textContent = `Soal ${this.currentQuestionIdx + 1} dari ${this.questions.length}`;
    }

    promptElem.innerHTML = `<span style="font-size: 0.8rem; color: var(--cyan-primary); text-transform: uppercase; font-family: var(--font-mono); display: block; margin-bottom: 6px;">[${q.category}]</span> ${q.prompt}`;

    if (feedbackBox) {
      feedbackBox.className = "quiz-feedback-box";
      feedbackBox.style.display = "none";
      feedbackBox.innerHTML = "";
    }

    if (nextBtn) {
      nextBtn.style.display = "none";
    }

    // Render option buttons
    let html = "";
    q.options.forEach((opt, idx) => {
      html += `
        <button class="answer-option-btn" data-idx="${idx}">
          <span><strong>${String.fromCharCode(65 + idx)}.</strong> ${opt.text}</span>
          <span class="option-icon"></span>
        </button>
      `;
    });

    optionsGrid.innerHTML = html;

    // Attach click listeners to options
    optionsGrid.querySelectorAll(".answer-option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        this.checkAnswer(idx);
      });
    });
  }

  checkAnswer(selectedIdx) {
    const q = this.questions[this.currentQuestionIdx];
    const optionsGrid = document.getElementById("quiz-options-grid");
    const feedbackBox = document.getElementById("quiz-feedback");
    const scoreElem = document.getElementById("quiz-score-val");
    const nextBtn = document.getElementById("quiz-next-btn");

    if (!optionsGrid || !feedbackBox) return;

    const buttons = optionsGrid.querySelectorAll(".answer-option-btn");
    buttons.forEach((btn, idx) => {
      btn.disabled = true; // Disable further clicks
      if (q.options[idx].correct) {
        btn.classList.add("correct");
        btn.querySelector(".option-icon").innerHTML = "✓";
      } else if (idx === selectedIdx) {
        btn.classList.add("wrong");
        btn.querySelector(".option-icon").innerHTML = "✗";
      }
    });

    const isCorrect = q.options[selectedIdx].correct;
    if (isCorrect) {
      this.score += 20;
      feedbackBox.className = "quiz-feedback-box correct-fb";
      feedbackBox.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 6px; font-size: 1.05rem;">🎉 Jawaban Benar! Luar Biasa!</div>
        <div>${q.explanation}</div>
      `;
    } else {
      feedbackBox.className = "quiz-feedback-box wrong-fb";
      feedbackBox.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 6px; font-size: 1.05rem;">❌ Jawaban Kurang Tepat!</div>
        <div>${q.explanation}</div>
      `;
    }

    if (scoreElem) {
      scoreElem.textContent = `${this.score} Poin`;
    }

    if (nextBtn) {
      nextBtn.style.display = "inline-flex";
    }
  }

  generateRandomProblem() {
    // Generate random decimal between 10 and 511
    const randDec = Math.floor(Math.random() * 500) + 12;
    const binStr = randDec.toString(2);
    const hexStr = randDec.toString(16).toUpperCase();
    const octStr = randDec.toString(8);

    const newQuestion = {
      id: Date.now(),
      title: `Tantangan Acak: Konversi ${randDec}₁₀`,
      category: "Mode Latihan Mandiri Acak",
      prompt: `Berapakah nilai <strong>Heksadesimal</strong> dan <strong>Oktal</strong> dari bilangan desimal <strong>${randDec}₁₀</strong>?`,
      options: [
        { text: `Hex: ${hexStr}₁₆, Oktal: ${octStr}₈`, correct: true },
        { text: `Hex: ${(randDec + 2).toString(16).toUpperCase()}₁₆, Oktal: ${(randDec + 2).toString(8)}₈`, correct: false },
        { text: `Hex: ${(randDec - 1).toString(16).toUpperCase()}₁₆, Oktal: ${(randDec + 4).toString(8)}₈`, correct: false },
        { text: `Hex: ${octStr}₁₆, Oktal: ${hexStr}₈`, correct: false }
      ],
      explanation: `
        <strong>Langkah Central Binary untuk ${randDec}₁₀:</strong><br/>
        1. Biner Pusat = <code>${binStr}₂</code><br/>
        2. Dikelompokkan 4-bit (Heksa) = <strong>${hexStr}₁₆</strong><br/>
        3. Dikelompokkan 3-bit (Oktal) = <strong>${octStr}₈</strong>
      `
    };

    // Shuffle options
    newQuestion.options.sort(() => Math.random() - 0.5);

    this.questions.push(newQuestion);
    this.currentQuestionIdx = this.questions.length - 1;
    this.renderQuestion();
  }
}

window.quizEngine = new QuizEngine();
