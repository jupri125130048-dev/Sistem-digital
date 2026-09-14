/**
 * SISTEM DIGITAL - MEDIA AJAR INTERAKTIF
 * Engine Konversi Sentral Biner (Central Binary Hub)
 * Konversi semua bilangan (Desimal, Oktal, Heksadesimal) ke BINER sebagai jembatan sentral,
 * lalu dikelompokkan 4 bit (Heksa), 3 bit (Oktal), dan penjumlahan bobot 2^n (Desimal).
 */

class CentralBinaryEngine {
  constructor() {
    this.currentBase = 10;
    this.currentRawInput = "258";
    this.binaryInt = "100000010";
    this.binaryFrac = "";
    this.bitBoardBits = [0, 0, 0, 0, 0, 0, 0, 0]; // 8-bit board default
  }

  init() {
    this.bindEvents();
    this.processInput(this.currentRawInput, this.currentBase);
    this.initBitBoard(8);
  }

  bindEvents() {
    const inputVal = document.getElementById("hub-input-val");
    const inputBase = document.getElementById("hub-input-base");
    const bitBoardSize = document.getElementById("board-size-select");

    if (inputVal) {
      inputVal.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        const base = parseInt(inputBase ? inputBase.value : 10, 10);
        this.processInput(val, base);
      });
    }

    if (inputBase) {
      inputBase.addEventListener("change", (e) => {
        const base = parseInt(e.target.value, 10);
        const inputElem = document.getElementById("hub-input-val");
        if (inputElem) {
          this.updateInputPlaceholder(base, inputElem);
          this.processInput(inputElem.value.trim(), base);
        }
      });
    }

    if (bitBoardSize) {
      bitBoardSize.addEventListener("change", (e) => {
        const size = parseInt(e.target.value, 10);
        this.initBitBoard(size);
      });
    }

    // Preset buttons delegation (only register once on document)
    if (!this.presetListenerBound) {
      document.addEventListener("click", (e) => {
        const btn = e.target.closest(".preset-btn");
        if (btn) {
          const val = btn.dataset.val;
          const base = parseInt(btn.dataset.base, 10);
          this.setPreset(val, base);
        }
      });
      this.presetListenerBound = true;
    }
  }

  updateInputPlaceholder(base, inputElem) {
    switch (base) {
      case 2:
        inputElem.placeholder = "Contoh: 1011.0011 atau 11001";
        break;
      case 8:
        inputElem.placeholder = "Contoh: 402 atau 175 atau 346";
        break;
      case 16:
        inputElem.placeholder = "Contoh: 102 atau 2F atau 1A.8";
        break;
      case 10:
      default:
        inputElem.placeholder = "Contoh: 258 atau 25 atau 0.625";
        break;
    }
  }

  setPreset(val, base) {
    const inputVal = document.getElementById("hub-input-val");
    const inputBase = document.getElementById("hub-input-base");
    if (inputVal && inputBase) {
      inputBase.value = base;
      inputVal.value = val;
      this.updateInputPlaceholder(base, inputVal);
      this.processInput(val, base);
    }
  }

  /**
   * Main input parser that converts any base to Central Binary representation
   */
  processInput(rawStr, base) {
    const errorBox = document.getElementById("hub-error-msg");
    if (errorBox) errorBox.style.display = "none";

    if (!rawStr) {
      this.binaryInt = "0";
      this.binaryFrac = "";
      this.renderAll();
      return;
    }

    // Clean formatting and uppercase
    const cleaned = rawStr.toUpperCase().replace(/\s+/g, "");
    const parts = cleaned.split(".");
    const intPartStr = parts[0] || "0";
    const fracPartStr = parts.length > 1 ? parts[1] : "";

    // Validation
    const regexMap = {
      2: /^[01]*$/,
      8: /^[0-7]*$/,
      10: /^[0-9]*$/,
      16: /^[0-9A-F]*$/
    };

    if (!regexMap[base].test(intPartStr) || (fracPartStr && !regexMap[base].test(fracPartStr))) {
      if (errorBox) {
        errorBox.textContent = `⚠️ Nilai tidak valid untuk Basis ${base}! Gunakan simbol angka yang sesuai.`;
        errorBox.style.display = "block";
      }
      return;
    }

    this.currentRawInput = cleaned;
    this.currentBase = base;

    // STEP 1: Convert any input to Central Binary
    let binaryInt = "";
    let binaryFrac = "";

    if (base === 2) {
      binaryInt = intPartStr || "0";
      binaryFrac = fracPartStr;
    } else if (base === 8) {
      // Direct 3-bit mapping
      binaryInt = this.octalToBinary(intPartStr);
      binaryFrac = this.octalFracToBinary(fracPartStr);
    } else if (base === 16) {
      // Direct 4-bit mapping
      binaryInt = this.hexToBinary(intPartStr);
      binaryFrac = this.hexFracToBinary(fracPartStr);
    } else {
      // Decimal to Binary via division & multiplication
      binaryInt = this.decimalToBinary(intPartStr);
      binaryFrac = this.decimalFracToBinary(fracPartStr);
    }

    // Clean leading zeroes in integer binary except single zero
    binaryInt = binaryInt.replace(/^0+/, "") || "0";

    this.binaryInt = binaryInt;
    this.binaryFrac = binaryFrac;

    // Render visual outputs
    this.renderAll();
  }

  /* ------------------- Base to Binary Conversion Helpers ------------------- */
  decimalToBinary(decStr) {
    if (!decStr || decStr === "0") return "0";
    let n = BigInt(decStr);
    if (n === 0n) return "0";
    let bin = "";
    while (n > 0n) {
      bin = (n % 2n).toString() + bin;
      n = n / 2n;
    }
    return bin;
  }

  decimalFracToBinary(fracStr, maxBits = 8) {
    if (!fracStr) return "";
    let val = parseFloat("0." + fracStr);
    let result = "";
    let count = 0;
    while (val > 0 && count < maxBits) {
      val *= 2;
      if (val >= 1) {
        result += "1";
        val -= 1;
      } else {
        result += "0";
      }
      count++;
    }
    return result;
  }

  octalToBinary(octStr) {
    if (!octStr) return "0";
    let bin = "";
    for (let i = 0; i < octStr.length; i++) {
      const octDigit = parseInt(octStr[i], 8);
      bin += octDigit.toString(2).padStart(3, "0");
    }
    return bin;
  }

  octalFracToBinary(octStr) {
    if (!octStr) return "";
    let bin = "";
    for (let i = 0; i < octStr.length; i++) {
      const octDigit = parseInt(octStr[i], 8);
      bin += octDigit.toString(2).padStart(3, "0");
    }
    return bin;
  }

  hexToBinary(hexStr) {
    if (!hexStr) return "0";
    let bin = "";
    for (let i = 0; i < hexStr.length; i++) {
      const hexDigit = parseInt(hexStr[i], 16);
      bin += hexDigit.toString(2).padStart(4, "0");
    }
    return bin;
  }

  hexFracToBinary(hexStr) {
    if (!hexStr) return "";
    let bin = "";
    for (let i = 0; i < hexStr.length; i++) {
      const hexDigit = parseInt(hexStr[i], 16);
      bin += hexDigit.toString(2).padStart(4, "0");
    }
    return bin;
  }

  /* ------------------- Render Orchestrator ------------------- */
  renderAll() {
    this.renderCentralBinaryStream();
    this.renderHexGrouping();
    this.renderOctalGrouping();
    this.renderDecimalWeights();
    this.renderStepByStepSolver();
  }

  /**
   * Render Central Binary Interactive Stream
   */
  renderCentralBinaryStream() {
    const container = document.getElementById("central-binary-stream");
    if (!container) return;

    let html = "";
    const intBits = this.binaryInt.split("");

    // Render Integer Bits (MSB to LSB)
    intBits.forEach((bit, idx) => {
      const power = intBits.length - 1 - idx;
      const isOne = bit === "1";
      html += `
        <div class="bit-cell ${isOne ? "is-one" : ""}" data-part="int" data-idx="${idx}" title="Klik untuk mengubah bit (Posisi 2^${power})">
          <span class="bit-pos">2<sup>${power}</sup></span>
          <span class="bit-val">${bit}</span>
        </div>
      `;
    });

    // Render Fractional Bits if present
    if (this.binaryFrac && this.binaryFrac.length > 0) {
      html += `<div class="bit-cell fraction-point">.</div>`;
      const fracBits = this.binaryFrac.split("");
      fracBits.forEach((bit, idx) => {
        const power = -(idx + 1);
        const isOne = bit === "1";
        html += `
          <div class="bit-cell ${isOne ? "is-one" : ""}" data-part="frac" data-idx="${idx}" title="Klik untuk mengubah bit (Posisi 2^${power})">
            <span class="bit-pos">2<sup>${power}</sup></span>
            <span class="bit-val">${bit}</span>
          </div>
        `;
      });
    }

    container.innerHTML = html;

    // Attach click listener to flip bits interactively
    container.querySelectorAll(".bit-cell:not(.fraction-point)").forEach((cell) => {
      cell.addEventListener("click", () => {
        const part = cell.dataset.part;
        const idx = parseInt(cell.dataset.idx, 10);
        this.flipCentralBit(part, idx);
      });
    });
  }

  /**
   * Interactive bit toggle from the central stream
   */
  flipCentralBit(part, idx) {
    if (part === "int") {
      const bits = this.binaryInt.split("");
      bits[idx] = bits[idx] === "1" ? "0" : "1";
      this.binaryInt = bits.join("").replace(/^0+/, "") || "0";
    } else if (part === "frac") {
      const bits = this.binaryFrac.split("");
      bits[idx] = bits[idx] === "1" ? "0" : "1";
      this.binaryFrac = bits.join("");
    }

    // Reflect to input box if base is binary or decimal
    const inputVal = document.getElementById("hub-input-val");
    const inputBase = document.getElementById("hub-input-base");
    if (inputVal && inputBase) {
      const fullBin = this.binaryFrac ? `${this.binaryInt}.${this.binaryFrac}` : this.binaryInt;
      if (parseInt(inputBase.value, 10) === 2) {
        inputVal.value = fullBin;
      }
    }

    this.renderAll();
  }

  /**
   * Hexadecimal Spoke: Group by 4 bits (Nibble)
   */
  renderHexGrouping() {
    const groupsContainer = document.getElementById("hex-groups-container");
    const resultBadge = document.getElementById("hex-result-badge");
    if (!groupsContainer || !resultBadge) return;

    // 1. Integer grouping (Pad to multiple of 4 on left)
    const intLen = this.binaryInt.length;
    const remainder = intLen % 4;
    const padCount = remainder === 0 ? 0 : 4 - remainder;
    const paddedInt = "0".repeat(padCount) + this.binaryInt;

    let hexResult = "";
    let html = "";

    // Break into 4-bit nibbles
    for (let i = 0; i < paddedInt.length; i += 4) {
      const nibble = paddedInt.substring(i, i + 4);
      const val = parseInt(nibble, 2);
      const hexChar = val.toString(16).toUpperCase();
      hexResult += hexChar;

      const calcStr = `(${nibble[0]}×8)+(${nibble[1]}×4)+(${nibble[2]}×2)+(${nibble[3]}×1) = ${val}`;

      html += `
        <div class="bit-group-box">
          <div class="group-bits-row">
            ${nibble.split("").map((b, bIdx) => `<span style="color: ${b === '1' ? '#38bdf8' : '#94a3b8'}">${b}</span>`).join("")}
          </div>
          <div class="group-bracket"></div>
          <div class="group-calc">${calcStr}</div>
          <div class="group-result-digit">${hexChar}</div>
        </div>
      `;
    }

    // 2. Fractional grouping if present (Pad to multiple of 4 on right)
    if (this.binaryFrac && this.binaryFrac.length > 0) {
      const fracLen = this.binaryFrac.length;
      const fracRemainder = fracLen % 4;
      const fracPadCount = fracRemainder === 0 ? 0 : 4 - fracRemainder;
      const paddedFrac = this.binaryFrac + "0".repeat(fracPadCount);

      html += `<div style="font-size: 2rem; color: #a5b4fc; font-weight: 800; align-self: center;">.</div>`;
      hexResult += ".";

      for (let i = 0; i < paddedFrac.length; i += 4) {
        const nibble = paddedFrac.substring(i, i + 4);
        const val = parseInt(nibble, 2);
        const hexChar = val.toString(16).toUpperCase();
        hexResult += hexChar;

        html += `
          <div class="bit-group-box">
            <div class="group-bits-row">
              ${nibble.split("").map((b) => `<span style="color: ${b === '1' ? '#38bdf8' : '#94a3b8'}">${b}</span>`).join("")}
            </div>
            <div class="group-bracket"></div>
            <div class="group-calc">Nibble Pecahan = ${val}</div>
            <div class="group-result-digit">${hexChar}</div>
          </div>
        `;
      }
    }

    groupsContainer.innerHTML = html;
    resultBadge.textContent = `${hexResult}₁₆`;
  }

  /**
   * Octal Spoke: Group by 3 bits
   */
  renderOctalGrouping() {
    const groupsContainer = document.getElementById("octal-groups-container");
    const resultBadge = document.getElementById("octal-result-badge");
    if (!groupsContainer || !resultBadge) return;

    // 1. Integer grouping (Pad to multiple of 3 on left)
    const intLen = this.binaryInt.length;
    const remainder = intLen % 3;
    const padCount = remainder === 0 ? 0 : 3 - remainder;
    const paddedInt = "0".repeat(padCount) + this.binaryInt;

    let octResult = "";
    let html = "";

    // Break into 3-bit chunks
    for (let i = 0; i < paddedInt.length; i += 3) {
      const triad = paddedInt.substring(i, i + 3);
      const val = parseInt(triad, 2);
      const octChar = val.toString(8);
      octResult += octChar;

      const calcStr = `(${triad[0]}×4)+(${triad[1]}×2)+(${triad[2]}×1) = ${val}`;

      html += `
        <div class="bit-group-box">
          <div class="group-bits-row">
            ${triad.split("").map((b) => `<span style="color: ${b === '1' ? '#6ee7b7' : '#94a3b8'}">${b}</span>`).join("")}
          </div>
          <div class="group-bracket"></div>
          <div class="group-calc">${calcStr}</div>
          <div class="group-result-digit">${octChar}</div>
        </div>
      `;
    }

    // 2. Fractional grouping if present (Pad to multiple of 3 on right)
    if (this.binaryFrac && this.binaryFrac.length > 0) {
      const fracLen = this.binaryFrac.length;
      const fracRemainder = fracLen % 3;
      const fracPadCount = fracRemainder === 0 ? 0 : 3 - fracRemainder;
      const paddedFrac = this.binaryFrac + "0".repeat(fracPadCount);

      html += `<div style="font-size: 2rem; color: #6ee7b7; font-weight: 800; align-self: center;">.</div>`;
      octResult += ".";

      for (let i = 0; i < paddedFrac.length; i += 3) {
        const triad = paddedFrac.substring(i, i + 3);
        const val = parseInt(triad, 2);
        const octChar = val.toString(8);
        octResult += octChar;

        html += `
          <div class="bit-group-box">
            <div class="group-bits-row">
              ${triad.split("").map((b) => `<span style="color: ${b === '1' ? '#6ee7b7' : '#94a3b8'}">${b}</span>`).join("")}
            </div>
            <div class="group-bracket"></div>
            <div class="group-calc">3-bit = ${val}</div>
            <div class="group-result-digit">${octChar}</div>
          </div>
        `;
      }
    }

    groupsContainer.innerHTML = html;
    resultBadge.textContent = `${octResult}₈`;
  }

  /**
   * Decimal Spoke: Summation of 2^n positional weights
   */
  renderDecimalWeights() {
    const weightsContainer = document.getElementById("decimal-weights-container");
    const equationContainer = document.getElementById("decimal-sum-equation");
    const resultBadge = document.getElementById("decimal-result-badge");
    if (!weightsContainer || !equationContainer || !resultBadge) return;

    let totalSum = 0n;
    const equationTerms = [];
    let html = "";

    const intBits = this.binaryInt.split("");
    const intLen = intBits.length;

    // Integer weights from MSB to LSB
    intBits.forEach((bit, idx) => {
      const power = intLen - 1 - idx;
      const weightVal = 2n ** BigInt(power);
      const isOne = bit === "1";

      if (isOne) {
        totalSum += weightVal;
        equationTerms.push(`${weightVal.toString()} (2<sup>${power}</sup>)`);
      }

      html += `
        <div class="weight-tag ${isOne ? "active-weight" : ""}">
          <span class="weight-exp">2<sup>${power}</sup></span>
          <span class="weight-val">${weightVal > 999999n ? weightVal.toString().substring(0, 6) + "…" : weightVal.toString()}</span>
        </div>
      `;
    });

    // Fractional weights
    let fracSum = 0;
    if (this.binaryFrac && this.binaryFrac.length > 0) {
      const fracBits = this.binaryFrac.split("");
      fracBits.forEach((bit, idx) => {
        const power = -(idx + 1);
        const weightVal = Math.pow(2, power);
        const isOne = bit === "1";

        if (isOne) {
          fracSum += weightVal;
          equationTerms.push(`${weightVal} (2<sup>${power}</sup>)`);
        }

        html += `
          <div class="weight-tag ${isOne ? "active-weight" : ""}">
            <span class="weight-exp">2<sup>${power}</sup></span>
            <span class="weight-val">${weightVal}</span>
          </div>
        `;
      });
    }

    weightsContainer.innerHTML = html;

    const finalDecimal = fracSum > 0 ? (Number(totalSum) + fracSum).toString() : totalSum.toString();
    resultBadge.textContent = `${finalDecimal}₁₀`;

    if (equationTerms.length === 0) {
      equationContainer.innerHTML = `Jumlah = 0₁₀`;
    } else {
      equationContainer.innerHTML = `<strong>Σ Bobot Aktif:</strong> ` + equationTerms.join(" + ") + ` = <strong>${finalDecimal}₁₀</strong>`;
    }
  }

  /**
   * Step-by-Step Mathematical Solver Generation
   */
  renderStepByStepSolver() {
    const solverContainer = document.getElementById("step-by-step-solver");
    if (!solverContainer) return;

    let step1Title = `Langkah 1: Konversi Input ke Central Binary (${this.currentRawInput}${this.getBaseSubscript(this.currentBase)} → Biner)`;
    let step1Content = "";

    if (this.currentBase === 10) {
      step1Content = `
        <p>Menggunakan metode <strong>pembagian berulang dengan 2</strong> untuk bagian bulat dan catat sisa bagi dari bawah ke atas (MSB ke LSB):</p>
        <div style="overflow-x: auto;">
          <table class="math-table">
            <thead>
              <tr>
                <th>Operasi Pembagian</th>
                <th>Hasil Bagi (Quotient)</th>
                <th>Sisa (Remainder / Bit)</th>
              </tr>
            </thead>
            <tbody>
              ${this.generateDivisionRows(this.currentRawInput.split(".")[0])}
            </tbody>
          </table>
        </div>
        <p>Diperoleh representasi biner bulat: <code>${this.binaryInt}₂</code></p>
      `;
    } else if (this.currentBase === 8) {
      step1Content = `
        <p>Setiap digit oktal (0-7) langsung dikonversi menjadi <strong>3 bit biner</strong>:</p>
        <div style="margin: 10px 0; font-family: var(--font-mono);">
          ${this.currentRawInput.split("").map(ch => ch === '.' ? ' . ' : `[ ${ch}₈ → ${parseInt(ch, 8).toString(2).padStart(3, '0')}₂ ]`).join(" ")}
        </div>
        <p>Hasil penggabungan Central Binary: <code>${this.binaryInt}${this.binaryFrac ? '.' + this.binaryFrac : ''}₂</code></p>
      `;
    } else if (this.currentBase === 16) {
      step1Content = `
        <p>Setiap digit heksadesimal (0-F) langsung dipetakan ke <strong>4 bit biner (nibble)</strong>:</p>
        <div style="margin: 10px 0; font-family: var(--font-mono);">
          ${this.currentRawInput.split("").map(ch => ch === '.' ? ' . ' : `[ ${ch}₁₆ → ${parseInt(ch, 16).toString(2).padStart(4, '0')}₂ ]`).join(" ")}
        </div>
        <p>Hasil Central Binary: <code>${this.binaryInt}${this.binaryFrac ? '.' + this.binaryFrac : ''}₂</code></p>
      `;
    } else {
      step1Content = `<p>Input sudah merupakan bilangan biner murni: <code>${this.binaryInt}${this.binaryFrac ? '.' + this.binaryFrac : ''}₂</code>.</p>`;
    }

    const step2Title = `Langkah 2: Konversi Central Binary ke Heksadesimal (Pengelompokan 4 Bit)`;
    const step2Content = `
      <p>1. Ambil deretan bit biner dari arah kanan ke kiri (LSB ke MSB). Jika panjang bit bukan kelipatan 4, tambahkan <strong>0 di depan (padding MSB)</strong>.</p>
      <p>2. Konversikan setiap blok 4 bit menjadi nilai heksadesimal 0-9 dan A-F.</p>
      <div style="padding: 10px; background: rgba(0,0,0,0.2); border-radius: 6px; margin: 8px 0; font-family: var(--font-mono);">
        Biner Padded: <strong>${this.getPaddedBinaryForHex()}</strong><br/>
        Hasil Heksa: <strong>${document.getElementById("hex-result-badge") ? document.getElementById("hex-result-badge").textContent : ""}</strong>
      </div>
    `;

    const step3Title = `Langkah 3: Konversi Central Binary ke Oktal (Pengelompokan 3 Bit)`;
    const step3Content = `
      <p>1. Ambil deretan bit biner dari arah kanan ke kiri (LSB ke MSB). Jika panjang bit bukan kelipatan 3, tambahkan <strong>0 di depan (padding MSB)</strong>.</p>
      <p>2. Konversikan setiap blok 3 bit menjadi nilai oktal 0-7.</p>
      <div style="padding: 10px; background: rgba(0,0,0,0.2); border-radius: 6px; margin: 8px 0; font-family: var(--font-mono);">
        Biner Padded: <strong>${this.getPaddedBinaryForOctal()}</strong><br/>
        Hasil Oktal: <strong>${document.getElementById("octal-result-badge") ? document.getElementById("octal-result-badge").textContent : ""}</strong>
      </div>
    `;

    const step4Title = `Langkah 4: Konversi Central Binary ke Desimal (Penjumlahan Bobot 2ⁿ)`;
    const step4Content = `
      <p>Kalikan setiap digit bit $b_i$ dengan bobot posisinya $2^i$, lalu jumlahkan semua hasilnya:</p>
      <div style="padding: 10px; background: rgba(0,0,0,0.2); border-radius: 6px; margin: 8px 0;">
        ${document.getElementById("decimal-sum-equation") ? document.getElementById("decimal-sum-equation").innerHTML : ""}
      </div>
    `;

    solverContainer.innerHTML = `
      <div class="step-item open">
        <div class="step-header" onclick="this.parentElement.classList.toggle('open')">
          <div class="step-title-text"><span class="step-number">1</span> ${step1Title}</div>
          <span>▾</span>
        </div>
        <div class="step-body">${step1Content}</div>
      </div>

      <div class="step-item open">
        <div class="step-header" onclick="this.parentElement.classList.toggle('open')">
          <div class="step-title-text"><span class="step-number">2</span> ${step2Title}</div>
          <span>▾</span>
        </div>
        <div class="step-body">${step2Content}</div>
      </div>

      <div class="step-item open">
        <div class="step-header" onclick="this.parentElement.classList.toggle('open')">
          <div class="step-title-text"><span class="step-number">3</span> ${step3Title}</div>
          <span>▾</span>
        </div>
        <div class="step-body">${step3Content}</div>
      </div>

      <div class="step-item open">
        <div class="step-header" onclick="this.parentElement.classList.toggle('open')">
          <div class="step-title-text"><span class="step-number">4</span> ${step4Title}</div>
          <span>▾</span>
        </div>
        <div class="step-body">${step4Content}</div>
      </div>
    `;
  }

  generateDivisionRows(numStr) {
    let n = parseInt(numStr, 10);
    if (isNaN(n) || n <= 0) {
      return `<tr><td>0 ÷ 2</td><td>0</td><td><strong>0</strong> (LSB/MSB)</td></tr>`;
    }
    let rows = "";
    let stepCount = 0;
    while (n > 0 && stepCount < 20) {
      const quotient = Math.floor(n / 2);
      const rem = n % 2;
      rows += `
        <tr>
          <td>${n} ÷ 2</td>
          <td>${quotient}</td>
          <td><strong style="color: var(--cyan-primary)">${rem}</strong> ${stepCount === 0 ? "(LSB)" : quotient === 0 ? "(MSB)" : ""}</td>
        </tr>
      `;
      n = quotient;
      stepCount++;
    }
    return rows;
  }

  getPaddedBinaryForHex() {
    const rem = this.binaryInt.length % 4;
    const pad = rem === 0 ? 0 : 4 - rem;
    return "0".repeat(pad) + this.binaryInt;
  }

  getPaddedBinaryForOctal() {
    const rem = this.binaryInt.length % 3;
    const pad = rem === 0 ? 0 : 3 - rem;
    return "0".repeat(pad) + this.binaryInt;
  }

  getBaseSubscript(base) {
    switch (base) {
      case 2: return "₂";
      case 8: return "₈";
      case 16: return "₁₆";
      case 10:
      default: return "₁₀";
    }
  }

  /* ------------------- Interactive 8/16-Bit Switchboard ------------------- */
  initBitBoard(bitSize = 8) {
    this.bitBoardBits = new Array(bitSize).fill(0);
    this.renderBitBoard();
  }

  renderBitBoard() {
    const row = document.getElementById("board-bits-row");
    if (!row) return;

    let html = "";
    const size = this.bitBoardBits.length;

    for (let i = 0; i < size; i++) {
      const bitVal = this.bitBoardBits[i];
      const power = size - 1 - i;
      const weight = 2 ** power;

      html += `
        <div class="flipper-bit-cell">
          <div class="flipper-led ${bitVal === 1 ? "on" : ""}"></div>
          <button class="flipper-btn ${bitVal === 1 ? "active" : ""}" data-idx="${i}" title="Saklar Bit 2^${power}">
            ${bitVal}
          </button>
          <span class="flipper-btn-weight">2<sup>${power}</sup> (${weight})</span>
        </div>
      `;
    }

    row.innerHTML = html;

    // Attach click events
    row.querySelectorAll(".flipper-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        this.toggleBoardBit(idx);
      });
    });

    this.updateBitBoardStats();
  }

  toggleBoardBit(idx) {
    this.bitBoardBits[idx] = this.bitBoardBits[idx] === 1 ? 0 : 1;
    this.renderBitBoard();
  }

  updateBitBoardStats() {
    const binStr = this.bitBoardBits.join("");
    const decVal = parseInt(binStr, 2);
    const hexVal = decVal.toString(16).toUpperCase();
    const octVal = decVal.toString(8);

    const statBin = document.getElementById("board-stat-bin");
    const statDec = document.getElementById("board-stat-dec");
    const statHex = document.getElementById("board-stat-hex");
    const statOct = document.getElementById("board-stat-oct");

    if (statBin) statBin.textContent = binStr;
    if (statDec) statDec.textContent = decVal.toString();
    if (statHex) statHex.textContent = "0x" + hexVal;
    if (statOct) statOct.textContent = "0o" + octVal;
  }

  resetBitBoard() {
    this.bitBoardBits.fill(0);
    this.renderBitBoard();
  }

  invertBitBoard() {
    this.bitBoardBits = this.bitBoardBits.map(b => b === 1 ? 0 : 1);
    this.renderBitBoard();
  }
}

window.centralBinaryEngine = new CentralBinaryEngine();
