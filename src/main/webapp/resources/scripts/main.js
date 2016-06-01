(function(){
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
    var tasksData = serverResp.map(el => {                  //Трансформований масив задач
        return {
            task: "Деталь " + el.detail,
            shortTaskName: el.detail,
            type: "ГВМ "+ el.gvm,
            startTime: el.start,
            endTime: el.end,
            details: el.details
        }
    });
    
    var chart = new GanttChart({
        w: 1000,
        barHeight: 20,
        chartContainer: ".gantt-chart-container",
        tasksData,
        tooltipFieldsNames:  {
            task: "Деталь",
            type: "ГВМ",
            startTime: "Початок",
            endTime: "Кінець",
            details: "Опис"
        }
    });
    
    chart.drawChart();
    
}());