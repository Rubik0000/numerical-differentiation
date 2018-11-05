
// Вариант 6
// m=1; k=3; [−2; −1; 0; 1]. 


const drawModule = (function(funcCanvasId, derivativeCanvasId, defectRealCanvasId, defectIntendedCanvasId) {
  const DRAW_STEP = 0.2;

  const ctxFunc = document.getElementById(funcCanvasId);
  const ctxDefReal = document.getElementById(defectRealCanvasId);
  const ctxDefInt = document.getElementById(defectIntendedCanvasId);
  const ctxDerivative = document.getElementById(derivativeCanvasId);

  const funcChart = createChart(ctxFunc);
  const derivativeChart = createChart(ctxDerivative);
  const defectRealChart = createChart(ctxDefReal);
  const defectIntChart = createChart(ctxDefInt);

  function createChart(ctx) {
    return new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [],
      },
      options: {
        scales: {
          xAxes: [{
            type: 'linear',
          }],
          yAxes: [{
            type: 'linear',
          }]
        }
      }
    });
  }

  function drawGraph(chart, func, left, right, label, color) {
    const minX = chart.options.scales.xAxes[0].ticks.min + DRAW_STEP;
    const maxX = chart.options.scales.xAxes[0].ticks.max - DRAW_STEP;
    const g = [];
    for (let x = left; x <= right; x += DRAW_STEP) {
      g.push({ x : x, y : func(x) });
    }
    chart.data.datasets.push({
      data : g,
      fill : false,
      label : label,
      //pointRadius : 1,
      borderColor: color,
    });
    chart.update();
  }

  function removeData(chart) {
    chart.data.labels = [];
    chart.data.datasets = [];
    chart.update();
  }


  return {
    drawOnFuncChart : (func, left, right) => 
      drawGraph(funcChart, func, left, right, "функция", "blue"),

    drawOnDerivativeChart : (func, left, right) =>
      drawGraph(derivativeChart, func, left, right, "приближенная производная", "green"), 
    
    drawOnDefectRealChart : (func, left, right) => 
      drawGraph(defectRealChart, func, left, right, "полученная погрешность", "red"),

    drawOnDefectIntChart : (func, left, right) =>
      drawGraph(defectIntChart, func, left, right, "оцененная погрешность", "pink"),

    removeFromFuncChart : () => removeData(funcChart),
    removeFromRealChart : () => removeData(defectRealChart),
    removeFromIntChart  : () => removeData(defectIntChart),
    removeFromDerivativeChart : () => removeData(derivativeChart),
  
    removeFromAll : () => {
      removeData(funcChart);
      removeData(defectRealChart);
      removeData(defectIntChart);
      removeData(derivativeChart);
    },
  }

})("function", "derivative", "defectsReal", "defectsIntented");



const inputModule = (function(hInputId, leftInputId, rightInputId) {
  const MIN_H = 0;

  const BAD_COLOR = "#EC7063";
  const GOOD_COLOR = "#FFFFFF";

  const hInput = document.getElementById(hInputId);
  const leftInput = document.getElementById(leftInputId);
  const rightInput = document.getElementById(rightInputId);
  
  let currH = 0.1;
  let currLeft = -5;
  let currRight = 5;

  function onHchange(callback) {
    hInput.addEventListener("keyup", key => {
      const H = Number(hInput.value);
      if (isNaN(H) || H <= MIN_H) {
        hInput.style.backgroundColor = BAD_COLOR;
        return;
      }
      hInput.style.backgroundColor = GOOD_COLOR;
      if (currH === H) return;

      currH = H;
      callback(currH, currLeft, currRight); 
    });
  }

  function onLeftChange(callback) {
    leftInput.addEventListener("keyup", key => {
      const left = Number(leftInput.value);
      if (isNaN(left) || left >= currRight) {
        leftInput.style.backgroundColor = BAD_COLOR;
        return;
      }
      leftInput.style.backgroundColor = GOOD_COLOR;
      if (left === currLeft) return;

      currLeft = left;
      callback(currH, currLeft, currRight);
    });
  }

  function onRightChange(callback) {
    rightInput.addEventListener("keyup", key => {
      const right = Number(rightInput.value);
      if (isNaN(right) || right <= currLeft) {
        rightInput.style.backgroundColor = BAD_COLOR;
        return;
      }
      rightInput.style.backgroundColor = GOOD_COLOR;
      if (right === currRight) return;

      currRight = right;
      callback(currH, currLeft, currRight);
    });
  }  

  return {
    onHchange : onHchange,
    onLeftChange : onLeftChange,
    onRightChange : onRightChange,
  }

})("step", "left", "right");


