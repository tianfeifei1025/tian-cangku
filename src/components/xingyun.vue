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
          /* 数学节点（扩展至6级，新增4个2级同父节点） */
          { id: 'm0', name: '高等数学', category: 'math-1', value: 15 }, // 第1级（中心父级）
          { id: 'm1', name: '线性代数', category: 'math-2', value: 12 },
          { id: 'm2', name: '概率论', category: 'math-2', value: 12 },
          { id: 'm7', name: '数学分析', category: 'math-2', value: 12 }, // 新增2级节点1
          { id: 'm8', name: '几何拓扑', category: 'math-2', value: 12 }, // 新增2级节点2
          { id: 'm9', name: '代数学引论', category: 'math-2', value: 12 }, // 新增2级节点3
          { id: 'm10', name: '数论基础', category: 'math-2', value: 12 }, // 新增2级节点4
          { id: 'm3', name: '微积分', category: 'math-3', value: 10 },
          { id: 'm4', name: '微分方程', category: 'math-4', value: 8 },
          { id: 'm5', name: '数值分析', category: 'math-5', value: 6 },
          { id: 'm6', name: '计算数学', category: 'math-6', value: 4 },

          /* 物理节点（扩展至6级） */
          { id: 'p0', name: '理论物理', category: 'physics-1', value: 15 }, // 第1级（中心）
          { id: 'p1', name: '量子力学', category: 'physics-2', value: 12 }, // 第2级
          { id: 'p2', name: '热力学', category: 'physics-2', value: 12 }, // 第2级（多父级示例）
          { id: 'p3', name: '电磁学', category: 'physics-3', value: 10 }, // 第3级
          { id: 'p4', name: '统计物理', category: 'physics-4', value: 8 }, // 第4级
          { id: 'p5', name: '凝聚态物理', category: 'physics-5', value: 6 }, // 第5级
          { id: 'p6', name: '天体物理', category: 'physics-6', value: 4 }, // 第6级

          /* 编程节点（扩展至6级） */
          { id: 'c0', name: '编程基础', category: 'code-1', value: 15 }, // 第1级（中心）
          { id: 'c1', name: '数据结构', category: 'code-2', value: 12 }, // 第2级
          { id: 'c2', name: '算法设计', category: 'code-2', value: 12 }, // 第2级（多父级示例）
          { id: 'c3', name: '编程语言', category: 'code-3', value: 10 }, // 第3级
          { id: 'c4', name: '操作系统', category: 'code-4', value: 8 }, // 第4级
          { id: 'c5', name: '计算机网络', category: 'code-5', value: 6 }, // 第5级
          { id: 'c6', name: '分布式系统', category: 'code-6', value: 4 }, // 第6级

          /* 新增星云示例1：天文学 */
          { id: 'a0', name: '天文学基础', category: 'astro-1', value: 15 }, // 第1级（中心）
          { id: 'a1', name: '天体测量', category: 'astro-2', value: 12 }, // 第2级
          { id: 'a2', name: '天体力学', category: 'astro-2', value: 12 }, // 第2级（多父级示例）
          { id: 'a3', name: '恒星物理', category: 'astro-3', value: 10 }, // 第3级
          { id: 'a4', name: '星系天文学', category: 'astro-4', value: 8 }, // 第4级
          { id: 'a5', name: '宇宙学', category: 'astro-5', value: 6 }, // 第5级
          { id: 'a6', name: '暗物质研究', category: 'astro-6', value: 4 }, // 第6级

          /* 新增星云示例2：化学 */
          { id: 'h0', name: '化学基础', category: 'chem-1', value: 15 }, // 第1级（中心）
          { id: 'h1', name: '无机化学', category: 'chem-2', value: 12 }, // 第2级
          { id: 'h2', name: '有机化学', category: 'chem-2', value: 12 }, // 第2级（多父级示例）
          { id: 'h3', name: '物理化学', category: 'chem-3', value: 10 }, // 第3级
          { id: 'h4', name: '分析化学', category: 'chem-4', value: 8 }, // 第4级
          { id: 'h5', name: '材料化学', category: 'chem-5', value: 6 }, // 第5级
          { id: 'h6', name: '生物化学', category: 'chem-6', value: 4 }, // 第6级

          /* 新增星云示例3：生物学 */
          { id: 'b0', name: '生物学基础', category: 'bio-1', value: 15 }, // 第1级（中心）
          { id: 'b1', name: '分子生物学', category: 'bio-2', value: 12 }, // 第2级
          { id: 'b2', name: '细胞生物学', category: 'bio-2', value: 12 }, // 第2级（多父级示例）
          { id: 'b3', name: '遗传学', category: 'bio-3', value: 10 }, // 第3级
          { id: 'b4', name: '生态学', category: 'bio-4', value: 8 }, // 第4级
          { id: 'b5', name: '进化论', category: 'bio-5', value: 6 }, // 第5级
          { id: 'b6', name: '神经生物学', category: 'bio-6', value: 4 }, // 第6级
        ],
        links: [
          /* 数学父子关系（新增4个2级节点的父级连接） */
          { source: 'm0', target: 'm1', type: 'parent' },
          { source: 'm0', target: 'm2', type: 'parent' },
          { source: 'm0', target: 'm7', type: 'parent' }, // 数学分析→高等数学
          { source: 'm0', target: 'm8', type: 'parent' }, // 几何拓扑→高等数学
          { source: 'm0', target: 'm9', type: 'parent' }, // 代数学引论→高等数学
          { source: 'm0', target: 'm10', type: 'parent' }, // 数论基础→高等数学
          { source: 'm1', target: 'm3', type: 'parent' },
          { source: 'm2', target: 'm3', type: 'parent' },
          { source: 'm3', target: 'm4', type: 'parent' },
          { source: 'm4', target: 'm5', type: 'parent' },
          { source: 'm5', target: 'm6', type: 'parent' },

          /* 物理6级关系（含多父级） */
          { source: 'p0', target: 'p1', type: 'parent' },
          { source: 'p0', target: 'p2', type: 'parent' },
          { source: 'p1', target: 'p3', type: 'parent' },
          { source: 'p2', target: 'p3', type: 'parent' }, // 多父级：p3连接p1和p2
          { source: 'p3', target: 'p4', type: 'parent' },
          { source: 'p4', target: 'p5', type: 'parent' },
          { source: 'p5', target: 'p6', type: 'parent' },

          /* 编程6级关系（含多父级） */
          { source: 'c0', target: 'c1', type: 'parent' },
          { source: 'c0', target: 'c2', type: 'parent' },
          { source: 'c1', target: 'c3', type: 'parent' },
          { source: 'c2', target: 'c3', type: 'parent' }, // 多父级：c3连接c1和c2
          { source: 'c3', target: 'c4', type: 'parent' },
          { source: 'c4', target: 'c5', type: 'parent' },
          { source: 'c5', target: 'c6', type: 'parent' },

          /* 天文学示例关系 */
          { source: 'a0', target: 'a1', type: 'parent' },
          { source: 'a0', target: 'a2', type: 'parent' },
          { source: 'a1', target: 'a3', type: 'parent' },
          { source: 'a2', target: 'a3', type: 'parent' }, // 多父级
          { source: 'a3', target: 'a4', type: 'parent' },
          { source: 'a4', target: 'a5', type: 'parent' },
          { source: 'a5', target: 'a6', type: 'parent' },

          /* 化学示例关系 */
          { source: 'h0', target: 'h1', type: 'parent' },
          { source: 'h0', target: 'h2', type: 'parent' },
          { source: 'h1', target: 'h3', type: 'parent' },
          { source: 'h2', target: 'h3', type: 'parent' }, // 多父级
          { source: 'h3', target: 'h4', type: 'parent' },
          { source: 'h4', target: 'h5', type: 'parent' },
          { source: 'h5', target: 'h6', type: 'parent' },

          /* 生物学示例关系 */
          { source: 'b0', target: 'b1', type: 'parent' },
          { source: 'b0', target: 'b2', type: 'parent' },
          { source: 'b1', target: 'b3', type: 'parent' },
          { source: 'b2', target: 'b3', type: 'parent' }, // 多父级
          { source: 'b3', target: 'b4', type: 'parent' },
          { source: 'b4', target: 'b5', type: 'parent' },
          { source: 'b5', target: 'b6', type: 'parent' }
        ],
        categories: [
          // 数学6级颜色（蓝色渐变）
          { name: 'math-1', itemStyle: { color: '#0A2463' } }, // 第1级（最深）
          { name: 'math-2', itemStyle: { color: '#3E92CC' } },
          { name: 'math-3', itemStyle: { color: '#73BFD4' } },
          { name: 'math-4', itemStyle: { color: '#B5EAD7' } },
          { name: 'math-5', itemStyle: { color: '#E2F0CB' } },
          { name: 'math-6', itemStyle: { color: '#FFF8E7' } }, // 第6级（最浅）

          // 物理6级颜色（红色渐变）
          { name: 'physics-1', itemStyle: { color: '#641220' } },
          { name: 'physics-2', itemStyle: { color: '#8C1C13' } },
          { name: 'physics-3', itemStyle: { color: '#9A2D14' } },
          { name: 'physics-4', itemStyle: { color: '#B24C1A' } },
          { name: 'physics-5', itemStyle: { color: '#D57A24' } },
          { name: 'physics-6', itemStyle: { color: '#F1AB24' } },

          // 编程6级颜色（绿色渐变）
          { name: 'code-1', itemStyle: { color: '#004B23' } },
          { name: 'code-2', itemStyle: { color: '#006400' } },
          { name: 'code-3', itemStyle: { color: '#007200' } },
          { name: 'code-4', itemStyle: { color: '#008000' } },
          { name: 'code-5', itemStyle: { color: '#38B000' } },
          { name: 'code-6', itemStyle: { color: '#70E000' } },

          // 天文学6级颜色（紫色渐变）
          { name: 'astro-1', itemStyle: { color: '#311847' } },
          { name: 'astro-2', itemStyle: { color: '#44318D' } },
          { name: 'astro-3', itemStyle: { color: '#5D54A4' } },
          { name: 'astro-4', itemStyle: { color: '#726DA8' } },
          { name: 'astro-5', itemStyle: { color: '#8884FF' } },
          { name: 'astro-6', itemStyle: { color: '#9F9CFF' } },

          // 化学6级颜色（橙色渐变）
          { name: 'chem-1', itemStyle: { color: '#7F4F24' } },
          { name: 'chem-2', itemStyle: { color: '#936639' } },
          { name: 'chem-3', itemStyle: { color: '#A68A64' } },
          { name: 'chem-4', itemStyle: { color: '#B69D86' } },
          { name: 'chem-5', itemStyle: { color: '#C2B28F' } },
          { name: 'chem-6', itemStyle: { color: '#D4C292' } },

          // 生物学6级颜色（青色渐变）
          { name: 'bio-1', itemStyle: { color: '#003049' } },
          { name: 'bio-2', itemStyle: { color: '#005F73' } },
          { name: 'bio-3', itemStyle: { color: '#0A9396' } },
          { name: 'bio-4', itemStyle: { color: '#94D2BD' } },
          { name: 'bio-5', itemStyle: { color: '#E9D8A6' } },
          { name: 'bio-6', itemStyle: { color: '#EE9B00' } }
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

      const option = {
        title: { text: '星云效果知识点图', textStyle: { color: '#fff' } },
        backgroundColor: '#0a0a2a',
        tooltip: { textStyle: { color: '#fff' } },
        // 关键修改：移除右侧图例配置（原legend部分）
        series: [{
          type: 'graph',
          layout: 'force',
          data: this.knowledgeData.nodes.map(node => {
            let sizeRatio;
            if (node.category.includes('-1')) {
              sizeRatio = 8;
            } else if (node.category.includes('-2')) {
              sizeRatio = 6;
            } else {
              sizeRatio = 4;
            }

            const baseColor = categoryColorMap[node.category] || '#fff';

            return {
              ...node,
              itemStyle: {
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [
                  { offset: 0, color: 'rgba(255,255,255,0.9)' },
                  { offset: 1, color: baseColor }
                ]),
                shadowColor: baseColor,
                shadowBlur: node.value * sizeRatio * 2
              },
              symbolSize: node.value * sizeRatio
            }
          }),
          links: this.knowledgeData.links.map(link => ({ 
            ...link,
            lineStyle: {
              color: 'rgba(255,255,255,0.3)',
              width: 0.8,
              type: link.type === 'parent' ? 'solid' : 'dashed',
              curveness: 0.2
            },
            symbol: ['none', 'arrow'],
            symbolSize: 8
          })),
          categories: this.knowledgeData.categories,
          roam: true,
          draggable: true,
          label: { 
            show: true,
            position: 'inside', 
            color: '#fff',
            fontSize: 10, // 适当减小字体大小避免超出节点
            align: 'center', // 水平居中
            verticalAlign: 'middle'
          },
          force: {
            repulsion: 2000,
            edgeLength: [50, 120],
            friction: 0.8,
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
