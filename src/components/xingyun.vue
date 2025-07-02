<template>
  <div class="container">
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
// import echarts from 'echarts';
import * as echarts from 'echarts';

export default {
  name: 'XingYun',
  data() {
    return {
      knowledgeData: {
        nodes: [
          {
            "id": "1",
            "name": "计算机应用",
            "category": "math-1",
            "value": 12
          },
          {
            "id": "1924268698738995201",
            "name": "课程相关-误删",
            "category": "math-2",
            "value": 11
          },
          {
            "id": "1924645041367982081",
            "name": "产业1",
            "category": "math-2",
            "value": 11
          },
          {
            "id": "1924645088490987522",
            "name": "产业2",
            "category": "math-2",
            "value": 11
          },
          {
            "id": "1924648090765402114",
            "name": "产业3",
            "category": "math-2",
            "value": 11
          },
          {
            "id": "1925723607107149825",
            "name": "测试",
            "category": "math-2",
            "value": 11
          },
          {
            "id": "1927530791603740673",
            "name": "12",
            "category": "math-2",
            "value": 11
          },
          {
            "id": "1932689413913767937",
            "name": "计算机科学与技术",
            "category": "math-2",
            "value": 11
          },
          {
            "id": "1932689994904563714",
            "name": "计算机应用产业",
            "category": "math-2",
            "value": 11
          },
          {
            "id": "1937358562396999681",
            "name": "ssss",
            "category": "math-2",
            "value": 11
          },
          {
            "id": "1937358604407148545",
            "name": "我看看",
            "category": "math-2",
            "value": 11
          },
          {
            "id": "1937358632458653698",
            "name": "官方的",
            "category": "math-2",
            "value": 11
          },
          {
            "id": "1935996516631908353",
            "name": "方法",
            "category": "math-3",
            "value": 10
          },
          {
            "id": "1935271381838356481",
            "name": "行业6666666666666",
            "category": "math-3",
            "value": 10
          },
          {
            "id": "1932689671993487361",
            "name": "计科行业",
            "category": "math-3",
            "value": 10
          },
          {
            "id": "1929851106787328001",
            "name": "阿萨德",
            "category": "math-3",
            "value": 10
          },
          {
            "id": "1925752600577519617",
            "name": "干活干活干活",
            "category": "math-3",
            "value": 10
          },
          {
            "id": "1925748046855221249",
            "name": "行业测试",
            "category": "math-3",
            "value": 10
          },
          {
            "id": "1924270126371024898",
            "name": "课程相关-误删-2行业",
            "category": "math-3",
            "value": 10
          },
          {
            "id": "1924270074823028737",
            "name": "课程相关-误删",
            "category": "math-3",
            "value": 10
          },
          {
            "id": "1922947255660503042",
            "name": "行业3",
            "category": "math-3",
            "value": 10
          },
          {
            "id": "1935271986804412417",
            "name": "岗位9999999999",
            "category": "math-4",
            "value": 9
          },
          {
            "id": "1929851246768029697",
            "name": "顺丰是对方",
            "category": "math-4",
            "value": 9
          },
          {
            "id": "1925752996230410242",
            "name": "啊所发生的顺丰",
            "category": "math-4",
            "value": 9
          },
          {
            "id": "1924270211804803074",
            "name": "课程相关-误删-2岗位",
            "category": "math-4",
            "value": 9
          },
          {
            "id": "1924270181928775682",
            "name": "课程相关-误删",
            "category": "math-4",
            "value": 9
          },
          {
            "id": "1921801156300718081",
            "name": "UI",
            "category": "math-4",
            "value": 9
          },
          {
            "id": "1936001510307336194",
            "name": "发个回复",
            "category": "math-5",
            "value": 8
          },
          {
            "id": "1929851290627866626",
            "name": "水电费水电费",
            "category": "math-5",
            "value": 8
          },
          {
            "id": "1925877047900766209",
            "name": "测试111",
            "category": "math-5",
            "value": 8
          },
          {
            "id": "1925876961649098754",
            "name": "分段函数开发",
            "category": "math-5",
            "value": 8
          },
          {
            "id": "1924270748344365057",
            "name": "课程相关-误删-2",
            "category": "math-5",
            "value": 8
          },
          {
            "id": "1924270720141864962",
            "name": "课程相关-误删",
            "category": "math-5",
            "value": 8
          },
          {
            "id": "1921801412702715906",
            "name": "需求分析",
            "category": "math-5",
            "value": 8
          },
          {
            "id": "1921801277826482177",
            "name": "软件开发",
            "category": "math-5",
            "value": 8
          },
          {
            "id": "1929851330943516674",
            "name": "国服很过分",
            "category": "math-6",
            "value": 7
          },
          {
            "id": "1925877481503719425",
            "name": "啊啊啊啊啊",
            "category": "math-6",
            "value": 7
          },
          {
            "id": "1924270826652020738",
            "name": "课程相关-误删-2",
            "category": "math-6",
            "value": 7
          },
          {
            "id": "1924270802635436034",
            "name": "课程相关-误删",
            "category": "math-6",
            "value": 7
          },
          {
            "id": "1922123724958285825",
            "name": "导入测试",
            "category": "math-6",
            "value": 7
          },
          {
            "id": "1921805823843856386",
            "name": "软件项目开发流程",
            "category": "math-6",
            "value": 7
          },
          {
            "id": "1929851415081254914",
            "name": "地方郭德纲",
            "category": "math-7",
            "value": 6
          },
          {
            "id": "1922932136071725058",
            "name": "导入测试（15）",
            "category": "math-7",
            "value": 6
          },
          {
            "id": "1922580545451937794",
            "name": "123123",
            "category": "math-7",
            "value": 6
          },
          {
            "id": "1924730890373869570",
            "name": "啊实打实的",
            "category": "math-7",
            "value": 6
          },
          {
            "id": "1924272942112157698",
            "name": "导入测试19",
            "category": "math-7",
            "value": 6
          },
          {
            "id": "1924272942930046978",
            "name": "导入测试20",
            "category": "math-7",
            "value": 6
          }
        ],
        links: [
          {
            "source": "1",
            "target": "1924268698738995201",
            "type": "parent"
          },
          {
            "source": "1",
            "target": "1924645041367982081",
            "type": "parent"
          },
          {
            "source": "1",
            "target": "1924645088490987522",
            "type": "parent"
          },
          {
            "source": "1",
            "target": "1924648090765402114",
            "type": "parent"
          },
          {
            "source": "1",
            "target": "1925723607107149825",
            "type": "parent"
          },
          {
            "source": "1",
            "target": "1927530791603740673",
            "type": "parent"
          },
          {
            "source": "1",
            "target": "1932689413913767937",
            "type": "parent"
          },
          {
            "source": "1",
            "target": "1932689994904563714",
            "type": "parent"
          },
          {
            "source": "1",
            "target": "1937358562396999681",
            "type": "parent"
          },
          {
            "source": "1",
            "target": "1937358604407148545",
            "type": "parent"
          },
          {
            "source": "1",
            "target": "1937358632458653698",
            "type": "parent"
          },
          {
            "source": "1932689413913767937",
            "target": "1922947255660503042",
            "type": "parent"
          },
          {
            "source": "1924268698738995201",
            "target": "1924270074823028737",
            "type": "parent"
          },
          {
            "source": "1925723607107149825",
            "target": "1924270126371024898",
            "type": "parent"
          },
          {
            "source": "1924645041367982081",
            "target": "1925748046855221249",
            "type": "parent"
          },
          {
            "source": "1924645088490987522",
            "target": "1925752600577519617",
            "type": "parent"
          },
          {
            "source": "1924268698738995201",
            "target": "1929851106787328001",
            "type": "parent"
          },
          {
            "source": "1924645041367982081",
            "target": "1932689671993487361",
            "type": "parent"
          },
          {
            "source": "1924645088490987522",
            "target": "1932689671993487361",
            "type": "parent"
          },
          {
            "source": "1925723607107149825",
            "target": "1932689671993487361",
            "type": "parent"
          },
          {
            "source": "1932689413913767937",
            "target": "1932689671993487361",
            "type": "parent"
          },
          {
            "source": "1932689413913767937",
            "target": "1935271381838356481",
            "type": "parent"
          },
          {
            "source": "1932689994904563714",
            "target": "1935271381838356481",
            "type": "parent"
          },
          {
            "source": "1924648090765402114",
            "target": "1935996516631908353",
            "type": "parent"
          },
          {
            "source": "1937358632458653698",
            "target": "1935996516631908353",
            "type": "parent"
          },
          {
            "source": "1925748046855221249",
            "target": "1921801156300718081",
            "type": "parent"
          },
          {
            "source": "1924270074823028737",
            "target": "1924270181928775682",
            "type": "parent"
          },
          {
            "source": "1924270126371024898",
            "target": "1924270211804803074",
            "type": "parent"
          },
          {
            "source": "1925748046855221249",
            "target": "1924270211804803074",
            "type": "parent"
          },
          {
            "source": "1932689671993487361",
            "target": "1924270211804803074",
            "type": "parent"
          },
          {
            "source": "1925752600577519617",
            "target": "1925752996230410242",
            "type": "parent"
          },
          {
            "source": "1929851106787328001",
            "target": "1929851246768029697",
            "type": "parent"
          },
          {
            "source": "1929851106787328001",
            "target": "1935271986804412417",
            "type": "parent"
          },
          {
            "source": "1921801156300718081",
            "target": "1921801277826482177",
            "type": "parent"
          },
          {
            "source": "1921801156300718081",
            "target": "1921801412702715906",
            "type": "parent"
          },
          {
            "source": "1924270181928775682",
            "target": "1924270720141864962",
            "type": "parent"
          },
          {
            "source": "1924270211804803074",
            "target": "1924270748344365057",
            "type": "parent"
          },
          {
            "source": "1925752996230410242",
            "target": "1925876961649098754",
            "type": "parent"
          },
          {
            "source": "1924270211804803074",
            "target": "1925877047900766209",
            "type": "parent"
          },
          {
            "source": "1925752996230410242",
            "target": "1925877047900766209",
            "type": "parent"
          },
          {
            "source": "1929851246768029697",
            "target": "1929851290627866626",
            "type": "parent"
          },
          {
            "source": "1924270211804803074",
            "target": "1936001510307336194",
            "type": "parent"
          },
          {
            "source": "1925752996230410242",
            "target": "1936001510307336194",
            "type": "parent"
          },
          {
            "source": "1921801277826482177",
            "target": "1921805823843856386",
            "type": "parent"
          },
          {
            "source": "1921801412702715906",
            "target": "1921805823843856386",
            "type": "parent"
          },
          {
            "source": "1921801277826482177",
            "target": "1922123724958285825",
            "type": "parent"
          },
          {
            "source": "1925877047900766209",
            "target": "1922123724958285825",
            "type": "parent"
          },
          {
            "source": "1924270720141864962",
            "target": "1924270802635436034",
            "type": "parent"
          },
          {
            "source": "1924270748344365057",
            "target": "1924270826652020738",
            "type": "parent"
          },
          {
            "source": "1925877047900766209",
            "target": "1924270826652020738",
            "type": "parent"
          },
          {
            "source": "1925877047900766209",
            "target": "1925877481503719425",
            "type": "parent"
          },
          {
            "source": "1929851290627866626",
            "target": "1929851330943516674",
            "type": "parent"
          },
          {
            "source": "1921805823843856386",
            "target": "1924272942930046978",
            "type": "parent"
          },
          {
            "source": "1921805823843856386",
            "target": "1922932136071725058",
            "type": "parent"
          },
          {
            "source": "1921805823843856386",
            "target": "1922580545451937794",
            "type": "parent"
          },
          {
            "source": "1921805823843856386",
            "target": "1924272942112157698",
            "type": "parent"
          },
          {
            "source": "1922123724958285825",
            "target": "1922932136071725058",
            "type": "parent"
          },
          {
            "source": "1922123724958285825",
            "target": "1922580545451937794",
            "type": "parent"
          },
          {
            "source": "1924270826652020738",
            "target": "1924730890373869570",
            "type": "parent"
          },
          {
            "source": "1924270826652020738",
            "target": "1924272942112157698",
            "type": "parent"
          },
          {
            "source": "1924270802635436034",
            "target": "1924272942112157698",
            "type": "parent"
          },
          {
            "source": "1929851330943516674",
            "target": "1929851415081254914",
            "type": "parent"
          }
        ],
        categories: [
          // 数学6级颜色（蓝色渐变，与节点category属性一致）
          { name: 'math-1', itemStyle: { color: '#0A2463' } }, // 第1级（最深）
          { name: 'math-2', itemStyle: { color: '#3E92CC' } },
          { name: 'math-3', itemStyle: { color: '#73BFD4' } },
          { name: 'math-4', itemStyle: { color: '#B5EAD7' } },
          { name: 'math-5', itemStyle: { color: '#E2F0CB' } },
          { name: 'math-6', itemStyle: { color: '#FFF8E7' } }, // 第6级（最浅）
        ]
      }
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chartContainer);

      const categoryColorMap = this.knowledgeData.categories.reduce((map, cat) => {
        map[cat.name] = cat.itemStyle.color;
        return map;
      }, {});

      // 新增：定义级别与图标路径的映射（需提前在src/assets/images目录下准备对应图标文件）
      const levelIconMap = {
        'math-1': require('@/assets/images/000.png'), // 第1级图标
        'math-2': require('@/assets/images/222.png'), // 第2级图标
        'math-3': require('@/assets/images/333.png'), // 第3级图标
        'math-4': require('@/assets/images/444.png'), // 第4级图标
        'math-5': require('@/assets/images/555.png'), // 第5级图标
        'math-6': require('@/assets/images/666.png'),  // 第6级图标
        'math-7': require('@/assets/images/777.png')  // 第7级图标
      };

      const option = {
        title: { text: '星云效果知识点图', textStyle: { color: '#fff' } },
        backgroundColor: '#0a0a2a',
        // tooltip: { textStyle: { color: '#fff' } },
        series: [{
          type: 'graph',
          layout: 'force',
          zoomToFit: true,
          data: this.knowledgeData.nodes.map(node => {
            let sizeRatio;
            if (node.category.includes('-1')) { 
              sizeRatio = 10;
            } else if (node.category.includes('-2')) { 
              sizeRatio = 9; 
            } else if (node.category.includes('-3')) { 
              sizeRatio = 8; 
            } else if (node.category.includes('-4')) { 
              sizeRatio = 7; 
            } else if (node.category.includes('-5')) { 
              sizeRatio = 6; 
            } else if (node.category.includes('-6')) { 
              sizeRatio = 5; 
            } else if (node.category.includes('-7')) { 
              sizeRatio = 4;
            } 

            const baseColor = categoryColorMap[node.category] || '#fff';
            const iconPath = levelIconMap[node.category];

            return {
              ...node,
              symbol: `image://${iconPath}`, // 使用级别对应的图标
              symbolOffset: [0, 0], // 保持图标居中
              itemStyle: {
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [
                  { offset: 0, color: 'rgba(255,255,255,0.9)' },
                  { offset: 1, color: baseColor }
                ]),
                shadowColor: baseColor,
                shadowBlur: node.value * sizeRatio * 2
              },
              symbolSize: node.value * sizeRatio // 可根据图标大小调整此值（当前保持原逻辑）
            }
          }),
          links: this.knowledgeData.links.map(link => ({ 
            ...link,
            lineStyle: {
              color: 'rgba(255,255,255,0.3)',
              width: 2,
              // type: link.type === 'parent' ? 'solid' : 'dashed', //根据关系切换实线和虚线
              type:'dashed',
              curveness: 0.4
            },
            symbol: ['none', 'arrow'],
            symbolSize: 8
          })),
          categories: this.knowledgeData.categories,
          roam: true,
          draggable: true,
          label: { 
            show: true,
            // position: 'inside', //中心显示
            position: 'bottom',
            color: '#fff',
            fontSize: 10, // 适当减小字体大小避免超出节点
            // align: 'left', // 水平偏左
            verticalAlign: 'middle',
            distance: 5
          },
          force: {
            repulsion: 1500,
            edgeLength: [30, 100],
            friction: 0.1,
            nodeMass: 1.5
          }
        }]
      };

      this.chart.setOption(option);
      window.addEventListener('resize', () => this.chart.resize());
    }
  },
  beforeUnmount() {
    if (this.chart) this.chart.dispose();
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
}

.chart-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0,0,50,0.5);
}
</style>