function main() {
  const func = x => Math.sin(x);
  const der1 = x => Math.cos(x);
  const der2 = x => -Math.sin(x);
  const defectMethod = (x, h) =>
    h / 2 * Math.abs(der2(x));

  const eps = 10e-52;
  const defectCalc = (x, h) =>  
    eps * func(x) / h;

  const m = 1;
  const k = 3;

  const net = [-2, -1, 0, 1];

  const aprDer = (x, h) => 
    getNumericalAproximation(func, x, net, m, k, h);

  inputModule.onHchange((h, l, r) => {
    drawModule.removeFromRealChart();
    drawModule.removeFromDerivativeChart();
    drawModule.removeFromIntChart();

    drawModule.drawOnDefectRealChart(x => Math.abs(aprDer(x, h) - der1(x)), l, r);
    drawModule.drawOnDerivativeChart(x => aprDer(x, h), l, r);
    drawModule.drawOnDefectIntChart(x => defectMethod(x, h) + defectCalc(x, h), l, r);
  });

  const redrawAll = (h, l, r) => {
    drawModule.removeFromAll();

    drawModule.drawOnFuncChart(func, l, r);
    drawModule.drawOnDerivativeChart(x => aprDer(x, h), l, r);
    drawModule.drawOnDefectRealChart(x => Math.abs(aprDer(x, h) - der1(x)), l, r);
    drawModule.drawOnDefectIntChart(x => defectMethod(x, h) + defectCalc(x, h), l, r);
  };

  inputModule.onLeftChange(redrawAll);
  inputModule.onRightChange(redrawAll);

  drawModule.drawOnFuncChart(func, -5, 5);
  drawModule.drawOnDerivativeChart(x => aprDer(x, 0.1), -5, 5);
  drawModule.drawOnDefectRealChart(x => Math.abs(aprDer(x, 0.1) - der1(x)), -5, 5);  
  drawModule.drawOnDefectIntChart(x => defectMethod(x, 0.1) + defectCalc(x, 0.1), -5, 5);
}



/**
 * Решает систему лин. уравнений методом гаусса 
 * @param {number[][]} matrix матрица из линейных уравнений
 * @returns {number[]} вектор-решение
 */
function gaussMethod(matrix) {
  if (matrix.length + 1 != matrix[0].length) {
    throw new Error("Невозможно найти единственное решение");
  }
  const matrCopy = matrix.slice();    
  for (let i = 0; i < matrCopy.length; ++i) {
    matrCopy[i] = matrix[i].slice();
  }

  // прямой ход
  const N = matrCopy[0].length - 1;
  for (let i = 0; i < N; ++i) {
    let tmp = matrCopy[i][i];
    for (let j = N; j >= i; --j) {
      matrCopy[i][j] /= tmp;  
    }
    for (let j = i + 1; j < N; ++j) {
      let tmp = matrCopy[j][i];
      for (let k = N; k >= i; --k) {
        matrCopy[j][k] -= tmp * matrCopy[i][k];
      }
    }
  }

  // обрытный ход
  const result = [];
  result[N - 1] = matrCopy[N - 1][N];
  for (let i = N - 2; i >= 0; --i) {
    result[i] = matrCopy[i][N];
    for (let j = i + 1; j < N; ++j) {
        result[i] -= matrCopy[i][j] * result[j];
    }
  }
  return result;
}


/**
 * Вычисляет факториал числа
 */
function factorial(n) {
  if (n < 0) {
    throw new Error("Попытка вычислить факториал от отрицательного числа");
  }
  let res = 1;
  for (let i = 1; i <= n; ++i) {
    res *= i;
  }
  return res;
}

/**
 * Составляет матрицу Вандермонда из шаблона сеточного приближения
 *
 * @param {number[]} tableNet сеточное приближение
 * @param {number} m порядок производной
 * @param {number} k порядок точности
 * @returns {number[][]} матрица
 */
function getMatrixFromNet(tableNet, m, k) {
  const s = Math.abs(tableNet[0]);
  const L = Math.abs(tableNet[tableNet.length - 1]);
  const resMatr = [];
  for (let i = 0; i < m + k; ++i) {
    resMatr[i] = [];
  }

  const N = tableNet.length;
  for (let i = 0; i < m + k; ++i) {
    for (let j = 0; j < N; ++j) {
      resMatr[i][j] = tableNet[j] ** i;
    }
    resMatr[i][N] = i === m ? factorial(m) : 0;
  }
  return resMatr;
}

/**
 * Находит коэффициенты a
 *
 * @param {number[]} tableNet сеточное приближение
 * @param {number} m порядок производной
 * @param {number} k порядок точности
 */
function getCoefficients(tableNet, m, k) {
  const matr = getMatrixFromNet(tableNet, m, k);
  return gaussMethod(matr);  
}

/**
 * Считает приближенное значение производной в заданной точке
 *
 * @param {function} func      функция, производную которой нужно вычислить
 * @param {number}   x         точка, в которой нужно найти значение производной
 * @param {number[]} tableNet  сеточное приближение
 * @param {number}   m порядок производной
 * @param {number}   k порядок точности
 * @param {number}   h шаг сетки
 * @returns {number} значение производной
 */
function getNumericalAproximation(func, x, tableNet, m, k, h) {
  const nodes = [];
  for (let i = 0; i < tableNet.length; ++i) {
    nodes[i] = x + h * tableNet[i];
  }

  const coefs = getCoefficients(tableNet, m, k);

  let result = 0;
  for (let i = 0; i < nodes.length; ++i) {
    result += coefs[i] * func(nodes[i]);
  }
  return result / (h ** m);
}



main();
