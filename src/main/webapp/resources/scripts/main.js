(function(){
    var inpForm = document.getElementById("initial-data-form"),
        selectNumGVM = document.getElementById("select-num-gvm"),
        selectNumDetails = document.getElementById("select-num-details"),
        selectCalcRule = document.getElementById("select-calc-rule"),
        textareaTimeMatrix = document.getElementById("textarea-time-matrix"),
        textareaTechRoutes = document.getElementById("textarea-tech-routes"),
        tableJobsBriefcase = document.getElementById("table-jobs-briefcase"),
        resultsBlock = document.getElementById("results-column"),
        chartContainer = document.getElementById("gantt-chart-container");

    var dataState = {
        inpData: {
            numGVM: null,
            numDetails: null,
            calcRule: null,
            timeMatrix: [],
            techRoutesMatrix: []
        },
        calcData: {
            resultGantt: [],
            resultBriefcase: []
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
                alert("Сталася помилка при спробі порахувати результати(деталі в консолі).");
            });
    });

    function getInpData(){
        return {
            numGVM: selectNumGVM.value,
            numDetails: selectNumDetails.value,
            calcRule: selectCalcRule.value,
            timeMatrix: parseStrToMatrix(textareaTimeMatrix.value),
            techRoutesMatrix: parseStrToMatrix(textareaTechRoutes.value)
        };
    }

    function calcResults(inpData){
        console.log("called calcResults with data:", inpData);
        return new Promise(function(resolve, reject) {
            $.ajax({
                    url: "/calculate/",
                    type: "POST",
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(inpData)
                })
                .done(function (data, textStatus) {
                    console.log("server responded with data:", data);
                    if(!data || !(data.resultGantt instanceof Array) || !(data.resultBriefcase instanceof Array))
                        throw new Error("Некоректна відповідь сервера");
                    /* Приклад коректної відповіді
                    data = {
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
                    }; */

                    //перетворюємо масив задач для діаграми Ганта із 2-мірного масиву у одномірний
                    data.resultGantt = data.resultGantt.reduce( (resArr, curr) => {
                        resArr.push(...curr);
                        return resArr;
                    }, []);

                    resolve(data);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    console.log(`Произошла ошибка при обращении к серверу. ${errorThrown}`, arguments);
                    reject(arguments);
                })
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

        chartContainer.innerHTML = "";
        var chart = new GanttChart({
            w: 1000,
            barHeight: 20,
            OXStep: 30,
            chartContainer,
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

        renderBriefcaseTable(tableJobsBriefcase, results.resultBriefcase);
    }

    function renderBriefcaseTable(container, data) {
        /*"resultBriefcase": [
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
        ]*/


        let allStartsArr = [];      //масив назв по горизонталі
        for (let i = 0; i < data.length; i++)
            for (let el = data[i], j = 0; j < el.length; j++)
                allStartsArr.push(el[j].start);
        allStartsArr = checkUnique(allStartsArr).sort((a,b) => a-b);

        let firstRow = `<tr>  <th></th> <th> ${allStartsArr.join("</th><th>")} </tr> </tr>`;
        let nextRows = data.map((briefcaseRow, i) => {
            let str = `<tr> <th> ГВМ ${briefcaseRow[0].gvm} </th>`;
            str += allStartsArr.map((startRowName, colNum) => {
                let briefcaseEl = briefcaseRow.find(item => item.start === startRowName);
                if(briefcaseEl) {
                    let dets = briefcaseEl.details,
                        size = dets.length;
                    if(size < 2)
                        return `<td> <b>${dets}</b> </td>`;
                    else
                        return `<td> <small>${dets.slice(0, size-1).join(", ")},</small> <b>${dets[size-1]}</b> </td>`;
                }
                else
                    return `<td> </td>`;
            }).join("");
            str += `</tr>`;
            return str
        }).join("");
        container.innerHTML = firstRow + nextRows;
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
}());