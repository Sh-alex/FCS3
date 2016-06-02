(function(){
    var serverResp =
            [
                {
                    "gvm": 1,
                    "detail": 2,
                    "start": 6,
                    "end": 7
                },
                {
                    "gvm": 1,
                    "detail": 3,
                    "start": 10,
                    "end": 12
                },
                {
                    "gvm": 1,
                    "detail": 4,
                    "start": 12,
                    "end": 17
                },
                {
                    "gvm": 1,
                    "detail": 1,
                    "start": 17,
                    "end": 19
                }
            ,
        
            {
                "gvm": 2,
                "detail": 2,
                "start": 0,
                "end": 6
            },
            {
                "gvm": 2,
                "detail": 4,
                "start": 6,
                "end": 10
            },
            {
                "gvm": 2,
                "detail": 1,
                "start": 10,
                "end": 12
            },
            {
                "gvm": 2,
                "detail": 3,
                "start": 12,
                "end": 16
            }
        ,
        
            {
                "gvm": 3,
                "detail": 4,
                "start": 0,
                "end": 4
            },
            {
                "gvm": 3,
                "detail": 3,
                "start": 4,
                "end": 10
            },
            {
                "gvm": 3,
                "detail": 2,
                "start": 10,
                "end": 12
            },
            {
                "gvm": 3,
                "detail": 1,
                "start": 12,
                "end": 15
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