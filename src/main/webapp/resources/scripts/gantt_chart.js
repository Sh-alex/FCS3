(function(){
    var w = 800;
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




    var taskArray = serverResp.map(el => {
        return {
            task: "Деталь " + el.detail,
            type: "ГВМ "+ el.gvm,
            startTime: el.start,
            endTime: el.end,
            details: el.details
        }
    });	

    var startEndValsArr = serverResp.reduce((res, el) => { return res.push(el.start), res.push(el.end), res },[]),
        xAxisTicks = Math.max(...startEndValsArr);

    var chartScale = d3.scale.linear()
        .domain([
            d3.min(taskArray, d => d.startTime),
            d3.max(taskArray, d => d.endTime)
        ])
        .range([0, w-150]);

    var catsUnfiltered = taskArray.map(el => el.type), //for vert labels
        categories = checkUnique(catsUnfiltered),
        tasksUnfiltered = taskArray.map(el => el.task), //for vert labels
        tasks = checkUnique(tasksUnfiltered);

    var colorScale = d3.scale.linear()
        .domain([0, tasks.length])
        .range(["#00B9FA", "#F95002"])
        .interpolate(d3.interpolateHcl);


        var gap = barHeight + 4;
        var sidePadding = 75;
        var xAxisLablesH = 20;		//висота підписів вісі ОХ

        var h = categories.length*gap + xAxisLablesH;


    var svg = d3.selectAll(chartContainer)
        .append("svg");





    makeGant(taskArray, w, h);

    function makeGant(tasks, pageWidth, pageHeight) {

    svg.attr("width", w)
        .attr("height", h)
        .attr("class", "svg");

        makeGrid(sidePadding, pageWidth, pageHeight);
        drawRects(tasks, gap, sidePadding, barHeight, colorScale, pageWidth, pageHeight);
        rowLabels(gap, sidePadding, barHeight);
    }

    function drawRects(theArray, theGap, theSidePad, theBarHeight, theColorScale, w, h) {
        var bigRects = svg.append("g")
            .selectAll("rect")
            .data(new Array(categories.length))
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", function(d, i){
                return i*theGap - 2;
            })
            .attr("width", function(d){
                return w-theSidePad/2;
            })
            .attr("height", theGap)
            .attr("class", "gantt-chart-row");

        var rectangles = svg.append('g')
            .selectAll("rect")
            .data(theArray)
            .enter();

        var rowCounter = 0;
        var innerRects = rectangles.append("rect")
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("x", function(d){
                return chartScale(d.startTime) + theSidePad;
            })
            .attr("y", function(d, i) {
                return Math.floor((i/taskArray.length)*categories.length)*theGap;
            })
            .attr("width", function(d){
                return (chartScale(d.endTime)-chartScale(d.startTime));
            })
            .attr("height", theBarHeight)
            .attr("fill", function(d){
                for (var i = 0; i < tasks.length; i++){
                    if (d.task == tasks[i]){
                        return d3.rgb(theColorScale(i));
                    }
                }
            })
            .attr("class", "gantt-chart-stripe");
/*
        var rectText = rectangles.append("text")
            .text(function(d){
                return d.task;
            })
            .attr("x", function(d){
                return (chartScale(d.endTime)-chartScale(d.startTime))/2 + chartScale(d.startTime) + theSidePad;
            })
            .attr("y", function(d, i){
                return Math.floor((i/taskArray.length)*categories.length)*theGap + 14;
            })
            .attr("font-size", 11)
            .attr("text-anchor", "middle")
            .attr("text-height", theBarHeight)
            .attr("class", "gantt-chart-stripe-label");
*/
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

/*
        rectText
            .on('mouseover', function(e) {
                var x = this.x.animVal.getItem(this).value + "px";
                var y = this.y.animVal.getItem(this).value + 25 + "px";

                document.querySelector(chartContainer)
                    .insertAdjacentHTML("beforeEnd", tooltipHtmlStr(d3.select(this).data()[0], x, y));
            })
            .on('mouseout', function (e) {
                var tooltips = document.getElementsByClassName("gantt-chart-tooltip");
                Array.from(tooltips)
                    .forEach(el => el.remove(el));
            });
*/
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

    function makeGrid(theSidePad, w, h) {
        var xAxis = d3.svg.axis()
            .scale(chartScale)
            .orient('bottom')
            .ticks( xAxisTicks )
            .tickSize(h - xAxisLablesH, 0, 0)	//висота ліній - висота усієї діаграми - висота підписвів вісі ОХ
            .tickFormat(d => d);

        var grid = svg.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(${theSidePad} , ${0})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "middle")
            .attr("fill", "#000")
            .attr("stroke", "none")
            .attr("font-size", 10)
            .attr("dy", "1em");
    }

    function rowLabels(theGap, theSidePad, theBarHeight, rowLabelsColor="black") {
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
