


const drawModule = (function(funcCanvasId, defectCanvasId){
  const scaleStep = 0.5;
  const scaleAxe = 0.5;

  const MAX_LIMIT_X = 10;
  const MIN_LIMIT_X = 2;
  const MAX_LIMIT_Y = 10;
  const MIN_LIMIT_Y = 2;

  const DRAW_STEP = 0.1;

  const ctxFunc = document.getElementById(funcCanvasId);
  const ctxDef = document.getElementById(defectCanvasId);

  const funcChart = createChart(ctxFunc);
  const defectChart = createChart(ctxDef);
  onWheel(ctxFunc, funcChart);
  onWheel(ctxDef, defectChart);

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
            ticks : {
              min : -MAX_LIMIT_X,
              max : MAX_LIMIT_X,
            },
            stepSize : 1
          }],
          yAxes: [{
            type: 'linear',
            ticks : {
              min : -MAX_LIMIT_Y,
              max : MAX_LIMIT_Y,
            },
            stepSize : 1
          }]
        }
      }
    });
  }

  function onWheel(ctx, chart) {
    ctx.addEventListener("wheel", e => {
      e.preventDefault();

      let bigger = e.wheelDelta > 0;
      let axes = chart.options.scales;
    
        if (bigger) {
          if (-axes.xAxes[0].ticks.min > MIN_LIMIT_X &&
              axes.xAxes[0].ticks.max > MIN_LIMIT_X) {  

            axes.xAxes[0].ticks.min += scaleAxe;
            axes.xAxes[0].ticks.max -= scaleAxe;
          }
        }
        else {
          if (-axes.xAxes[0].ticks.min < MAX_LIMIT_X &&
              axes.xAxes[0].ticks.max < MAX_LIMIT_X) {              

            axes.xAxes[0].ticks.min -= scaleAxe;
            axes.xAxes[0].ticks.max += scaleAxe;
          }
        }
      
        if (bigger) {
          if (-axes.yAxes[0].ticks.min > MIN_LIMIT_Y &&
              axes.yAxes[0].ticks.max > MIN_LIMIT_Y) {
            
            axes.yAxes[0].ticks.min += scaleAxe;
            axes.yAxes[0].ticks.max -= scaleAxe;
          }
        }
        else {
          if (-axes.yAxes[0].ticks.min < MAX_LIMIT_Y &&
              axes.yAxes[0].ticks.max < MAX_LIMIT_Y) {  
           
            axes.yAxes[0].ticks.min -= scaleAxe;
            axes.yAxes[0].ticks.max += scaleAxe;
          }
        }
      chart.update();    
    });
  }

  function drawGraph(chart, func, label) {
    const minX = chart.options.scales.xAxes[0].ticks.min + DRAW_STEP;
    const maxX = chart.options.scales.xAxes[0].ticks.max - DRAW_STEP;
    const g = [];
    for (let x = minX; x <= maxX; x += DRAW_STEP) {
      g.push({ x : x, y : func(x) });
    }
    chart.data.datasets.push({
      data : g,
      fill : false,
      label : label,
      pointRadius : 0,
    });
    chart.update();
  }

  return {
    drawOnFuncChart : (func, label) => 
      drawGraph(funcChart, func, label),

    drawOnDefectChart : (func, label) => 
      drawGraph(defectChart, func, label),  
  }

})("functions", "defects");

drawModule.drawOnFuncChart(x => x * x);



const ctx = document.getElementById("functions");
let dataAp = (function() {
  const dt = [];
  for (let i = -3; i <= 3; ++i) {
    dt.push({
      x : i,
      y : getNumericalAproximation(
        x => 1 / (5 + 9 * x * x),
        //x => 1/(Math.abs(x) + 1), 
        i, 
        [-2, -1, 0, 1],
        1,
        3,
        0.01 
      )
    });
  }
  return dt;  
})();

let dataReal = (function() {
  const dt = [];
  for (let i = -3; i <= 3; ++i) {
    dt.push({
      x : i,
      y : 18 * i / Math.pow((5 + 9 * i * i), 2),
      //y : 1/Math.pow((Math.abs(i) + 1), 2)
    });
  }
  return dt;  
})();

let porMeth = (function() {
  const dt = [];
  for (let i = -3; i <= 3; ++i) {
    dt.push({
      x : i,
      y : 18 * ((5 + 9 * i ** 2) - 36 * i ** 2) / (5 + 9 * i ** 2)**3 * (0.01 / 2),
      //y : 1/Math.pow((Math.abs(i) + 1), 2)
    });
  }
  return dt;
})();

/*var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: 
        [
          { 
            data: dataAp,
            //label: "Africa",
            borderColor: "#3e95cd",
            fill: false
          },
          {
            data : dataReal,
            fill: false,
            borderColor : "red",
          },
          {
            data : porMeth,
            fill: false,
            borderColor : "green",
          },

        ],
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                //position: 'bottom',
                ticks : {
                  min : -5,
                  max : 5,
                }
                //stepSize : 2
            }],
            yAxes: [{
                type: 'linear',
                //position: 'bottom'
                ticks : {
                  min : -5,
                  max : 5,
                }
                //stepSize : 0.5
            }]
        }
    }
});*/

/*ctx.addEventListener("wheel", e => {
    
    let bigger = e.wheelDelta < 0;
    let axes = myLineChart.options.scales;
    for(let ax in axes) {
       if (bigger) {
         ++axes[ax][0].ticks.min;
         --axes[ax][0].ticks.max;
       }
       else {
         --axes[ax][0].ticks.min;
         ++axes[ax][0].ticks.max;
       }
    }
    myLineChart.update();    
});*/


/*let vec = gaussMethod([
  [2, 4, 1, 36],
  [5, 2, 1, 47],
  [2, 3, 4, 37],
]);

let m = getMatrixFromNet([-1, 0, 1], 2, 1);*/

let t = getNumericalAproximation(
    x => x * x, 
    5, 
    [-2, -1, 0, 1],
    1,
    3,
    0.1 
);


function gaussMethod(matrix) {
  const matrCopy = matrix.slice();    
  for (let i = 0; i < matrCopy.length; ++i) {
    matrCopy[i] = matrix[i].slice();
  }

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

function factorial(n) {
  let res = 1;
  for (let i = 1; i <= n; ++i) {
    res *= i;
  }
  return res;
}

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
      resMatr[i][j] = Math.pow(tableNet[j], i);
    }
    resMatr[i][N] = i === m ? factorial(m) : 0;
  }
  return resMatr;
}

function getCoefficients(tableNet, m, k) {
  const matr = getMatrixFromNet(tableNet, m, k);
  return gaussMethod(matr);  
}

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
  return result / Math.pow(h, m);
}




