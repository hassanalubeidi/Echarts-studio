
import { ChartConfig, FinancialData, Dataset } from '../types';

export const generateFinancialData = (config: ChartConfig): FinancialData => {
  const lastClose = config.simulation.initialPrice;
  
  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const sTime = new Date(`${todayStr} 09:30:00`).getTime();
  const eTime = new Date(`${todayStr} 15:00:00`).getTime();
  const breakStartTime = new Date(`${todayStr} 11:30:00`).getTime();
  const breakEndTime = new Date(`${todayStr} 13:00:00`).getTime();

  // MACD parameters
  const shortPeriod = 12;
  const longPeriod = 26;
  const signalPeriod = 9;

  let time = sTime;
  let price = lastClose;
  let direction = 1;
  let maxAbs = 0;
  let sumVolume = 0;

  // Header for Main Dataset
  const mainSource: (string | number)[][] = [
    ['Timestamp', 'Open', 'Close', 'Low', 'High', 'Volume', 'VolColor', 'MA5', 'MA10', 'MA20', 'MACD', 'Signal', 'Hist']
  ];

  const prices: number[] = [];
  const rows: any[] = [];

  // 1. Generate Price/Volume Stream
  while (time < eTime) {
    const volume = Math.round(Math.random() * 1000 + 500);
    sumVolume += volume;
    
    if (time === sTime) {
      direction = Math.random() < 0.5 ? 1 : -1;
      price = lastClose * (1 + (Math.random() - 0.5) * config.simulation.volatility);
    } else {
      direction = Math.random() < 0.8 ? direction : -direction;
      price = Math.round((price + direction * (Math.random() * 0.1)) * 100) / 100;
    }
    
    // Simulate OHLC for the minute
    const open = price;
    const close = Math.round((open + (Math.random() - 0.5) * 0.2) * 100) / 100;
    const high = Math.max(open, close) + Math.random() * 0.1;
    const low = Math.min(open, close) - Math.random() * 0.1;
    
    prices.push(close);
    
    const volColor = close >= open ? 1 : -1;

    // Moving Averages
    const ma5 = prices.length >= 5 ? prices.slice(-5).reduce((a, b) => a + b, 0) / 5 : null;
    const ma10 = prices.length >= 10 ? prices.slice(-10).reduce((a, b) => a + b, 0) / 10 : null;
    const ma20 = prices.length >= 20 ? prices.slice(-20).reduce((a, b) => a + b, 0) / 20 : null;

    rows.push({
      time, open, close, low, high, volume, volColor, ma5, ma10, ma20
    });

    maxAbs = Math.max(maxAbs, Math.abs(high - lastClose), Math.abs(low - lastClose));
    
    if (time === breakStartTime) {
      time = breakEndTime;
    } else {
      time += 60 * 1000;
    }
  }

  // 2. MACD Calculation
  const emaShort = calculateEMA(prices, shortPeriod);
  const emaLong = calculateEMA(prices, longPeriod);
  
  rows.forEach((row, i) => {
    if (i < longPeriod) {
       mainSource.push([
         row.time, row.open, row.close, row.low, row.high, row.volume, row.volColor, 
         row.ma5 || '', row.ma10 || '', row.ma20 || '', '', '', ''
       ]);
       return;
    }

    const dif = emaShort[i] - emaLong[i];
    // Simple signal calculation (EMA of DIF)
    // We need previous signal. 
    // This is a rough approximation for generation
    const prevSignal = i > longPeriod ? parseFloat(mainSource[mainSource.length - 1][11] as string) : dif;
    const k = 2 / (signalPeriod + 1);
    const signal = dif * k + prevSignal * (1 - k);
    const hist = dif - signal;

    mainSource.push([
      row.time, row.open, row.close, row.low, row.high, row.volume, row.volColor,
      row.ma5 || '', row.ma10 || '', row.ma20 || '', 
      dif, signal, hist
    ]);
  });

  // 3. Order Book Dataset
  const orderSource: (string | number)[][] = [['Price', 'Amount', 'Type']];
  const orderCount = 10;
  let orderPrice = price - (0.01 * orderCount) / 2;
  for (let i = 0; i < orderCount; ++i) {
    if (price === orderPrice) continue;
    orderPrice += 0.01;
    const amount = Math.round(Math.random() * 200) + 10;
    const type = orderPrice < price ? 'Bid' : 'Ask';
    orderSource.push([parseFloat(orderPrice.toFixed(2)), amount, type]);
  }

  // 4. Depth Dataset
  const depthSource: (string | number)[][] = [['Price', 'Volume', 'Type']];
  const depthCount = 20;
  let cumulativeHighVolume = 0;
  let cumulativeLowVolume = 0;
  
  // High side
  for (let i = 0; i < depthCount; ++i) {
     cumulativeHighVolume += Math.round(Math.random() * 1000);
     depthSource.push([i, cumulativeHighVolume, 'Ask']);
  }
  // Low side
  for (let i = 0; i < depthCount; ++i) {
     cumulativeLowVolume += Math.round(Math.random() * 1000);
     depthSource.push([i, cumulativeLowVolume, 'Bid']);
  }

  const datasets: Dataset[] = [
    { id: 'market_data', source: mainSource },
    { id: 'order_book', source: orderSource },
    { id: 'depth_data', source: depthSource }
  ];

  return {
    datasets,
    lastClose,
    maxAbs,
    breakStartTime,
    breakEndTime
  };
};

