<!DOCTYPE html>
<html>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<head lang="uk">
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title> Курсова робота з ГКС5 </title>
    <meta name="description" content="Лабораторна робота з ГКС4 №1">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href='../../resources/styles/bootstrap.min.css' rel='stylesheet' type='text/css'>
    <link href='../../resources/styles/main.css' rel='stylesheet' type='text/css'>
    <link href='../../resources/styles/gantt_chart.css' rel='stylesheet' type='text/css'>
</head>
<body>
<div id="mount-point" class="wrapper">
    <header class="navbar navbar-default navbar-static-top">
        <div class="container-fluid">
            <h1 class="text-center header__heading"> Курсова робота з ГКС5 </h1>
        </div>
    </header>

    <main class="container-fluid main-block">
        <div class="input-column">
            <div class="input-block">
                <form id="initial-data-form">
                    <div class="inp-num-of-vars">
                        <div class="form-group">
                            <label for="select-num-gvm" class="control-label inp-num-of-vars__label">
                                <strong>Кількість ГВМ:</strong>
                            </label>
                            <select id="select-num-gvm" name="numGVM" class="form-control inp-num-of-vars__select">
                                <option value="2">2</option>
                                <option value="3" selected>3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="14">15</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="select-num-details" class="control-label inp-num-of-vars__label">
                                <strong>Кількість деталей:</strong>
                            </label>
                            <select id="select-num-details" name="numDetails" class="form-control inp-num-of-vars__select">
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4" selected>4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="14">15</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="select-calc-rule" class="control-label inp-num-of-vars__label">
                                <strong>Правила:</strong>
                            </label>
                            <select id="select-calc-rule" name="calcRule" class="form-control inp-num-of-vars__select">
                                <option value="shortestOp" selected>Найкоротшої операції</option>
                                <option value="maxResidualLabor">Максимальної залишкової трудомісткості</option>
                                <option value="minResidualLabor">Мінімальної залишкової трудомісткості</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group inp-matrix" title="введіть цілі числа розділяючи їх проблілами, а нові рядки - символом перенесення">
                        <div>
                            <label for="textarea-tech-routes" class="control-label">
                                <strong> Матриця технологічних маршрутів: </strong>
                            </label>
                        </div>
                        <textarea name="timeMatrix" id="textarea-tech-routes" cols="50" rows="14">
                            2 3 1
                            2 1 3
                            3 1 2
                            3 2 1
                        </textarea>
                    </div>
                    <div class="form-group inp-matrix" title="введіть дійсні числа розділяючи їх проблілами, а нові рядки - символом перенесення">
                        <div>
                            <label for="textarea-time-matrix" class="control-label">
                                <strong> Матриця тривалостей обробки: </strong>
                            </label>
                        </div>
                        <textarea name="timeMatrix" id="textarea-time-matrix" cols="50" rows="14" >
                            2 3 2
                            6 1 2
                            6 2 4
                            4 4 5
                        </textarea>
                    </div>
                    <div class="form-group text-center">
                        <button type="submit" class="btn btn-primary">Порахувати</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="results-column hidden" id="results-column">
            <div class="results-block">
                <div class="gantt-chart-wrapper">
                    <p><strong> Діаграма послідовності обробки деталей: </strong></p>
                    <div class="gantt-chart-container"></div>
                </div>
                <div class="res-matrix">
                    <p><strong> Портфель робіт: </strong></p>
                    <div class="res-matrix__table-wrapper table-responsive">
                        <table id="table-jobs-portfeil" class="table table-striped table-bordered res-matrix__table">
                            <tbody>
                            <tr class="res-matrix__row">
                                <th> </th>
                                <th> </th>
                            </tr>
                            <tr>
                                <th>  </th>
                                <td>
                                    <span class="matrix-result-cell">  </span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="navbar navbar-default">
            <p class="text-center footer__navbar-text">
                <a href="https://vk.com/max_genash" class="navbar-link">Генаш Максим</a>,
                <a href="https://vk.com/id52117585" class="navbar-link">Шевченко Олександр</a>
                &copy; 2016
            </p>
        </div>
    </footer>
</div>

<script type="text/javascript" src="../../resources/scripts/jquery-2.2.4.min.js"></script>
<script type="text/javascript" src="../../resources/scripts/d3.v3.min.js"></script>
<script type="text/javascript" src="../../resources/scripts/gantt_chart.js"></script>
<script type="text/javascript" src="../../resources/scripts/main.js"></script>
</body>
</html>
