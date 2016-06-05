class GanttChart {
    constructor(options) {
        if(!options.chartContainer)
            throw new Error("Attempt to create new Gantt Chart without option chartContainer passed.");
        else
            this.chartContainer = options.chartContainer;
        if(!options.tasksData.length)
            throw new Error("Attempt to create new Gantt Chart, but incorrect argument taskData passed.");
        else
            this.taskArray = options.tasksData;
        this.w = options.w || 800;
        this.OXStep = options.OXStep || 20;                     //крок із позначками по вісі ОХ
        this.barHeight = options.barHeight || 20;
        this.tooltipFieldsNames = options.tooltipFieldsNames || {
                task: "Задача",
                type: "Категорія",
                startTime: "Початок",
                endTime: "Кінець",
                details: "Опис"
            };

        //сортуємо назви так, щоб спочатку сортувались по імені, а якщо імена співпадають, то по номеру після імені
        function compareByNameAndNumber(t1,t2) {
            let [,nameT1,numT1] = t1.match(/(\D+)(\d+)/i),
                [,nameT2,numT2] = t2.match(/(\D+)(\d+)/i);
            if((nameT1 === nameT2) && numT1 && numT2) return numT1 - numT2;
            else return nameT1 > nameT2;
        }

        this.catsUnfiltered = this.taskArray.map(el => el.type);
        this.categories = utils.checkUnique(this.catsUnfiltered).sort(compareByNameAndNumber); //масив імен катеогорій(рядків)
        this.tasksUnfiltered = this.taskArray.map(el => el.task);
        this.taskNames = utils.checkUnique(this.tasksUnfiltered).sort(compareByNameAndNumber); //масив імен усіх задач

        this.taskStripeVertOffset = 2;                           //відступ полоски із задачею від верхньої/нижньої меж рядка
        this.gap = this.barHeight + this.taskStripeVertOffset*2; //висота 1 рядка на діаграмі
        this.leftSidePadding = 60;                              //відступ збоку для підписів осі OY
        this.rightSidePadding = 100;                             //відступ справа для легенди
        this.xAxisLablesH = 20;		                             //висота підписів вісі ОХ
        this.legendRowH = 20;                                    //висота рядка у легенді
        this.categoriesRowsH = this.categories.length*this.gap;
        this.gridH = this.categoriesRowsH + this.xAxisLablesH;
        this.legendRowsH = this.legendRowH*this.taskNames.length;
        this.h = Math.max(this.gridH, this.legendRowsH);         //висота діаграми

        this.maxTaskTime = d3.max(this.taskArray, d => d.endTime);
        this.chartScale = d3.scale.linear()      //масштабування із діапазону [Min ; Max]знач масиву у ширину графіка
            .domain([0, this.maxTaskTime])
            .range([0, this.w - this.rightSidePadding - this.leftSidePadding]);

        this.xAxisTicks = Math.floor(this.chartScale(this.maxTaskTime)/this.OXStep); //кількість позначок по вісі ОХ

        this.colorScale = d3.scale.linear()                      //діапазон кольорів для задач
            .domain([0, this.taskNames.length])
            .range(["#00B9FA", "#F95002"])
            .interpolate(d3.interpolateHcl);

        this.svg = d3.select(this.chartContainer)
            .append("svg")
            .attr("width", this.w)
            .attr("height", this.h)
            .attr("class", "svg");
    }

    drawChart() {
        this.makeGrid();
        this.drawRects();
        this.drawRowLabels();
        this.drawLegend();
    }

    drawRects() {
        var self = this;
        var bigRects = this.svg.append("g")
            .selectAll("rect")
            .data(this.categories)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", (d, i) => i*this.gap)
            .attr("width", d => this.w - this.rightSidePadding)
            .attr("height", this.gap)
            .attr("class", "gantt-chart-row");

        var rectangles = this.svg.append('g')
            .selectAll("rect")
            .data(this.taskArray)
            .enter();

        var innerRects = rectangles
            .append("rect")
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("x", d => this.chartScale(d.startTime) + this.leftSidePadding)
            .attr("y", (d) => {
                var categoryIndex = this.categories.findIndex(cat => cat === d.type);
                return categoryIndex*this.gap + this.taskStripeVertOffset;
            })
            .attr("width", (d) => {
                return this.chartScale(d.endTime) - this.chartScale(d.startTime);
            })
            .attr("height", this.barHeight)
            .attr("fill", (d) => {
                for (var i = 0; i < this.taskNames.length; i++)
                    if (d.task == this.taskNames[i])
                        return d3.rgb(this.colorScale(i));
            })
            .attr("class", "gantt-chart-stripe");

        var rectText = rectangles.append("text")
            .text(d => d.shortTaskName)
            .attr("x", (d) => {
                return (this.chartScale(d.endTime)-this.chartScale(d.startTime))/2 + this.chartScale(d.startTime) + this.leftSidePadding;
            })
            .attr("y", (d, i) => {
                var categoryIndex = this.categories.findIndex(cat => cat === d.type);
                return categoryIndex*this.gap + this.taskStripeVertOffset;
            })
            .attr("font-size", 11)
            .attr("text-anchor", "middle")
            .attr("text-height", this.barHeight)
            .attr("class", "gantt-chart-stripe-label");

        var tooltipHtmlStr = (data, x, y) => {
            var detailsField;
            if(data.details != undefined)
                detailsField = `
                    <span class="gantt-chart-tooltip__title-field">
                        ${this.tooltipFieldsNames.details}:
                    <\/span>  
                    ${data.task} <br/> `;
            else
                detailsField = "";
            return `<div class="gantt-chart-tooltip" style="top: ${y}; left:${x}">
                        <span class="gantt-chart-tooltip__title-field">${this.tooltipFieldsNames.task     }:<\/span>  
                        ${data.task} <br/> 
                        <span class="gantt-chart-tooltip__title-field">${this.tooltipFieldsNames.type     }:<\/span>  
                        ${data.type} <br/>
                        <span class="gantt-chart-tooltip__title-field">${this.tooltipFieldsNames.startTime}:<\/span>  
                        ${data.startTime} <br/>
                        <span class="gantt-chart-tooltip__title-field">${this.tooltipFieldsNames.endTime   }:<\/span>  
                        ${data.endTime}
                        <span class="gantt-chart-tooltip__title-field">
                        ${detailsField}
                    <\/div>`;
        };

        innerRects
            .on('mouseover', function() {
                var x = (this.x.animVal.value + this.width.animVal.value/2) + "px";
                var y = this.y.animVal.value + 25 + "px";

                self.chartContainer.insertAdjacentHTML("beforeEnd", tooltipHtmlStr(d3.select(this).data()[0], x, y));
            })
            .on('mouseout', function() {
                var tooltips = document.getElementsByClassName("gantt-chart-tooltip");
                Array.from(tooltips)
                    .forEach(el => el.remove(el));
            });

        rectText
            .on('mouseover', function(e) {
                var x = this.x.animVal.getItem(this).value + "px";
                var y = this.y.animVal.getItem(this).value + 25 + "px";

                self.chartContainer.insertAdjacentHTML("beforeEnd", tooltipHtmlStr(d3.select(this).data()[0], x, y));
            })
            .on('mouseout', function (e) {
                var tooltips = document.getElementsByClassName("gantt-chart-tooltip");
                Array.from(tooltips)
                    .forEach(el => el.remove(el));
            });
    }

    makeGrid() {
        var xAxis = d3.svg.axis()
            .scale(this.chartScale)
            .orient('bottom')
            .ticks( this.xAxisTicks )
            .tickSize(this.gridH - this.xAxisLablesH, 0, 0)	//висота ліній - висота усієї діаграми - висота підписвів вісі ОХ
            .tickFormat(d => d);

        var grid = this.svg.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(${this.leftSidePadding} , ${0})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "middle")
            .attr("fill", "#000")
            .attr("stroke", "none")
            .attr("font-size", 10)
            .attr("dy", "1em");
    }

    drawRowLabels() {
        var axisText = this.svg.append("g") //without doing this, impossible to put grid lines behind text
            .selectAll("text")
            .data(this.categories)
            .enter()
            .append("text")
            .text(d => d)
            .attr("x", 3)
            .attr("y", (d, i) => i*this.gap )
            .attr("font-size", 11)
            .attr("text-anchor", "start")
            .attr("text-height", 14)
            .attr("class", "gantt-chart-row-label");
        //   .attr("fill", rowLabelsColor);
    }

    drawLegend() {
        var legendTable = this.svg.append("g")
            .attr("class", "legend-table");

        var legend = legendTable.selectAll(".legend-row")
            .data(this.taskNames)
            .enter().append("g")
            .attr("class", "legend-row")
            .attr("transform", (d, i) => {
                return "translate(0, " + i * this.legendRowH + ")";
            });

        legend.append("rect")
            .attr("x", this.w - 10)
            .attr("y", 4)
            .attr("width", 10)
            .attr("height", 10)
            .attr("class", "legend-square")
            .style("fill", (d, i) => d3.rgb(this.colorScale(i)) );

        legend.append("text")
            .attr("x", this.w - 14)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .attr("class", "legend-text")
            .text(d => d);
    }
}

var utils = {
    //from this stackexchange question: http://stackoverflow.com/questions/1890203/unique-for-arrays-in-javascript
    checkUnique(arr) {
        var hash = {}, result = [];
        for ( var i = 0, l = arr.length; i < l; ++i ) {
            if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
                hash[ arr[i] ] = true;
                result.push(arr[i]);
            }
        }
        return result;
    },
    getColor(i) {

    }//,
    /*
     //from this stackexchange question: http://stackoverflow.com/questions/14227981/count-how-many-strings-in-an-array-have-duplicates-in-the-same-array
     getCounts(arr) {
     var i = arr.length, // var to loop over
     obj = {}; // obj to store results
     while (i) obj[arr[--i]] = (obj[arr[i]] || 0) + 1; // count occurrences
     return obj;
     },

     // get specific from everything
     getCount(word, arr) {
     return this.getCounts(arr)[word] || 0;
     }
     */
};