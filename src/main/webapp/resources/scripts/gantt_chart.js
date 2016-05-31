(function(){
    var w = 1000;
    var barHeight = 20;
    var serverResp = [
        {
            "gvm": 1,
            "detail": 1,
            "start": 7,
            "end": 9
        },
        {
            "gvm": 1,
            "detail": 2,
            "start": 14,
            "end": 15
        },
        {
            "gvm": 1,
            "detail": 3,
            "start": 15,
            "end": 17
        },
        {
            "gvm": 1,
            "detail": 4,
            "start": 17,
            "end": 22
        },
        {
            "gvm": 2,
            "detail": 1,
            "start": 0,
            "end": 2
        },
        {
            "gvm": 2,
            "detail": 4,
            "start": 4,
            "end": 8
        },
        {
            "gvm": 2,
            "detail": 2,
            "start": 8,
            "end": 14
        },
        {
            "gvm": 2,
            "detail": 3,
            "start": 17,
            "end": 21
        },
        {
            "gvm": 3,
            "detail": 4,
            "start": 0,
            "end": 4
        },
        {
            "gvm": 3,
            "detail": 1,
            "start": 4,
            "end": 7
        },
        {
            "gvm": 3,
            "detail": 3,
            "start": 7,
            "end": 13
        },
        {
            "gvm": 3,
            "detail": 2,
            "start": 15,
            "end": 17
        }
    ];
    var chartContainer = ".gantt-chart-container";
    var tooltipFieldsNames =  {
        task: "Деталь",
        type: "ГВМ",
        startTime: "Початок",
        endTime: "Кінець",
        details: "Опис"
    };




    var taskArray = serverResp.map(el => {                  //Трансформований масив задач
        return {
            task: "Деталь " + el.detail,
            type: "ГВМ "+ el.gvm,
            startTime: el.start,
            endTime: el.end,
            details: el.details
        }
    });

    var catsUnfiltered = taskArray.map(el => el.type),
        categories = checkUnique(catsUnfiltered).sort(),    //масив імен катеогорій(рядків)
        tasksUnfiltered = taskArray.map(el => el.task),
        taskNames = checkUnique(tasksUnfiltered).sort();        //масив імен усіх задач

    var taskStripeVertOffset = 2,                           //відступ полоски із задачею від верхньої/нижньої меж рядка
        gap = barHeight + taskStripeVertOffset*2,           //висота 1 рядка на діаграмі
        leftSidePadding = 100,                              //відступ збоку для підписів осі OY
        rightSidePadding = 100,                             //відступ справа для легенди
        xAxisLablesH = 20,		                            //висота підписів вісі ОХ
        legendRowH = 20,                                    //висота рядка у легенді
        categoriesRowsH = categories.length*gap + xAxisLablesH,
        legendRowsH = legendRowH*taskNames.length,
        h = Math.max(categoriesRowsH, legendRowsH),         //висота діаграми
        OXStep = 20;                                        //крок із позначками по вісі ОХ

    var maxTaskTime = d3.max(taskArray, d => d.endTime),
        chartScale = d3.scale.linear()      //масштабування із діапазону [Min ; Max]знач масиву у ширину графіка
            .domain([0, maxTaskTime])
            .range([0, w - rightSidePadding - leftSidePadding]);

    var xAxisTicks = Math.floor(chartScale(maxTaskTime)/OXStep); //кількість позначок по вісі ОХ

    var colorScale = d3.scale.linear()                      //діапазон кольорів для задач
        .domain([0, taskNames.length])
        .range(["#00B9FA", "#F95002"])
        .interpolate(d3.interpolateHcl);

    var svg = d3.selectAll(chartContainer)
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "svg");





    makeGant(taskArray, w, h);

    function makeGant(taskArray, pageWidth, pageHeight) {
        makeGrid(leftSidePadding, pageWidth, pageHeight);
        drawRects(taskArray, gap, leftSidePadding, barHeight, colorScale, pageWidth, pageHeight);
        rowLabels(gap, leftSidePadding, barHeight);
        drawLegend(taskNames, w, legendRowH, colorScale);
    }

    function drawRects(theArray, theGap, leftSidePadding, theBarHeight, theColorScale, w, h) {
        var bigRects = svg.append("g")
            .selectAll("rect")
            .data(categories)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", function(d, i){
                return i*theGap;
            })
            .attr("width", function(d) {
                return w - rightSidePadding;
            })
            .attr("height", theGap)
            .attr("class", "gantt-chart-row");

        var innerRects = svg.append('g')
            .selectAll("rect")
            .data(theArray)
            .enter()
            .append("rect")
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("x", function(d){
                return chartScale(d.startTime) + leftSidePadding;
            })
            .attr("y", function(d, i) {
                var categoryIndex = categories.findIndex(cat => cat === d.type);
                return categoryIndex*theGap + taskStripeVertOffset;
            })
            .attr("width", function(d){
                return (chartScale(d.endTime)-chartScale(d.startTime));
            })
            .attr("height", theBarHeight)
            .attr("fill", function(d){
                for (var i = 0; i < taskNames.length; i++){
                    if (d.task == taskNames[i]){
                        return d3.rgb(theColorScale(i));
                    }
                }
            })
            .attr("class", "gantt-chart-stripe");

        var tooltipHtmlStr = function(data, x, y) {
            var detailsField;
            if(data.details != undefined)
                detailsField = `
                    <span class="gantt-chart-tooltip__title-field">
                        ${tooltipFieldsNames.details || 'Details'}:
                    <\/span>  
                    ${data.task} <br/> `;
            else
                detailsField = "";
            return `<div class="gantt-chart-tooltip" style="top: ${y}; left:${x}">
                        <span class="gantt-chart-tooltip__title-field">${tooltipFieldsNames.task || 'Task'}:<\/span>  
                        ${data.task} <br/> 
                        <span class="gantt-chart-tooltip__title-field">${tooltipFieldsNames.type || 'Type'       }:<\/span>  
                        ${data.type} <br/>
                        <span class="gantt-chart-tooltip__title-field">${tooltipFieldsNames.startTime || 'Starts'}:<\/span>  
                        ${data.startTime} <br/>
                        <span class="gantt-chart-tooltip__title-field">${tooltipFieldsNames.endTime || 'Ends'    }:<\/span>  
                        ${data.endTime}
                        <span class="gantt-chart-tooltip__title-field">
                        ${detailsField}
                    <\/div>`;
        };

        innerRects.on('mouseover', function(e) {
            var x = (this.x.animVal.value + this.width.animVal.value/2) + "px";
            var y = this.y.animVal.value + 25 + "px";

            document.querySelector(chartContainer)
                .insertAdjacentHTML("beforeEnd", tooltipHtmlStr(d3.select(this).data()[0], x, y));
        }).on('mouseout', function() {
            var tooltips = document.getElementsByClassName("gantt-chart-tooltip");
            Array.from(tooltips)
                .forEach(el => el.remove(el));
        });
    }

    function makeGrid(leftSidePadding, w, h) {
        var xAxis = d3.svg.axis()
            .scale(chartScale)
            .orient('bottom')
            .ticks( xAxisTicks )
            .tickSize(h - xAxisLablesH, 0, 0)	//висота ліній - висота усієї діаграми - висота підписвів вісі ОХ
            .tickFormat(d => d);

        var grid = svg.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(${leftSidePadding} , ${0})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "middle")
            .attr("fill", "#000")
            .attr("stroke", "none")
            .attr("font-size", 10)
            .attr("dy", "1em");
    }

    function rowLabels(theGap, leftSidePadding, theBarHeight, rowLabelsColor="black") {
        var axisText = svg.append("g") //without doing this, impossible to put grid lines behind text
            .selectAll("text")
            .data(categories)
            .enter()
            .append("text")
            .text(d => d)
            .attr("x", 10)
            .attr("y", function(d, i){
                return i*theGap;
            })
            .attr("font-size", 11)
            .attr("text-anchor", "start")
            .attr("text-height", 14)
            .attr("class", "gantt-chart-row-label")
        //   .attr("fill", rowLabelsColor);
    }

    function drawLegend(taskNames, chartW, legendRowH, theColorScale) {
        var legendTable = svg.append("g")
            .attr("class", "legend-table");

        var legend = legendTable.selectAll(".legend-row")
            .data(taskNames)
            .enter().append("g")
            .attr("class", "legend-row")
            .attr("transform", function(d, i) {
                return "translate(0, " + i * legendRowH + ")";
            });

        legend.append("rect")
            .attr("x", chartW - 10)
            .attr("y", 4)
            .attr("width", 10)
            .attr("height", 10)
            .attr("class", "legend-square")
            .style("fill", (d, i) => d3.rgb(theColorScale(i)) );

        legend.append("text")
            .attr("x", chartW - 14)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .attr("class", "legend-text")
            .text(d => d);
    }

//from this stackexchange question: http://stackoverflow.com/questions/1890203/unique-for-arrays-in-javascript
    function checkUnique(arr) {
        var hash = {}, result = [];
        for ( var i = 0, l = arr.length; i < l; ++i ) {
            if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
                hash[ arr[i] ] = true;
                result.push(arr[i]);
            }
        }
        return result;
    }

//from this stackexchange question: http://stackoverflow.com/questions/14227981/count-how-many-strings-in-an-array-have-duplicates-in-the-same-array
    function getCounts(arr) {
        var i = arr.length, // var to loop over
            obj = {}; // obj to store results
        while (i) obj[arr[--i]] = (obj[arr[i]] || 0) + 1; // count occurrences
        return obj;
    }

// get specific from everything
    function getCount(word, arr) {
        return getCounts(arr)[word] || 0;
    }


    window.makeGant = makeGant;
}());
