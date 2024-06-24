Vue.component('donutChart', {
	template: '#donutTemplate',
	props: ["initialValues"],
	data() {
		return {
			angleOffset: -90,
			chartData: [],
			colors: ["#6495ED", "goldenrod", "#cd5c5c", "thistle", "lightgray"],
			cx: 80,
			cy: 80,		      
			radius: 60,
			sortedValues: [],
			strokeWidth: 30,
		}
	},
	computed: {
		// adjust the circumference to add small white gaps
		adjustedCircumference() {
			return this.circumference - 2
		},
		circumference() {
			return 2 * Math.PI * this.radius
		},
		dataTotal() {
			return this.sortedValues.reduce((acc, val) => acc + val)
		},
		calculateChartData() {
			this.sortedValues.forEach((dataVal, index) => {
				const { x, y } = this.calculateTextCoords(dataVal, this.angleOffset)
				// start at -90deg so that the largest segment is perpendicular to top
				const data = {
					degrees: this.angleOffset,
					textX: x,
					textY: y
				}
				this.chartData.push(data)
				this.angleOffset = this.dataPercentage(dataVal) * 360 + this.angleOffset        
			})
		},
		sortInitialValues() {
			return this.sortedValues = this.initialValues.sort((a,b) => b-a)
		}
	},
	methods: {
		calculateStrokeDashOffset(dataVal, circumference) {
			const strokeDiff = this.dataPercentage(dataVal) * circumference      
			return circumference - strokeDiff
		},
		calculateTextCoords(dataVal, angleOffset) {
			// t must be radians
			// x(t) = r cos(t) + j
			// y(t) = r sin(t) + j

			const angle = (this.dataPercentage(dataVal) * 360) / 2 + angleOffset      
			const radians = this.degreesToRadians(angle)

			const textCoords = {
				x: this.radius * Math.cos(radians) + this.cx,
				y: this.radius * Math.sin(radians) + this.cy
			}
			return textCoords
		},
		degreesToRadians(angle) {
			return angle * (Math.PI / 180)
		},
		dataPercentage(dataVal) {
			return dataVal / this.dataTotal
		},
		percentageString(dataVal) {
			return `${Math.round(this.dataPercentage(dataVal) * 100)}%`
		},
		returnCircleTransformValue(index) {
			return `rotate(${this.chartData[index].degrees}, ${this.cx}, ${this.cy})`
		},
		segmentBigEnough(dataVal) {
			return Math.round(this.dataPercentage(dataVal) * 100) > 5
		}    
	},
	mounted() {
		this.sortInitialValues
		this.calculateChartData
	}
})
new Vue({
	el: "#app",
	data() {
		return {
			values: [230, 308, 520, 130, 200]
		}
	},
});