function calculateEMA(data: number[], period: number) {
  const k = 2 / (period + 1);
  const emaArray = [];
  let ema = data[0];
  emaArray.push(ema);
  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
    emaArray.push(ema);
  }
  return emaArray;
}

export const generateOption = (data: FinancialData, config: ChartConfig, width: number, height: number) => {
    const { datasets, lastClose, maxAbs, breakStartTime, breakEndTime } = data;
    const { colors, layout } = config;

    const priceFormatter = (value: number) => {
      return value.toFixed(2);
    };

    const getTitle = (text: string, subtext: string, coord: number[]) => {
        return {
            text: text,
            subtext: subtext,
            left: 2,
            top: 2,
            textStyle: { fontSize: 12, fontWeight: 'bold', color: colors.text },
            subtextStyle: { fontSize: 10, color: colors.subtext },
            coordinateSystem: 'matrix',
            coord: coord
        };
    };

    return {
        backgroundColor: 'transparent',
        animation: false,
        dataset: datasets,
        title: [
            getTitle('Volume', '', [0, 5]),
            getTitle('MACD', '', [0, 4]),
            getTitle('Order Book', '', [4, 0]),
            getTitle('Depth', '', [4, 5])
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
        // Using visualMap to color volume bars based on 'VolColor' dimension (Index 6)
        visualMap: [
            {
                show: false,
                seriesIndex: 2, // Volume series
                dimension: 6,
                pieces: [
                    { value: 1, color: colors.up },
                    { value: -1, color: colors.down }
                ]
            },
            {
                show: false,
                seriesIndex: 6, // Order book
                dimension: 2, // Type
                categories: ['Bid', 'Ask'],
                inRange: {
                    color: [colors.up, colors.down]
                }
            }
        ],
        xAxis: [
            { type: 'time', show: false, gridIndex: 0 }, // Price
            { type: 'time', gridIndex: 1, show: false }, // Volume
            { type: 'time', gridIndex: 2, show: false }, // MACD
            { type: 'value', gridIndex: 3, show: false }, // Order Book (Value axis for bars)
            { type: 'category', gridIndex: 4, show: false } // Depth
        ],
        yAxis: [
            { type: 'value', show: false, min: lastClose - maxAbs, max: lastClose + maxAbs, gridIndex: 0 },
            { type: 'value', gridIndex: 1, show: false },
            { type: 'value', gridIndex: 2, show: false },
            { type: 'category', gridIndex: 3, show: false }, // Order Book (Category axis for prices)
            { type: 'value', gridIndex: 4, show: false }
        ],
        grid: [
            { coordinateSystem: 'matrix', coord: [0, 0], top: 0, bottom: 0, left: 0, right: 0 }, // Price
            { coordinateSystem: 'matrix', coord: [0, 5], top: 20, bottom: 0, left: 0, right: 0 }, // Volume
            { coordinateSystem: 'matrix', coord: [0, 4], top: 20, bottom: 0, left: 0, right: 0 }, // MACD
            { coordinateSystem: 'matrix', coord: [4, 0], top: 15, bottom: 2, left: 2, right: 2 }, // Order Book
            { coordinateSystem: 'matrix', coord: [4, 4], top: 15, bottom: 0, left: 0, right: 0 }  // Depth
        ],
        series: [
            {
                name: 'Price',
                type: 'candlestick',
                datasetIndex: 0,
                xAxisIndex: 0,
                yAxisIndex: 0,
                encode: {
                    x: 'Timestamp',
                    y: ['Open', 'Close', 'Low', 'High'],
                    tooltip: ['Open', 'Close', 'Low', 'High']
                },
                itemStyle: {
                    color: colors.up,
                    color0: colors.down,
                    borderColor: colors.up,
                    borderColor0: colors.down
                }
            },
            {
                name: 'MA5',
                type: 'line',
                datasetIndex: 0,
                xAxisIndex: 0,
                yAxisIndex: 0,
                encode: { x: 'Timestamp', y: 'MA5' },
                lineStyle: { opacity: 0.5, width: 1 },
                symbol: 'none'
            },
            {
                name: 'Volume',
                type: 'bar',
                datasetIndex: 0,
                xAxisIndex: 1,
                yAxisIndex: 1,
                encode: { x: 'Timestamp', y: 'Volume' }
            },
            {
                name: 'MACD',
                type: 'bar',
                datasetIndex: 0,
                xAxisIndex: 2,
                yAxisIndex: 2,
                encode: { x: 'Timestamp', y: 'Hist' },
                itemStyle: { color: colors.text }
            },
            {
                name: 'DIF',
                type: 'line',
                datasetIndex: 0,
                xAxisIndex: 2,
                yAxisIndex: 2,
                encode: { x: 'Timestamp', y: 'MACD' },
                lineStyle: { width: 1, color: '#fff' },
                symbol: 'none'
            },
            {
                name: 'DEA',
                type: 'line',
                datasetIndex: 0,
                xAxisIndex: 2,
                yAxisIndex: 2,
                encode: { x: 'Timestamp', y: 'Signal' },
                lineStyle: { width: 1, color: '#f00' },
                symbol: 'none'
            },
            {
                name: 'Order Book',
                type: 'bar',
                datasetIndex: 1,
                xAxisIndex: 3,
                yAxisIndex: 3,
                encode: { x: 'Amount', y: 'Price' }, // Horizontal bar
                label: { show: true, position: 'right' }
            },
            {
                name: 'Depth',
                type: 'line',
                datasetIndex: 2,
                xAxisIndex: 4,
                yAxisIndex: 4,
                encode: { x: 'Price', y: 'Volume' },
                step: 'start',
                areaStyle: { opacity: 0.2 },
                lineStyle: { width: 1 }
            }
        ],
        matrix: {
            left: layout.matrixMargin,
            right: layout.matrixMargin,
            top: layout.matrixMargin,
            bottom: layout.matrixMargin,
            x: { show: false, data: Array(5).fill(null) },
            y: { show: false, data: Array(6).fill(null) },
            body: {
                data: [
                    { coord: [[0, 3], [0, 3]], mergeCells: true },
                    { coord: [[0, 3], [5, 5]], mergeCells: true },
                    { coord: [[0, 3], [4, 4]], mergeCells: true },
                    { coord: [[4, 4], [0, 3]], mergeCells: true },
                    { coord: [[4, 4], [4, 5]], mergeCells: true }
                ]
            }
        },
        graphic: {
             elements: [
                ...Array.from({ length: 3 }, (_, i) => ({
                    type: 'line',
                    shape: {
                        x1: layout.matrixMargin,
                        y1: (height / 6) * (i + 1),
                        x2: (width / 5) * 4 + layout.matrixMargin,
                        y2: (height / 6) * (i + 1)
                    },
                    style: {
                        stroke: i === 1 ? colors.split : colors.grid,
                        lineWidth: 1,
                        lineDash: i === 1 ? [4, 4] : false
                    }
                }))
             ]
        }
    };
};
