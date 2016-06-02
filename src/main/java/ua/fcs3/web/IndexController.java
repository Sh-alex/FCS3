package ua.fcs3.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import ua.fcs3.service.gantt.DataGantt;
import ua.fcs3.service.gantt.GanttBuilder;


@Controller
public class IndexController {

    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String goIndex() {

        return "index";
    }

    @RequestMapping(value = "/calculate", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public GanttBuilder sendResult(@RequestBody DataGantt dataGantt) {

        GanttBuilder ganttBuilder = new GanttBuilder(dataGantt.getNumGVM(), dataGantt.getNumDetails(),
                dataGantt.getTechRoutesMatrix(), dataGantt.getTimeMatrix());


        switch (dataGantt.getCalcRule()) {
            case "shortestOp":
                ganttBuilder.shortestOperation();
                break;
            case "maxResidualLabor":
                ganttBuilder.maxResidualLabor();
                break;
            case "minResidualLabor":
                ganttBuilder.minResidualLabor();
                break;
        }

        return ganttBuilder;
    }
}