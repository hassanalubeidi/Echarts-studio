

export const getElementDefault = (type: string) => {
  // Generate distinct colors for new series to stand out
  const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);

  switch(type) {
    case 'series.line': 
      return { 
        type: 'line', 
        name: 'New Line',
        data: Array.from({length: 10}, () => Math.floor(Math.random() * 100)),
        smooth: true,
        lineStyle: { width: 3 }
      };
    case 'series.bar': 
      return { 
        type: 'bar', 
        name: 'New Bar',
        data: Array.from({length: 10}, () => Math.floor(Math.random() * 100))
      };
    case 'series.pie': 
      return { 
        type: 'pie', 
        name: 'New Pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ]
      };
    case 'series.scatter':
      return {
        type: 'scatter',
        name: 'New Scatter',
        symbolSize: 20,
        data: Array.from({length: 20}, () => [
          Math.random() * 100,
          Math.random() * 100
        ])
      };
    case 'series.effectScatter':
      return {
        type: 'effectScatter',
        name: 'Effect Scatter',
        symbolSize: 20,
        data: [[10, 10], [50, 50]]
      };
    case 'series.candlestick':
        return {
            type: 'candlestick',
            name: 'New Candlestick',
            data: [
                [20, 34, 10, 38],
                [40, 35, 30, 50],
                [31, 38, 33, 44],
                [38, 15, 5, 42]
            ]
        };
    case 'series.heatmap':
        return {
            type: 'heatmap',
            name: 'New Heatmap',
            data: [
                [0, 0, 5], [0, 1, 1], [0, 2, 0],
                [1, 0, 3], [1, 1, 2], [1, 2, 6],
                [2, 0, 8], [2, 1, 5], [2, 2, 2]
            ],
            label: { show: true }
        };
    case 'series.funnel':
        return {
            type: 'funnel',
            name: 'New Funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: { show: true, position: 'inside' },
            data: [
                { value: 60, name: 'Visit' },
                { value: 40, name: 'Inquiry' },
                { value: 20, name: 'Order' },
                { value: 80, name: 'Click' },
                { value: 100, name: 'Show' }
            ]
        };
    case 'series.gauge':
        return {
            type: 'gauge',
            name: 'New Gauge',
            progress: { show: true },
            detail: { valueAnimation: true, formatter: '{value}' },
            data: [{ value: 50, name: 'Score' }]
        };
    case 'series.matrix':
        return {
            type: 'matrix',
            name: 'New Matrix Series',
            data: [] 
        };
    case 'series.graph':
      return {
          type: 'graph',
          name: 'New Graph',
          layout: 'force',
          symbolSize: 50,
          roam: true,
          label: { show: true },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          data: [{name: 'Node 1', x: 100, y: 100}, {name: 'Node 2', x: 200, y: 200}, {name: 'Node 3', x: 150, y: 300}],
          links: [{source: 'Node 1', target: 'Node 2'}, {source: 'Node 2', target: 'Node 3'}]
      };
    case 'series.tree':
        return {
            type: 'tree',
            name: 'New Tree',
            data: [{
                name: 'Root',
                children: [
                    { name: 'Child A', children: [{name: 'A1'}, {name: 'A2'}] },
                    { name: 'Child B', children: [{name: 'B1'}, {name: 'B2'}] }
                ]
            }],
            top: '5%',
            left: '7%',
            bottom: '5%',
            right: '20%',
            symbolSize: 7,
            label: { position: 'left', verticalAlign: 'middle', align: 'right' },
            leaves: { label: { position: 'right', verticalAlign: 'middle', align: 'left' } },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
        };
    case 'series.treemap':
        return {
            type: 'treemap',
            name: 'New Treemap',
            data: [
                {
                    name: 'nodeA',
                    value: 10,
                    children: [{name: 'nodeAa', value: 4}, {name: 'nodeAb', value: 6}]
                },
                {
                    name: 'nodeB',
                    value: 20,
                    children: [{name: 'nodeBa', value: 20}]
                }
            ]
        };
    case 'series.sunburst':
        return {
            type: 'sunburst',
            name: 'New Sunburst',
            data: [
                {
                    name: 'Grandpa',
                    children: [
                        { name: 'Uncle Leo', value: 15, children: [{ name: 'Cousin Jack', value: 2 }] },
                        { name: 'Aunt Jane', value: 10 },
                        { name: 'Father', value: 25, children: [{ name: 'Me', value: 5 }, { name: 'Brother Peter', value: 1 }] }
                    ]
                }
            ],
            radius: [0, '90%'],
            label: { rotate: 'radial' }
        };
    case 'series.sankey':
        return {
            type: 'sankey',
            name: 'New Sankey',
            layout: 'none',
            emphasis: { focus: 'adjacency' },
            data: [{name: 'a'}, {name: 'b'}, {name: 'a1'}, {name: 'a2'}, {name: 'b1'}, {name: 'c'}],
            links: [{source: 'a', target: 'a1', value: 5}, {source: 'a', target: 'a2', value: 3}, {source: 'b', target: 'b1', value: 8}, {source: 'a', target: 'b1', value: 3}, {source: 'b1', target: 'a1', value: 1}, {source: 'b1', target: 'c', value: 2}]
        };
    case 'series.radar':
        return {
            type: 'radar',
            name: 'New Radar Series',
            data: [
                {
                    value: [60, 73, 85, 40, 50, 80],
                    name: 'Budget'
                }
            ]
        };
    case 'series.boxplot':
        return {
            type: 'boxplot',
            name: 'New Boxplot',
            data: [
                [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980]
            ]
        };
    case 'series.lines':
        return {
            type: 'lines',
            name: 'New Lines',
            coordinateSystem: 'geo',
            data: []
        };
    case 'series.pictorialBar':
        return {
            type: 'pictorialBar',
            name: 'New PictorialBar',
            data: [10, 50, 20]
        };
    case 'series.themeRiver':
        return {
            type: 'themeRiver',
            name: 'New ThemeRiver',
            data: [['2015/11/08', 10, 'DQ'], ['2015/11/09', 15, 'DQ'], ['2015/11/10', 35, 'DQ']]
        };
    case 'series.custom':
        return {
            type: 'custom',
            name: 'New Custom',
            renderItem: (params: any, api: any) => { return {}; },
            data: [10, 20]
        };
    case 'xAxis': 
      return { 
        type: 'category', 
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        boundaryGap: true
      };
    case 'yAxis': 
      return { 
        type: 'value' 
      };
    case 'grid': 
      return { 
        left: '10%', 
        right: '10%', 
        top: 60, 
        bottom: 60,
        containLabel: true,
        show: true,
        borderWidth: 1,
        borderColor: '#ccc'
      };
    case 'title': 
      return { 
        text: 'New Title', 
        subtext: 'Subtitle',
        left: 'center',
        top: 'top' 
      };
    case 'legend': 
      return { 
        show: true, 
        left: 'center', 
        top: 'bottom',
        orient: 'horizontal'
      };
    case 'tooltip':
      return {
        show: true,
        trigger: 'axis'
      };
    case 'dataZoom':
      return {
        type: 'slider',
        start: 0,
        end: 100
      };
    case 'visualMap':
      return {
        type: 'continuous',
        min: 0,
        max: 100,
        calculable: true,
        orient: 'vertical',
        left: 'right',
        bottom: 'center'
      };
    case 'toolbox':
      return {
        show: true,
        feature: {
          saveAsImage: {},
          dataZoom: {},
          restore: {}
        }
      };
    case 'brush':
        return {
            toolbox: ['rect', 'polygon', 'keep', 'clear'],
            xAxisIndex: 'all',
            brushLink: 'all',
            outOfBrush: {
                colorAlpha: 0.1
            }
        };
    case 'timeline':
         return {
             axisType: 'category',
             autoPlay: true,
             playInterval: 1000,
             data: ['2002-01-01', '2003-01-01', '2004-01-01'],
             label: {
                 formatter: (s: any) => (new Date(s)).getFullYear()
             }
         };
    case 'graphic':
         return {
             type: 'circle',
             left: 'center',
             top: 'center',
             shape: { r: 50 },
             style: { fill: '#3b82f6' }
         };
    case 'radar':
        return {
            indicator: [
                { name: 'Sales', max: 6500 },
                { name: 'Administration', max: 16000 },
                { name: 'Information Tech', max: 30000 },
                { name: 'Customer Support', max: 38000 },
                { name: 'Development', max: 52000 },
                { name: 'Marketing', max: 25000 }
            ]
        };
    case 'polar':
        return { center: ['50%', '50%'] };
    case 'angleAxis':
        return { type: 'category', data: ['A', 'B', 'C'] };
    case 'radiusAxis':
        return {};
    case 'geo':
        return { map: 'world', roam: true };
    case 'dataset':
        return { source: [['product', '2015', '2016', '2017'], ['Matcha Latte', 43.3, 85.8, 93.7], ['Milk Tea', 83.1, 73.4, 55.1]] };
    default:
      return {};
  }
};
