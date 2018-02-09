
/** echarts通用设置 */
const echarts = require("echarts");
let echartList = new Object();
window.addEventListener("resize", () => {
    for (let i in echartList) {
        echartList[i].resize();
    }
})

class EChart {
    constructor(dom) {

        this.domInstance = document.querySelector(dom);
        this.echartInstance = echarts.init(this.domInstance);

        let fn = () => { // 初始化echart的顺序
            let len = Object.keys(echartList).length;
            this.name = "e" + len + 1;
            echartList[this.name] = this.echartInstance;
        }
        fn();

        this.showLoading();
    }
    getIndex() {
        return this.name;
    }
    setOption(opt) {
        // baseOption 是charts的基础配置
        let baseOption = {
            grid: {
                left: "5%",
                right: "5%"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            }
        }
        opt = Object.assign(baseOption, opt);

        this.echartInstance.setOption(opt);
        this.hideLoading();
    }
    // opt text: 'loading',color: '#c23531',textColor: '#000',maskColor: 'rgba(255, 255, 255, 0.8)',zlevel: 0
    showLoading(opt) {
        this.echartInstance.showLoading("default", opt);
    }
    hideLoading() {
        this.echartInstance.hideLoading();
    }
}

export default EChart;
