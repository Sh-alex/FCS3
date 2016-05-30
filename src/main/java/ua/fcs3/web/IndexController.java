package ua.fcs3.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import ua.fcs3.service.gantt.GanttBuilder;
import ua.fcs3.service.gantt.GanttElement;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@Controller
public class IndexController {

    @RequestMapping(value = "/index.html", method = RequestMethod.GET)
    public String goIndex() {

        return "index";
    }

    @RequestMapping(value = "/solve", method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public List<List<GanttElement>> sendResult() {

        List<List<Integer>> techRoutes = new ArrayList<>(new ArrayList<>(Arrays.asList(new ArrayList<>(Arrays.asList(2, 3, 1)), new ArrayList<>(Arrays.asList(2, 1, 3)),
                new ArrayList<>(Arrays.asList(3, 1, 2)), new ArrayList<>(Arrays.asList(3, 2, 1)))));

        List<List<Double>> timeOperations = new ArrayList<>(new ArrayList<>(Arrays.asList(new ArrayList<>(Arrays.asList(2d, 3d, 2d)), new ArrayList<>(Arrays.asList(6d, 1d, 2d)),
                new ArrayList<>(Arrays.asList(6d, 2d, 4d)), new ArrayList<>(Arrays.asList(4d, 4d, 5d)))));

        GanttBuilder ganttBuilder = new GanttBuilder(3, 4, techRoutes, timeOperations);


        ganttBuilder.shortestOperation();

        return ganttBuilder.getResultGantt();
    }
}