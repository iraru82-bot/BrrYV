(() => {
  const $ = (selector) => document.querySelector(selector);
  const canvas = $('#sort-canvas');
  const ctx = canvas.getContext('2d');
  const canvasWrap = $('#canvas-wrap');
  const definitions = [
    {name:'Пузырьковая сортировка', runner:'bubble', category:'Сравнение', modes:['ранний выход','граница последнего обмена','проход справа налево','сжатая граница','пошаговый проход','меньше сравнений','полный проход','адаптивная граница','короткие проходы','последний обмен']},
    {name:'Шейкерная сортировка', runner:'cocktail', category:'Сравнение', modes:['короткий цикл','ранний выход','граница обмена','слева направо','справа налево','две границы','адаптивный проход','сжатый диапазон','параллельные пары','полный цикл']},
    {name:'Сортировка расчёской', runner:'comb', category:'Сравнение', modes:['gap 1.247','gap 1.25','gap 1.3','gap 1.33','gap 1.5','мягкое сужение','быстрое сужение','Ciura-подобный шаг','редкие сравнения','плотный проход']},
    {name:'Сортировка вставками', runner:'insertion', category:'Сравнение', modes:['линейный поиск','обратный проход','короткие серии','адаптивный сдвиг','смежные сравнения','стабильная вставка','малый диапазон','пошаговая вставка','сдвиг блоками','естественные серии']},
    {name:'Двоичная сортировка вставками', runner:'binaryInsertion', category:'Сравнение', modes:['левая граница','правая граница','нижняя середина','верхняя середина','слева направо','обратный поиск','стабильная вставка','короткие серии','сдвиг блоками','адаптивный поиск']},
    {name:'Сортировка выбором', runner:'selection', category:'Сравнение', modes:['минимум слева','обратный поиск','короткий проход','сканирование справа','без пустого обмена','сжатый диапазон','поиск минимума','пошаговый выбор','контроль границы','полный скан']},
    {name:'Двойная сортировка выбором', runner:'doubleSelection', category:'Сравнение', modes:['min-max проход','обратный скан','сжатые границы','слева направо','справа налево','минимум первым','максимум первым','двойной проход','короткий диапазон','адаптивная граница']},
    {name:'Гномья сортировка', runner:'gnome', category:'Сравнение', modes:['шаг назад','короткий откат','линейное продвижение','контроль границы','адаптивный шаг','пошаговые обмены','соседние сравнения','быстрый возврат','прямой проход','бережный проход']},
    {name:'Чётно-нечётная сортировка', runner:'oddEven', category:'Сравнение', modes:['нечётная фаза первой','чётная фаза первой','ранний выход','полный проход','плотные фазы','короткий цикл','адаптивный проход','обменные пары','пошаговые фазы','контроль готовности']},
    {name:'Сортировка Шелла · Чиура', runner:'shellCiura', category:'Сравнение', modes:['Ciura gaps','расширенная Ciura','обратная серия','редкие интервалы','плотные интервалы','короткий последний шаг','смешанная серия','адаптивный gap','сдвиг вставками','пошаговые gap']},
    {name:'Сортировка Шелла · Токуда', runner:'shellTokuda', category:'Сравнение', modes:['Tokuda gaps','расширенная Tokuda','округление вверх','обратная серия','редкие интервалы','плотные интервалы','короткий последний шаг','смешанная серия','адаптивный gap','пошаговые gap']},
    {name:'Сортировка Шелла · Хиббард', runner:'shellHibbard', category:'Сравнение', modes:['Hibbard gaps','удвоенные интервалы','обратная серия','редкие интервалы','плотные интервалы','короткий последний шаг','смешанная серия','адаптивный gap','сдвиг вставками','пошаговые gap']},
    {name:'Быстрая сортировка · центральный элемент', runner:'quickMiddle', category:'Сравнение', modes:['серединный pivot','середина диапазона','левый рекурсивный край','правый рекурсивный край','двухуказательный','короткое разбиение','сбалансированный pivot','итеративный стиль','быстрая partition','адаптивный проход']},
    {name:'Быстрая сортировка · медиана трёх', runner:'quickMedian', category:'Сравнение', modes:['median-of-three','median-of-five','середина диапазона','случайный tie-break','двухуказательный','короткое разбиение','сбалансированный pivot','адаптивный проход','быстрая partition','пошаговое разбиение']},
    {name:'Быстрая сортировка · случайный опорный', runner:'quickRandom', category:'Сравнение', modes:['случайный pivot 1','случайный pivot 2','случайный pivot 3','случайный pivot 4','случайный pivot 5','seed 6','seed 7','seed 8','seed 9','seed 10']},
    {name:'Быстрая сортировка · первый опорный', runner:'quickFirst', category:'Сравнение', modes:['первый pivot','первый pivot + bounds','короткое разбиение','двухуказательный','адаптивный проход','равные ключи','малые серии','левый край','сбалансированный recurse','пошаговая partition']},
    {name:'Быстрая сортировка · последний опорный', runner:'quickLast', category:'Сравнение', modes:['последний pivot','последний pivot + bounds','короткое разбиение','двухуказательный','адаптивный проход','равные ключи','малые серии','правый край','сбалансированный recurse','пошаговая partition']},
    {name:'Трёхсторонняя быстрая сортировка', runner:'quick3', category:'Сравнение', modes:['Dutch flag','трёхсторонний scan','серединный pivot','случайный pivot','короткое разбиение','равные ключи','узкие диапазоны','пошаговый scan','адаптивный pivot','быстрая partition']},
    {name:'Пирамидальная сортировка · двоичная куча', runner:'heap', category:'Сравнение', modes:['max-heap','нижний sift','верхний sift','раннее завершение','плотная куча','короткий sift','полный проход','пошаговая куча','адаптивный sift','без лишнего обмена']},
    {name:'Сортировка слиянием · снизу вверх', runner:'mergeBottom', category:'Сравнение', modes:['ширина 1→2','короткие runs','слева сначала','устойчивое слияние','плотные блоки','двойной буфер','адаптивный хвост','пошаговое слияние','ранний хвост','обычный проход']},
    {name:'Сортировка слиянием · сверху вниз', runner:'mergeTop', category:'Сравнение', modes:['рекурсивное деление','середина вниз','устойчивое слияние','малые runs','слева сначала','двойной буфер','адаптивный хвост','пошаговое слияние','ранний хвост','обычный проход']},
    {name:'Естественная сортировка слиянием', runner:'naturalMerge', category:'Сравнение', modes:['естественные runs','реверс убывающих runs','короткий run','сбалансированное слияние','устойчивый merge','адаптивный хвост','двойной буфер','пошаговый merge','левый приоритет','обычный проход']},
    {name:'Циклическая сортировка', runner:'cycle', category:'Сравнение', modes:['минимум записей','цикл слева','короткий цикл','сравнение с ключом','обход справа','адаптивный проход','пошаговая запись','без лишнего write','полный подсчёт','обычный цикл']},
    {name:'Сортировка подсчётом', runner:'counting', category:'Распределение', modes:['частоты + запись','плотный диапазон','прямое распределение','пошаговый подсчёт','устойчивые позиции','малая память','сжатая частота','восстановление по ключу','сканирование значений','обычный проход']},
    {name:'Сортировка по ячейкам', runner:'pigeonhole', category:'Распределение', modes:['корзина на значение','плотные отверстия','обход слева','обход справа','распределение по ключу','пошаговая раскладка','малая память','сжатый диапазон','прямое восстановление','обычный проход']},
    {name:'Поразрядная сортировка · основание 2', runner:'radix2', category:'Распределение', modes:['бит за проход','LSB first','два кармана','стабильное распределение','плотный проход','пошаговый бит','малый буфер','обратная раскладка','адаптивный диапазон','обычный проход']},
    {name:'Поразрядная сортировка · основание 10', runner:'radix10', category:'Распределение', modes:['десятичные разряды','LSB first','10 карманов','стабильное распределение','плотный проход','пошаговый разряд','малый буфер','обратная раскладка','адаптивный диапазон','обычный проход']},
    {name:'Поразрядная сортировка · основание 16', runner:'radix16', category:'Распределение', modes:['hex разряды','LSB first','16 карманов','стабильное распределение','плотный проход','пошаговый разряд','малый буфер','обратная раскладка','адаптивный диапазон','обычный проход']},
    {name:'Карманная сортировка', runner:'bucket', category:'Распределение', modes:['10 buckets','корень из N buckets','20 buckets','мелкие корзины','плотные корзины','вставка внутри bucket','пошаговое распределение','слева направо','адаптивные корзины','обычный проход']},
    {name:'Блинная сортировка', runner:'pancake', category:'Сравнение', modes:['максимум на край','короткий flip','двойной переворот','поиск максимума','сжатая граница','пошаговые flips','без пустого flip','обратный поиск','адаптивный проход','обычный проход']},
    {name:'Древовидная сортировка', runner:'tree', category:'Сравнение', modes:['BST in-order','вставка слева','вставка справа','итеративный обход','плотное дерево','пошаговая вставка','сбалансированный tie','обход дерева','адаптивный диапазон','обычный проход']},
    {name:'Терпеливая сортировка', runner:'patience', category:'Распределение', modes:['минимальная верхушка','бинарный поиск стопок','линейный поиск стопок','пошаговые стопки','сборка heap','сборка слева','устойчивые стопки','адаптивные piles','короткие серии','обычный проход']},
    {name:'Сортировка нитями', runner:'strand', category:'Сравнение', modes:['устойчивая подпоследовательность','короткие strands','слева направо','последовательное слияние','пошаговый strand','адаптивное извлечение','плотный merge','обратный scan','бережная запись','обычный проход']},
    {name:'Турнирная сортировка', runner:'tournament', category:'Сравнение', modes:['дерево победителей','min tournament','пошаговые раунды','полное дерево','сжатое дерево','левый tie-break','повторный чемпион','адаптивный уровень','минимум на выходе','обычный проход']},
    {name:'TimSort · упрощённая', runner:'timsort', category:'Сравнение', modes:['run 16','run 24','run 32','run 40','реверс убывающих runs','insertion + merge','устойчивый merge','пошаговый run','короткие серии','обычный проход']}
  ];
  const categories = ['Все','Сравнение','Распределение','Мои'];
  const algorithms = definitions.flatMap((definition, familyIndex) => definition.modes.map((mode, variantIndex) => ({
    id: familyIndex * 10 + variantIndex,
    runner: definition.runner,
    familyIndex,
    variantIndex,
    category: definition.category,
    title: definition.name,
    variant: mode,
    label: `${definition.name} · ${mode}`,
    search: `${definition.name} ${mode} ${definition.category}`.toLowerCase()
  })));
  let customSorts = JSON.parse(localStorage.getItem('arraylab-sorts') || '[]').map((item, i) => ({...item, id:`custom-${i}`, category:'Мои', custom:true, search:`${item.title} ${item.label}`.toLowerCase()}));
  let savedArrays = JSON.parse(localStorage.getItem('arraylab-arrays') || '[]');
  let animationFrames = [];
  let creationType = null;
  let frameTouched = false;
  let drawMode = false;
  let drawingPointer = false;
  const selectedQuick = algorithms.findIndex(a => a.runner === 'quickMedian');

  let data = [];
  let active = [];
  let selected = algorithms[selectedQuick];
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
    $('#size-readout').textContent = data.length;
    $('#operation-readout').textContent = operations.toLocaleString('ru-RU');
    $('#current-algorithm').textContent = selected.label;
    $('#play-button').classList.toggle('is-running', sorting && !paused);
    $('#play-label').textContent = sorting ? (paused ? 'Продолжить' : 'Пауза') : 'Запустить';
    $('#run-status').classList.toggle('running', sorting && !paused);
    $('#run-status').classList.toggle('done', sorted);
    $('#status-label').textContent = sorting ? (paused ? 'ПАУЗА' : 'ВЫПОЛНЯЕТСЯ') : sorted ? 'АНИМАЦИЯ ЗАВЕРШЕНА' : drawMode ? (creationType === 'animation' ? 'ЗАПИСЬ КАДРОВ' : 'РИСОВАНИЕ МАССИВА') : 'ГОТОВО К ЗАПУСКУ';
    $('#draw-hint').hidden = !drawMode;
    $('#draw-hint-text').textContent = creationType === 'animation' ? `Кадр ${animationFrames.length + 1}: нарисуй состояние массива` : 'Проведи по полю, чтобы нарисовать массив';
    $('#next-frame-button').hidden = creationType !== 'animation';
    $('#finish-drawing-button').textContent = creationType === 'animation' ? 'Завершить' : 'Готово';
    $('#draw-array-button').classList.toggle('active', drawMode && creationType === 'array');
    $('#draw-array-button').innerHTML = drawMode && creationType === 'array' ? '✎ <span>Рисование включено</span>' : '✎ <span>Нарисовать массив</span>';
    $('#create-animation-button').classList.toggle('active', drawMode && creationType === 'animation');
    $('#create-animation-button').innerHTML = drawMode && creationType === 'animation' ? '● <span>Запись анимации</span>' : '＋ <span>Своя анимация</span>';
    $('#canvas-wrap').classList.toggle('drawing', drawMode);
    const count = algorithms.length + customSorts.length;
    $('#algorithm-count').textContent = count;
    document.querySelector('.count-pill').textContent = count;
    $('.sidebar-foot').querySelector('strong').textContent = count;
    render();
  }
  function resetArray(shuffle = true) {
    stopSort(); drawMode = false; creationType=null; animationFrames=[]; frameTouched=false;
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
    const n = a.length; let end = n - 1, start = 0, swapped = true;
    while (swapped && start < end) {
      swapped = false; let last = 0;
      if (v % 4 === 3) {
        for (let i = end; i > start; i--) if ((yield* compare(a, i - 1, i)) > 0) { yield* swap(a, i - 1, i); swapped = true; last = i - 1; }
        start++;
      } else {
        for (let i = 0; i < end; i++) if ((yield* compare(a, i, i + 1)) > 0) { yield* swap(a, i, i + 1); swapped = true; last = i; }
        if (v % 3 === 2 && swapped) end = Math.max(0, last);
        else end--;
      }
    }
  }
  function* insertion(a, v) {
    if(v%2){for(let i=a.length-2;i>=0;i--){const key=a[i];let j=i+1;while(j<a.length){yield event([j-1,j]);if(a[j]>=key)break;a[j-1]=a[j];yield event([j-1,j]);j++;}if(j-1!==i)yield*write(a,j-1,key,[i,j-1]);}}
    else for (let i = 1; i < a.length; i++) {
      const key = a[i]; let j = i - 1;
      while (j >= 0) { yield event([j, i]); if (a[j] <= key) break; a[j + 1] = a[j]; yield event([j, j + 1]); j--; }
      if (j + 1 !== i) yield* write(a, j + 1, key, [j + 1, i]);
    }
  }
  function* selection(a, v) {
    if (v % 2 === 1) {
      for(let end=a.length-1;end>0;end--){let max=end;for(let j=0;j<end;j++)if((yield*compare(a,j,max))>0)max=j;if(max!==end)yield*swap(a,max,end);}
    } else {
      for (let i = 0; i < a.length - 1; i++) { let min = i; for (let j = i + 1; j < a.length; j++) if ((yield* compare(a, min, j)) > 0) min = j; if (min !== i) yield* swap(a, i, min); if (v % 4 === 2) yield event([i]); }
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
  function* shell(a, v, sequence = 'ciura') {
    let gaps;
    if (sequence === 'tokuda') { gaps=[]; for(let k=0;;k++){const g=Math.ceil((9*Math.pow(9/4,k)-4)/5);if(g>=a.length)break;gaps.push(g);} gaps.reverse(); }
    else if (sequence === 'hibbard') { gaps=[]; for(let k=1;2**k-1<a.length;k++)gaps.push(2**k-1); gaps.reverse(); }
    else gaps=[1750,701,301,132,57,23,10,4,1].filter(g=>g<a.length);
    if (v % 3 === 1 && a.length > 4) gaps.unshift(Math.floor(a.length/3));
    if (v % 3 === 2 && a.length > 8) gaps.unshift(Math.floor(a.length/5));
    const used=[...new Set(gaps.filter(g=>g>0&&g<a.length))]; if(!used.includes(1))used.push(1);
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
  function* quick(a, v, mode = 0) {
    let seed=(mode+1)*2654435761>>>0;
    const nextRandom=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    function* part(lo, hi) {
      if (lo >= hi) return;
      let pivotIndex = lo + Math.floor((hi - lo) / 2);
      if (v === 1) pivotIndex = lo;
      if (v === 2) pivotIndex = hi;
      if (v === 3) pivotIndex = lo + Math.floor(nextRandom() * (hi - lo + 1));
      if (v === 4) {
        const candidates = [lo, lo + Math.floor((hi-lo)/2), hi].sort((x,y)=>a[x]-a[y]);
        pivotIndex = candidates[1];
      }
      const pivot = a[pivotIndex]; let i = lo, j = hi;
      while (i <= j) {
        while (i <= hi) { yield event([i, pivotIndex]); if (a[i] >= pivot) break; i++; }
        while (j >= lo) { yield event([j, pivotIndex]); if (a[j] <= pivot) break; j--; }
        if (i <= j) { if (i !== j) yield* swap(a, i, j); i++; j--; }
      }
      if (mode % 2) { if (i < hi) yield* part(i, hi); if (lo < j) yield* part(lo, j); }
      else { if (lo < j) yield* part(lo, j); if (i < hi) yield* part(i, hi); }
    }
    yield* part(0, a.length - 1);
  }
  function* heap(a,v=0) {
    const n = a.length;
    function* sift(root, end) { while (root * 2 + 1 <= end) { let child = root * 2 + 1; if (child + 1 <= end && (yield* compare(a, child, child + 1)) < 0) child++; if ((yield* compare(a, root, child)) >= 0) return; yield* swap(a, root, child); root = child; } }
    if(v%2){for(let i=1;i<n;i++){let child=i;while(child>0){const parent=(child-1)>>1;if((yield*compare(a,parent,child))>=0)break;yield*swap(a,parent,child);child=parent;}}}
    else for (let start = Math.floor((n - 2) / 2); start >= 0; start--) yield* sift(start, n - 1);
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
  function* mergeTopDown(a) {
    const aux = new Array(a.length);
    function* divide(lo, hi) {
      if (hi-lo < 2) return;
      const mid=(lo+hi)>>1; yield* divide(lo,mid); yield* divide(mid,hi);
      let i=lo,j=mid,k=lo;
      while(i<mid&&j<hi){yield event([i,j]);aux[k++]=a[i]<=a[j]?a[i++]:a[j++];}
      while(i<mid)aux[k++]=a[i++];while(j<hi)aux[k++]=a[j++];
      for(let p=lo;p<hi;p++)yield*write(a,p,aux[p],[p]);
    }
    yield* divide(0,a.length);
  }
  function* naturalMergeSort(a) {
    const aux=new Array(a.length); let runs=[];
    for(let start=0;start<a.length;){let end=start+1; if(end<a.length){const descending=a[end]<a[start];while(end<a.length&&(descending?a[end]<a[end-1]:a[end]>=a[end-1]))end++;if(descending)for(let l=start,r=end-1;l<r;l++,r--)yield*swap(a,l,r);}runs.push([start,end]);start=end;}
    while(runs.length>1){const next=[];for(let r=0;r<runs.length;r+=2){if(r+1===runs.length){next.push(runs[r]);continue;}const [lo,mid]=runs[r],[,hi]=runs[r+1];let i=lo,j=mid,k=lo;while(i<mid&&j<hi){yield event([i,j]);aux[k++]=a[i]<=a[j]?a[i++]:a[j++];}while(i<mid)aux[k++]=a[i++];while(j<hi)aux[k++]=a[j++];for(let p=lo;p<hi;p++)yield*write(a,p,aux[p],[p]);next.push([lo,hi]);}runs=next;}
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
  function* radix(a, v, requestedBase) {
    const base = requestedBase || (2 + (v % 15)); const max = Math.max(...a);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= base) {
      const out = new Array(a.length), count = new Array(base).fill(0);
      for (let i = 0; i < a.length; i++) { yield event([i]); count[Math.floor(a[i] / exp) % base]++; }
      for (let i = 1; i < base; i++) count[i] += count[i - 1];
      for (let i = a.length - 1; i >= 0; i--) { const digit = Math.floor(a[i] / exp) % base; out[--count[digit]] = a[i]; }
      for (let i = 0; i < a.length; i++) yield* write(a, i, out[i], [i]);
    }
  }
  function* binaryInsertion(a,v=0) {
    for (let i = 1; i < a.length; i++) {
      const value = a[i]; let lo = 0, hi = i;
      while (lo < hi) { const mid = (lo + hi) >> 1; yield event([mid, i]); if (v%2 ? a[mid] < value : a[mid] <= value) lo = mid + 1; else hi = mid; }
      for (let j = i; j > lo; j--) { a[j] = a[j - 1]; yield event([j - 1, j]); }
      if (lo !== i) yield* write(a, lo, value, [lo, i]);
    }
  }
  function* doubleSelection(a,v=0) {
    let lo = 0, hi = a.length - 1;
    while (lo < hi) {
      let min = lo, max = lo;
      if(v%2){for(let i=hi;i>=lo;i--){yield event([i,min,max]);if(a[i]<a[min])min=i;if(a[i]>a[max])max=i;}}
      else for (let i = lo + 1; i <= hi; i++) { yield event([i, min, max]); if (a[i] < a[min]) min = i; if (a[i] > a[max]) max = i; }
      yield* swap(a, lo, min); if (max === lo) max = min; yield* swap(a, hi, max); lo++; hi--;
    }
  }
  function* quickThreeWay(a, variant) {
    function* part(lo, hi) {
      if (lo >= hi) return;
      const p = a[lo + ((hi - lo) >> 1)]; let lt = lo, i = lo, gt = hi;
      while (i <= gt) { yield event([i, lt, gt]); if (a[i] < p) { yield* swap(a, lt++, i++); } else if (a[i] > p) { yield* swap(a, i, gt--); } else i++; }
      if(variant%2){yield*part(gt+1,hi);yield*part(lo,lt-1);}else{yield*part(lo,lt-1);yield*part(gt+1,hi);}
    }
    yield* part(0, a.length - 1);
  }
  function* bucketSort(a, variant) {
    const min = Math.min(...a), max = Math.max(...a), count = Math.max(2, Math.min(a.length, variant % 2 ? Math.ceil(Math.sqrt(a.length)) : 12));
    const buckets = Array.from({length:count},()=>[]);
    for (let i = 0; i < a.length; i++) { yield event([i]); const b = Math.min(count - 1, Math.floor(((a[i] - min) / ((max - min) || 1)) * count)); buckets[b].push(a[i]); }
    for (const bucket of buckets) bucket.sort((x,y)=>x-y);
    let k = 0; for (const bucket of buckets) for (const value of bucket) yield* write(a, k++, value, [k - 1]);
  }
  function* pancake(a) {
    for (let end = a.length - 1; end > 0; end--) {
      let max = 0; for (let i = 1; i <= end; i++) { yield event([i, max]); if (a[i] > a[max]) max = i; }
      if (max === end) continue;
      const flip = function* (last) { for (let l = 0, r = last; l < r; l++, r--) yield* swap(a, l, r); };
      if (max > 0) yield* flip(max); yield* flip(end);
    }
  }
  function* treeSort(a) {
    let root = null;
    for (let i = 0; i < a.length; i++) {
      const node = {value:a[i], index:i, left:null, right:null};
      if (!root) root = node;
      else { let cur = root; while (true) { yield event([i, cur.index]); const side = a[i] < cur.value ? 'left' : 'right'; if (!cur[side]) { cur[side] = node; break; } cur = cur[side]; } }
    }
    const ordered = [];
    function walk(node) { if (!node) return; walk(node.left); ordered.push(node.value); walk(node.right); }
    walk(root); for (let i = 0; i < ordered.length; i++) yield* write(a, i, ordered[i], [i]);
  }
  function* pigeonholeSort(a) {
    if (!a.length) return;
    const min=Math.min(...a), max=Math.max(...a), holes=Array.from({length:max-min+1},()=>[]);
    for(let i=0;i<a.length;i++){yield event([i]);holes[a[i]-min].push(a[i]);}
    let out=0;for(const hole of holes)for(const value of hole)yield*write(a,out++,value,[out-1]);
  }
  function* patienceSort(a) {
    const piles = [];
    for (let i = 0; i < a.length; i++) {
      const value = a[i]; let lo = 0, hi = piles.length;
      while (lo < hi) { const mid = (lo + hi) >> 1; yield event([i]); if (piles[mid][piles[mid].length - 1] >= value) hi = mid; else lo = mid + 1; }
      if (!piles[lo]) piles[lo] = []; piles[lo].push(value);
    }
    for (let out = 0; out < a.length; out++) { let best = -1; for (let p = 0; p < piles.length; p++) if (piles[p].length && (best < 0 || piles[p][piles[p].length - 1] < piles[best][piles[best].length - 1])) best = p;
      const value = piles[best].pop(); yield event([out, best]); yield* write(a, out, value, [out]); }
  }
  function* strandSort(a) {
    let remaining = a.slice(), result = [];
    while (remaining.length) {
      const strand = [remaining.shift()];
      for (let i = 0; i < remaining.length;) { yield event([i]); if (remaining[i] >= strand[strand.length - 1]) strand.push(remaining.splice(i,1)[0]); else i++; }
      const merged = []; let i=0,j=0;
      while (i<result.length && j<strand.length) { yield event([i,j]); merged.push(result[i] <= strand[j] ? result[i++] : strand[j++]); }
      result = merged.concat(result.slice(i), strand.slice(j));
    }
    for (let i = 0; i < result.length; i++) yield* write(a, i, result[i], [i]);
  }
  function* tournamentSort(a) {
    const values=a.slice();let size=1;while(size<a.length)size*=2;
    const tree=new Array(size*2).fill(-1);for(let i=0;i<a.length;i++)tree[size+i]=i;
    function* winner(left,right){if(left<0)return right;if(right<0)return left;yield event([left,right]);return values[left]<=values[right]?left:right;}
    for(let i=size-1;i>0;i--)tree[i]=yield*winner(tree[i*2],tree[i*2+1]);
    for(let out=0;out<a.length;out++){const win=tree[1];yield*write(a,out,values[win],[out,win]);let node=size+win;tree[node]=-1;node>>=1;while(node){tree[node]=yield*winner(tree[node*2],tree[node*2+1]);node>>=1;}}
  }
  function* timSort(a, variant) {
    const run = [16,24,32,40][variant % 4];
    for (let start=0;start<a.length;start+=run) { const end=Math.min(a.length,start+run); for(let i=start+1;i<end;i++){const x=a[i];let j=i-1;while(j>=start){yield event([j,i]);if(a[j]<=x)break;a[j+1]=a[j];yield event([j,j+1]);j--;}if(j+1!==i)yield*write(a,j+1,x,[j+1,i]);} }
    yield* mergeSort(a);
  }
  const runnerMap = {
    bubble:(a,v)=>bubble(a,v), cocktail:(a,v)=>cocktail(a,v), comb:(a,v)=>comb(a,v), insertion:(a,v)=>insertion(a,v), binaryInsertion:(a,v)=>binaryInsertion(a,v),
    selection:(a,v)=>selection(a,v), doubleSelection:(a,v)=>doubleSelection(a,v), gnome:(a)=>gnome(a), oddEven:(a,v)=>oddEven(a,v),
    shellCiura:(a,v)=>shell(a,v,'ciura'), shellTokuda:(a,v)=>shell(a,v,'tokuda'), shellHibbard:(a,v)=>shell(a,v,'hibbard'),
    quickMiddle:(a,v)=>quick(a,0,v), quickMedian:(a,v)=>quick(a,4,v), quickRandom:(a,v)=>quick(a,3,v), quickFirst:(a,v)=>quick(a,1,v), quickLast:(a,v)=>quick(a,2,v), quick3:(a,v)=>quickThreeWay(a,v), intro:(a,v)=>quick(a,4,v),
    heap:(a,v)=>heap(a,v), mergeBottom:(a)=>mergeSort(a), mergeTop:(a)=>mergeTopDown(a), naturalMerge:(a)=>naturalMergeSort(a), cycle:(a)=>cycle(a), counting:(a)=>counting(a), pigeonhole:(a)=>pigeonholeSort(a),
    radix2:(a,v)=>radix(a,v,2), radix10:(a,v)=>radix(a,v,10), radix16:(a,v)=>radix(a,v,16), bucket:(a,v)=>bucketSort(a,v), pancake:(a)=>pancake(a), tree:(a)=>treeSort(a), patience:(a)=>patienceSort(a), strand:(a)=>strandSort(a), tournament:(a)=>tournamentSort(a), timsort:(a,v)=>timSort(a,v)
  };
  function* customAnimation(a, animation) {
    if (animation.frames?.length) {
      for (const frame of animation.frames) for (let i=0;i<Math.min(a.length,frame.length);i++) if(a[i]!==frame[i]) yield*write(a,i,frame[i],[i]);
      return;
    }
    for (const step of animation.steps || []) { const i = Math.max(0, Math.min(a.length - 1, step.a)); const j = Math.max(0, Math.min(a.length - 1, step.b));
      if (step.action === 'swap') yield* swap(a, i, j); else yield event([i,j]);
    }
  }
  function makeSorter() {
    if (selected.custom) return customAnimation(data, selected);
    return runnerMap[selected.runner](data, selected.variantIndex, selected);
  }
  function finishSort() {
    sorting = false; paused = false; sorted = selected.custom || data.every((v, i) => i === 0 || data[i - 1] <= v); active = [];
    if (!sorted) toast('Алгоритм завершился, но массив ещё не упорядочен.');
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
    if (drawMode) { drawMode = false; creationType=null; animationFrames=[]; frameTouched=false; }
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
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
  function renderList() {
    const query = $('#search-input').value.trim().toLowerCase();
    const catalog = [...algorithms, ...customSorts];
    const items = catalog.filter(a => (chosenCategory === 'Все' || a.category === chosenCategory) && (!query || a.search.includes(query)));
    $('#algorithm-list').innerHTML = items.length ? items.map((a, index) => `<button class="algorithm-item ${a.id === selected.id ? 'selected' : ''}" type="button" role="option" aria-selected="${a.id === selected.id}" data-id="${escapeHtml(a.id)}"><span class="algo-index">${String(a.custom ? `М${index + 1}` : a.id + 1).padStart(3, '0')}</span><span class="algo-copy"><span class="algo-name">${escapeHtml(a.title)}</span><span class="algo-variant">${escapeHtml(a.variant)}</span></span><i class="algo-category" title="${escapeHtml(a.category)}"></i></button>`).join('') : '<div class="no-results">Ничего не найдено.<br>Попробуй другой запрос.</div>';
  }
  function renderSavedArrays() {
    const select = $('#saved-arrays-select');
    select.replaceChildren(new Option('Выбери сохранённый массив', ''));
    savedArrays.forEach((item, i) => select.add(new Option(item.name, String(i))));
  }
  function startCreation(type) {
    stopSort(); creationType=type; drawMode=true; animationFrames=[]; frameTouched=false; data=new Array(Number(sizeInput.value)).fill(1);
    operations=0; active=[]; sorted=false; updateUI();
  }
  function paintArray(event) {
    if (!drawMode || !data.length) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width - 1, event.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
    const index = Math.min(data.length - 1, Math.floor(x / rect.width * data.length));
    data[index] = Math.max(1, Math.round((1 - y / rect.height) * 1000));
    frameTouched=true; active = [index]; sorted = false; render();
  }
  function showDialog(dialog) { if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open',''); }
  function nextAnimationFrame() {
    if(creationType!=='animation') return;
    if(!frameTouched){toast('Нарисуй этот кадр, прежде чем переходить дальше.');return;}
    animationFrames.push([...data]); data=[...data]; frameTouched=false; active=[]; updateUI();
    toast(`Кадр ${animationFrames.length} записан. Рисуй следующий.`);
  }
  function finishCreation() {
    if(creationType==='array'){ if(!frameTouched){toast('Сначала нарисуй значения на графике.');return;} $('#array-save-name').value=`Массив ${savedArrays.length+1}`; showDialog($('#array-choice-dialog')); return; }
    if(creationType==='animation'){
      if(animationFrames.length<1){toast('Сначала зафиксируй кадр 1 кнопкой «Зафиксировать кадр».');return;}
      if(!frameTouched){toast('Нарисуй второй кадр, затем заверши анимацию.');return;}
      animationFrames.push([...data]);
      $('#animation-frame-total').textContent=`${animationFrames.length} кадра`;
      $('#animation-save-name').value=`Моя анимация ${customSorts.length+1}`;
      data=[...animationFrames[0]]; active=[]; drawMode=false; creationType=null; updateUI(); showDialog($('#animation-choice-dialog'));
    }
  }
  function endCreation({cancel=false}={}) { drawMode=false; creationType=null; animationFrames=[]; frameTouched=false; active=[]; if(cancel) resetArray(true); else updateUI(); }
  function persistArray() {
    const name=$('#array-save-name').value.trim()||`Массив ${savedArrays.length+1}`;
    savedArrays.push({name:name.slice(0,32),values:[...data]}); localStorage.setItem('arraylab-arrays',JSON.stringify(savedArrays)); renderSavedArrays();
    $('#array-choice-dialog').close(); endCreation(); toast('Массив сохранён.');
  }
  function prepareAnimationRecord() {
    const title=$('#animation-save-name').value.trim()||`Моя анимация ${customSorts.length+1}`;
    return {title:title.slice(0,36),variant:`Покадровая анимация · ${animationFrames.length} кадров`,label:`${title} · ${animationFrames.length} кадров`,frames:animationFrames.map(frame=>[...frame])};
  }
  function activateAnimation(record,save) {
    const item={...record,id:save?`custom-${customSorts.length}`:`temporary-${Date.now()}`,category:save?'Мои':'Временная',custom:true,search:`${record.title} ${record.label}`.toLowerCase()};
    if(save){customSorts.push(item);localStorage.setItem('arraylab-sorts',JSON.stringify(customSorts.map(({id,category,custom,search,...entry})=>entry)));chosenCategory='Мои';renderCategories();renderList();}
    selected=item; data=[...record.frames[0]]; sorted=false; operations=0; active=[];
    $('#animation-choice-dialog').close(); animationFrames=[]; updateUI();
    toast(save?'Анимация сохранена в каталоге «Мои».':'Анимация запущена без сохранения.');
    if(!save) toggleSort();
  }
  function resumeArrayDrawing(){ $('#array-choice-dialog').close(); drawMode=true; creationType='array'; frameTouched=false; updateUI(); }
  function resumeAnimationDrawing(){ $('#animation-choice-dialog').close(); data=[...animationFrames[animationFrames.length-1]]; animationFrames.pop(); drawMode=true; creationType='animation'; frameTouched=false; updateUI(); }
  function cancelAnimationDrawing(){ $('#animation-choice-dialog').close(); endCreation({cancel:true}); }
  function cancelArrayDrawing(){ $('#array-choice-dialog').close(); endCreation({cancel:true}); }
  $('#algorithm-list').addEventListener('click', (e) => {
    const item = e.target.closest('.algorithm-item'); if (!item) return;
    selected = [...algorithms, ...customSorts].find(a => String(a.id) === item.dataset.id); resetArray(true); renderList();
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
  $('#draw-array-button').addEventListener('click', () => startCreation('array'));
  $('#create-animation-button').addEventListener('click', () => startCreation('animation'));
  $('#next-frame-button').addEventListener('click', nextAnimationFrame);
  $('#finish-drawing-button').addEventListener('click', finishCreation);
  $('#cancel-drawing-button').addEventListener('click', () => endCreation({cancel:true}));
  canvas.addEventListener('pointerdown', (e) => { if (!drawMode) return; drawingPointer = true; canvas.setPointerCapture(e.pointerId); paintArray(e); });
  canvas.addEventListener('pointermove', (e) => { if (drawingPointer && drawMode) paintArray(e); });
  canvas.addEventListener('pointerup', () => { drawingPointer = false; active = []; render(); });
  canvas.addEventListener('pointercancel', () => { drawingPointer = false; active = []; render(); });
  $('#save-array-button').addEventListener('click', () => {
    const name = prompt('Название массива:', `Массив ${savedArrays.length + 1}`);
    if (!name || !name.trim()) return;
    savedArrays.push({name:name.trim().slice(0,32), values:[...data]});
    localStorage.setItem('arraylab-arrays', JSON.stringify(savedArrays)); renderSavedArrays();
    $('#saved-arrays-select').value = String(savedArrays.length - 1); toast('Массив сохранён в этом браузере.');
  });
  $('#saved-arrays-select').addEventListener('change', (e) => {
    const item = savedArrays[Number(e.target.value)]; if (!item) return;
    stopSort(); drawMode = false; data = [...item.values]; sizeInput.value = Math.max(20,Math.min(220,data.length));
    operations = 0; active = []; sorted = false; updateUI();
  });
  const arrayChoiceDialog=$('#array-choice-dialog'), animationChoiceDialog=$('#animation-choice-dialog');
  $('#save-created-array').addEventListener('click',persistArray);
  $('#use-array-once').addEventListener('click',()=>{arrayChoiceDialog.close();endCreation();toast('Массив готов к сортировке.');});
  $('#edit-created-array').addEventListener('click',resumeArrayDrawing);
  $('#save-created-animation').addEventListener('click',()=>activateAnimation(prepareAnimationRecord(),true));
  $('#use-animation-once').addEventListener('click',()=>activateAnimation(prepareAnimationRecord(),false));
  $('#edit-created-animation').addEventListener('click',resumeAnimationDrawing);
  arrayChoiceDialog.addEventListener('cancel',(e)=>{e.preventDefault();resumeArrayDrawing();});
  animationChoiceDialog.addEventListener('cancel',(e)=>{e.preventDefault();resumeAnimationDrawing();});
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
  renderSavedArrays(); renderCategories(); renderList(); updateUI(); fitCanvas();
})();
