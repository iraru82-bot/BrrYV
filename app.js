(() => {
  const $ = (selector) => document.querySelector(selector);
  const canvas = $('#sort-canvas');
  const ctx = canvas.getContext('2d');
  const canvasWrap = $('#canvas-wrap');
  const names = [
    ['Пузырьковая сортировка','Bubble sort','Сравнение'],['Сортировка вставками','Insertion sort','Сравнение'],['Сортировка выбором','Selection sort','Сравнение'],['Шейкерная сортировка','Cocktail shaker','Сравнение'],['Сортировка Шелла','Shell sort','Сравнение'],['Сортировка расчёской','Comb sort','Сравнение'],['Гномья сортировка','Gnome sort','Сравнение'],['Чётно-нечётная сортировка','Odd-even sort','Сравнение'],['Быстрая сортировка','Quick sort','Сравнение'],['Пирамидальная сортировка','Heap sort','Сравнение'],['Сортировка слиянием','Merge sort','Сравнение'],['Циклическая сортировка','Cycle sort','Сравнение'],['Сортировка подсчётом','Counting sort','Распределение'],['Поразрядная сортировка','Radix sort','Распределение']
  ];
  const variants = ['обычный проход','ранний выход','граница последнего обмена','двунаправленный проход','короткие серии','редкие элементы сначала','соседние перестановки','адаптивный проход','сбалансированные границы','малые серии','плотная перестановка','локальный минимум','оптимизированный шаг','обратный просмотр','плавное сужение','короткий диапазон','длинный диапазон','смешанный порядок','бережный проход','контроль границ','быстрый вариант','ровный темп','компактный вариант','пошаговый режим','альтернативная схема'];
  const categories = ['Все','Сравнение','Распределение'];
  const families = names.map((n, id) => ({ id, ru: n[0], en: n[1], category: n[2] }));
  const algorithms = [];
  families.forEach((family) => {
    for (let v = 0; v < 25; v++) algorithms.push({
      id: family.id * 25 + v,
      family: family.id,
      category: family.category,
      title: family.ru,
      variant: variants[v],
      label: `${family.ru} · ${variants[v]}`,
      search: `${family.ru} ${family.en} ${variants[v]} ${family.category}`.toLowerCase()
    });
  });

  let data = [];
  let active = [];
  let selected = algorithms[8 * 25 + 6];
  let chosenCategory = 'Все';
  let sorting = false;
  let paused = false;
  let iterator = null;
  let operations = 0;
  let sorted = false;
  let sortStartedAt = 0;
  let toastTimer;
  const sizeInput = $('#size-slider');
  const speedInput = $('#speed-slider');

  function seededArray(length, shuffled = true) {
    const arr = Array.from({ length }, (_, i) => i + 1);
    if (!shuffled) return arr;
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function fitCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }
  function render() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const n = data.length || 1;
    const max = Math.max(...data, 1);
    const gap = n > 135 ? 1.05 : 1.5;
    const lineWidth = Math.max(.8, w / n - gap);
    const activeSet = new Set(active);
    for (let i = 0; i < n; i++) {
      const val = data[i] || 0;
      const height = Math.max(2, (val / max) * (h - 13));
      const x = (i / n) * w + (w / n - lineWidth) / 2;
      if (sorted) ctx.strokeStyle = '#8494ff';
      else if (activeSet.has(i)) ctx.strokeStyle = '#d8ff72';
      else {
        const hue = 153 + (val / max) * 12;
        ctx.strokeStyle = `hsl(${hue} 70% ${48 + (val / max) * 12}%)`;
      }
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(x, h - 2);
      ctx.lineTo(x, h - 2 - height);
      ctx.stroke();
    }
  }
  function updateUI() {
    $('#array-size-readout').textContent = data.length;
    $('#size-readout').textContent = sizeInput.value;
    $('#operation-readout').textContent = operations.toLocaleString('ru-RU');
    $('#current-algorithm').textContent = selected.label;
    $('#play-button').classList.toggle('is-running', sorting && !paused);
    $('#play-label').textContent = sorting ? (paused ? 'Продолжить' : 'Пауза') : 'Запустить';
    $('#run-status').classList.toggle('running', sorting && !paused);
    $('#run-status').classList.toggle('done', sorted);
    $('#status-label').textContent = sorting ? (paused ? 'ПАУЗА' : 'ВЫПОЛНЯЕТСЯ') : sorted ? 'СОРТИРОВКА ЗАВЕРШЕНА' : 'ГОТОВО К ЗАПУСКУ';
    $('#canvas-empty').hidden = !sorted;
    render();
  }
  function resetArray(shuffle = true) {
    stopSort();
    data = seededArray(Number(sizeInput.value), shuffle);
    operations = 0;
    active = [];
    sorted = false;
    updateUI();
  }
  function stopSort() {
    sorting = false;
    paused = false;
    iterator = null;
  }
  const event = (indices) => ({ indices });
  function* swap(a, i, j) {
    yield event([i, j]);
    [a[i], a[j]] = [a[j], a[i]];
    yield event([i, j]);
  }
  function* write(a, i, value, highlight = [i]) {
    a[i] = value;
    yield event(highlight);
  }
  function* compare(a, i, j) { yield event([i, j]); return a[i] - a[j]; }

  function* bubble(a, v) {
    const n = a.length; let end = n - 1, swapped = true;
    while (swapped && end > 0) {
      swapped = false; let last = 0;
      const start = v % 4 === 3 ? end - 1 : 0;
      const stop = v % 4 === 3 ? -1 : end;
      const step = v % 4 === 3 ? -1 : 1;
      for (let i = start; i !== stop; i += step) {
        if ((yield* compare(a, i, i + 1)) > 0) { yield* swap(a, i, i + 1); swapped = true; last = i; }
      }
      if (v % 3 === 2 && swapped) end = Math.max(0, last);
      else end--;
    }
  }
  function* insertion(a, v) {
    for (let i = 1; i < a.length; i++) {
      const key = a[i]; let j = i - 1;
      while (j >= 0) {
        const cmp = yield* compare(a, j, j + 1);
        if (a[j] <= key) break;
        a[j + 1] = a[j]; yield event([j, j + 1]); j--;
      }
      if (j + 1 !== i) yield* write(a, j + 1, key, [j + 1, i]);
    }
  }
  function* selection(a, v) {
    for (let i = 0; i < a.length - 1; i++) {
      let min = i;
      for (let j = i + 1; j < a.length; j++) if ((yield* compare(a, min, j)) > 0) min = j;
      if (min !== i) yield* swap(a, i, min);
      if (v % 4 === 3) yield event([i]);
    }
  }
  function* cocktail(a, v) {
    let lo = 0, hi = a.length - 1, changed = true;
    while (changed) {
      changed = false;
      for (let i = lo; i < hi; i++) if ((yield* compare(a, i, i + 1)) > 0) { yield* swap(a, i, i + 1); changed = true; }
      if (!changed) break; hi--;
      for (let i = hi; i > lo; i--) if ((yield* compare(a, i - 1, i)) > 0) { yield* swap(a, i - 1, i); changed = true; }
      lo++; if (v % 5 === 1 && !changed) break;
    }
  }
  function* shell(a, v) {
    const gaps = v % 3 === 0 ? [701, 301, 132, 57, 23, 10, 4, 1] : v % 3 === 1 ? [Math.floor(a.length / 2), Math.floor(a.length / 4), Math.floor(a.length / 8), 1] : [Math.floor(a.length / 2.2), Math.floor(a.length / 4.8), Math.floor(a.length / 10), 1];
    const used = [...new Set(gaps.filter(g => g > 0 && g < a.length).concat(1))];
    for (const gap of used) for (let i = gap; i < a.length; i++) {
      const x = a[i]; let j = i;
      while (j >= gap) { yield event([j - gap, j]); if (a[j - gap] <= x) break; a[j] = a[j - gap]; yield event([j - gap, j]); j -= gap; }
      if (j !== i) yield* write(a, j, x, [j, i]);
    }
  }
  function* comb(a, v) {
    let gap = a.length, swapped = true; const shrink = [1.3, 1.247, 1.25, 1.28][v % 4];
    while (gap > 1 || swapped) { gap = Math.max(1, Math.floor(gap / shrink)); swapped = false;
      for (let i = 0; i + gap < a.length; i++) if ((yield* compare(a, i, i + gap)) > 0) { yield* swap(a, i, i + gap); swapped = true; }
    }
  }
  function* gnome(a) {
    let i = 1;
    while (i < a.length) { if (i === 0 || (yield* compare(a, i - 1, i)) <= 0) i++; else { yield* swap(a, i - 1, i); i--; } }
  }
  function* oddEven(a) {
    let sortedNow = false;
    while (!sortedNow) { sortedNow = true;
      for (let parity = 0; parity <= 1; parity++) for (let i = parity; i < a.length - 1; i += 2) if ((yield* compare(a, i, i + 1)) > 0) { yield* swap(a, i, i + 1); sortedNow = false; }
    }
  }
  function* quick(a, v) {
    function* part(lo, hi) {
      if (lo >= hi) return;
      let pivotIndex = lo + Math.floor((hi - lo) / 2);
      if (v % 3 === 1) pivotIndex = lo;
      if (v % 3 === 2) pivotIndex = hi;
      const pivot = a[pivotIndex]; let i = lo, j = hi;
      while (i <= j) {
        while (i <= hi) { yield event([i, pivotIndex]); if (a[i] >= pivot) break; i++; }
        while (j >= lo) { yield event([j, pivotIndex]); if (a[j] <= pivot) break; j--; }
        if (i <= j) { if (i !== j) yield* swap(a, i, j); i++; j--; }
      }
      if (lo < j) yield* part(lo, j);
      if (i < hi) yield* part(i, hi);
    }
    yield* part(0, a.length - 1);
  }
  function* heap(a) {
    const n = a.length;
    function* sift(root, end) { while (root * 2 + 1 <= end) { let child = root * 2 + 1; if (child + 1 <= end && (yield* compare(a, child, child + 1)) < 0) child++; if ((yield* compare(a, root, child)) >= 0) return; yield* swap(a, root, child); root = child; } }
    for (let start = Math.floor((n - 2) / 2); start >= 0; start--) yield* sift(start, n - 1);
    for (let end = n - 1; end > 0; end--) { yield* swap(a, 0, end); yield* sift(0, end - 1); }
  }
  function* mergeSort(a) {
    const n = a.length, aux = new Array(n);
    for (let width = 1; width < n; width *= 2) for (let left = 0; left < n; left += 2 * width) {
      const mid = Math.min(left + width, n), right = Math.min(left + 2 * width, n); let i = left, j = mid, k = left;
      while (i < mid && j < right) { yield event([i, j]); aux[k++] = a[i] <= a[j] ? a[i++] : a[j++]; }
      while (i < mid) aux[k++] = a[i++]; while (j < right) aux[k++] = a[j++];
      for (let p = left; p < right; p++) yield* write(a, p, aux[p], [p]);
    }
  }
  function* cycle(a) {
    const n = a.length;
    for (let start = 0; start < n - 1; start++) {
      let item = a[start], pos = start;
      for (let i = start + 1; i < n; i++) { yield event([start, i]); if (a[i] < item) pos++; }
      if (pos === start) continue;
      while (item === a[pos]) pos++;
      if (pos !== start) { [a[pos], item] = [item, a[pos]]; yield event([start, pos]); }
      while (pos !== start) {
        pos = start;
        for (let i = start + 1; i < n; i++) { yield event([start, i]); if (a[i] < item) pos++; }
        while (item === a[pos]) pos++;
        [a[pos], item] = [item, a[pos]]; yield event([start, pos]);
      }
    }
  }
  function* counting(a) {
    const max = Math.max(...a), counts = new Array(max + 1).fill(0);
    for (let i = 0; i < a.length; i++) { yield event([i]); counts[a[i]]++; }
    let k = 0;
    for (let value = 0; value < counts.length; value++) while (counts[value]-- > 0) { const index = k++; yield* write(a, index, value, [index]); }
  }
  function* radix(a, v) {
    const base = 2 + (v % 15); let max = Math.max(...a);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= base) {
      const out = new Array(a.length), count = new Array(base).fill(0);
      for (let i = 0; i < a.length; i++) { yield event([i]); count[Math.floor(a[i] / exp) % base]++; }
      for (let i = 1; i < base; i++) count[i] += count[i - 1];
      for (let i = a.length - 1; i >= 0; i--) { const digit = Math.floor(a[i] / exp) % base; out[--count[digit]] = a[i]; }
      for (let i = 0; i < a.length; i++) yield* write(a, i, out[i], [i]);
    }
  }
  const sorters = [bubble, insertion, selection, cocktail, shell, comb, gnome, oddEven, quick, heap, mergeSort, cycle, counting, radix];
  function makeSorter() { return sorters[selected.family](data, selected.id % 25); }
  function finishSort() {
    sorting = false; paused = false; sorted = data.every((v, i) => i === 0 || data[i - 1] <= v); active = [];
    if (!sorted) { toast('Похоже, что-то пошло не так. Перемешай массив и попробуй снова.'); }
    updateUI();
  }
  function consumeOne() {
    if (!iterator) return false;
    const next = iterator.next();
    if (next.done) { finishSort(); return false; }
    active = next.value?.indices || [];
    operations++;
    return true;
  }
  function animate() {
    if (!sorting || paused) return;
    const speed = Number(speedInput.value);
    const batch = Math.max(1, Math.floor(1 + speed * speed / 95));
    for (let i = 0; i < batch && sorting; i++) if (!consumeOne()) break;
    updateUI();
    if (sorting) requestAnimationFrame(animate);
  }
  function toggleSort() {
    if (sorting) { paused = !paused; updateUI(); if (!paused) requestAnimationFrame(animate); return; }
    if (sorted) resetArray(true);
    sorted = false; operations = 0; active = []; iterator = makeSorter(); sorting = true; paused = false; sortStartedAt = performance.now(); updateUI(); requestAnimationFrame(animate);
  }
  function stepOnce() {
    if (!sorting) { sorted = false; operations = 0; iterator = makeSorter(); sorting = true; paused = true; }
    paused = true; consumeOne(); updateUI();
  }
  function toast(message) { const node = $('#toast'); node.textContent = message; node.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove('show'), 2400); }

  function renderCategories() {
    $('#category-strip').innerHTML = categories.map(c => `<button class="filter-chip ${c === chosenCategory ? 'active' : ''}" type="button" data-category="${c}">${c}</button>`).join('');
  }
  function renderList() {
    const query = $('#search-input').value.trim().toLowerCase();
    const items = algorithms.filter(a => (chosenCategory === 'Все' || a.category === chosenCategory) && (!query || a.search.includes(query)));
    $('#algorithm-list').innerHTML = items.length ? items.map(a => `<button class="algorithm-item ${a.id === selected.id ? 'selected' : ''}" type="button" role="option" aria-selected="${a.id === selected.id}" data-id="${a.id}"><span class="algo-index">${String(a.id + 1).padStart(3, '0')}</span><span class="algo-copy"><span class="algo-name">${a.title}</span><span class="algo-variant">${a.variant}</span></span><i class="algo-category" title="${a.category}"></i></button>`).join('') : '<div class="no-results">Ничего не найдено.<br>Попробуй другой запрос.</div>';
  }
  $('#algorithm-list').addEventListener('click', (e) => {
    const item = e.target.closest('.algorithm-item'); if (!item) return;
    selected = algorithms[Number(item.dataset.id)]; resetArray(true); renderList();
  });
  $('#category-strip').addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip'); if (!chip) return;
    chosenCategory = chip.dataset.category; renderCategories(); renderList();
  });
  $('#search-input').addEventListener('input', renderList);
  $('#play-button').addEventListener('click', toggleSort);
  $('#step-button').addEventListener('click', stepOnce);
  $('#shuffle-button').addEventListener('click', () => resetArray(true));
  $('#reset-button').addEventListener('click', () => resetArray(false));
  sizeInput.addEventListener('input', () => { $('#size-readout').textContent = sizeInput.value; resetArray(true); });
  speedInput.addEventListener('input', () => {
    const val = Number(speedInput.value);
    $('#speed-readout').textContent = val < 25 ? 'Медленная' : val < 70 ? 'Средняя' : 'Быстрая';
  });
  window.addEventListener('resize', fitCanvas);
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input')) return;
    if (e.code === 'Space') { e.preventDefault(); toggleSort(); }
    if (e.key === '/') { e.preventDefault(); $('#search-input').focus(); }
  });
  const dialog = $('#about-dialog');
  $('#about-button').addEventListener('click', () => dialog.showModal());
  $('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

  data = seededArray(Number(sizeInput.value));
  $('#algorithm-count').textContent = algorithms.length;
  renderCategories(); renderList(); updateUI(); fitCanvas();
})();
