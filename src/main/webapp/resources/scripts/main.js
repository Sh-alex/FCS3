(function(){
    var inpForm = document.getElementById("initial-data-form"),
        selectNumGVM = document.getElementById("select-num-gvm"),
        selectNumDetails = document.getElementById("select-num-details"),
        selectCalcRule = document.getElementById("select-calc-rule"),
        textareaTimeMatrix = document.getElementById("textarea-time-matrix"),
        textareaTechRoutes = document.getElementById("textarea-tech-routes"),
        tableJobsPortfeil = document.getElementById("table-jobs-portfeil"),
        resultsBlock = document.getElementById("results-column");

    var dataState = {
        inpData: {
            numGVM: null,
            numDetails: null,
            calcRule: null,
            timeMatrix: [],
            techRoutesMatrix: []
        },
        calcData: {

        }
    };

    inpForm.addEventListener("submit", function(e){
        e.preventDefault();
        var newInpData;
        try{
            newInpData = getInpData();
        } catch (inpErr){
            console.error("inpErr: ", inpErr);
            alert("Помилка при зчитуванні введених данних. " + inpErr);
            return;
        }
        dataState.inpData = newInpData;
        calcResults(newInpData)
            .then( results => {
                dataState.calcData = results;
                renderResults(results);
                resultsBlock.classList.remove("hidden");
            })
            .catch(err => {
                console.error("calcResults catch: ", err);
                alert("Сталася помилка при спробі порахувати результати.");
            });
    });

    function getInpData(){
        var inpData = {
            numGVM: selectNumGVM.value,
            numDetails: selectNumDetails.value,
            calcRule: selectCalcRule.value,
            timeMatrix: parseStrToMatrix(textareaTimeMatrix.value),
            techRoutesMatrix: parseStrToMatrix(textareaTechRoutes.value)
        };

        //Валідація введених даних
        if(inpData.timeMatrix.length != inpData.numDetails)
            throw new Error("timeMatrix num of rows != num of details");
        inpData.timeMatrix = inpData.timeMatrix.map( row => {
            if(row.length != inpData.numGVM)
                throw new Error("timeMatrix num of cols != num of GVM");
            return row.map( el => Number.parseFloat(el));
        });

        if(inpData.techRoutesMatrix.length != inpData.numDetails)
            throw new Error("techRoutesMatrix num of rows != num of details");
        inpData.techRoutesMatrix = inpData.techRoutesMatrix.map( row => {
            if(row.length != inpData.numGVM)
                throw new Error("techRoutesMatrix num of cols != num of GVM");
            return row.map( el => Number.parseInt(el));
        });

        return inpData;
    }

    function calcResults(inpData){
        console.log("called calcResults with data:", inpData);
        return new Promise(function(resolve, reject) {

            //!!!!!!!!HARDCODED!!!!!!
            var serverResp = {
                "resultGantt": [
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
                    ],
                    [
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
                    ],
                    [
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
                    ]
                ],
                "resultBriefcase": [
                    [
                        {
                            "gvm": 1,
                            "details": [
                                2
                            ],
                            "start": 6
                        },
                        {
                            "gvm": 1,
                            "details": [
                                4,
                                3
                            ],
                            "start": 10
                        },
                        {
                            "gvm": 1,
                            "details": [
                                4
                            ],
                            "start": 12
                        },
                        {
                            "gvm": 1,
                            "details": [
                                1
                            ],
                            "start": 17
                        }
                    ],
                    [
                        {
                            "gvm": 2,
                            "details": [
                                1,
                                2
                            ],
                            "start": 0
                        },
                        {
                            "gvm": 2,
                            "details": [
                                1,
                                4
                            ],
                            "start": 6
                        },
                        {
                            "gvm": 2,
                            "details": [
                                1
                            ],
                            "start": 10
                        },
                        {
                            "gvm": 2,
                            "details": [
                                3
                            ],
                            "start": 12
                        }
                    ],
                    [
                        {
                            "gvm": 3,
                            "details": [
                                3,
                                4
                            ],
                            "start": 0
                        },
                        {
                            "gvm": 3,
                            "details": [
                                3
                            ],
                            "start": 4
                        },
                        {
                            "gvm": 3,
                            "details": [
                                2
                            ],
                            "start": 10
                        },
                        {
                            "gvm": 3,
                            "details": [
                                1
                            ],
                            "start": 12
                        }
                    ]
                ]
            };
            resolve(serverResp);

            //перетворюємо відповідь сервера у зручний вигляд (із 2-мірного масиву у одномірний, дадаємо назви)
            serverResp.resultGantt = serverResp.resultGantt.reduce( (resArr, curr) => {
                    resArr.push(...curr);
                    return resArr;
                }, []);

            /*
            $.ajax({
                    type: "POST",
                    url: "/calculate",
                    data: inpData
                })
                .done(function (data, textStatus) {
                    //TODO: додати перевірку відповіді сервера на коректність
                    if(data && true)
                        resolve(data);
                    else
                        throw new Error("Некоректна відповідь сервера");
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    console.log(`Произошла ошибка при обращении к серверу. ${errorThrown}`, arguments);
                    reject({error: true, textStatus, errorThrown});
                })
            */
        });
    }

    function renderResults(results) {
        var tasksData = results.resultGantt.map( el => {
                return {
                    task: "Деталь " + el.detail,
                    shortTaskName: el.detail,
                    type: "ГВМ "+ el.gvm,
                    startTime: el.start,
                    endTime: el.end
                }
            });

        var chart = new GanttChart({
            w: 1000,
            barHeight: 20,
            OXStep: 30,
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

        renderPortfeilTable(tableJobsPortfeil, results.resultBriefcase);
    }

    function renderPortfeilTable(container, data) {
        container.innerHTML = "Табллиця з портфелем робіт" + JSON.stringify(data);
    }

    function parseStrToMatrix(str) {
        var delEmptyStrs = (arr) => {
            return arr.reduce( (resArr, el) => {
                if(el) resArr.push(el);
                return resArr;
            }, []);
        };
        var rows = delEmptyStrs(str.split("\n"));
        return rows.reduce( (resArr, str) => {
            var parsedRowArr = delEmptyStrs( str.split(/\s/gi) );
            if (parsedRowArr.length)    //якщо рядок не пустий
                resArr.push(parsedRowArr);
            return resArr
        }, []);
    }
}());