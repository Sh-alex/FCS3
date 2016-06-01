package ua.fcs3.service.gantt;

import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class GanttBuilderTest {


    List<List<Integer>> techRoutes = new ArrayList<>(new ArrayList<>(Arrays.asList(new ArrayList<Integer>(Arrays.asList(2, 3, 1)), new ArrayList<Integer>(Arrays.asList(2, 1, 3)),
            new ArrayList<Integer>(Arrays.asList(3, 1, 2)), new ArrayList<Integer>(Arrays.asList(3, 2, 1)))));

    List<List<Double>> timeOperations = new ArrayList<>(new ArrayList<>(Arrays.asList(new ArrayList<Double>(Arrays.asList(2d, 3d, 2d)), new ArrayList<Double>(Arrays.asList(6d, 1d, 2d)),
            new ArrayList<Double>(Arrays.asList(6d, 2d, 4d)), new ArrayList<Double>(Arrays.asList(4d, 4d, 5d)))));


    @Test
    public void shortestOperation() throws Exception {


        GanttBuilder ganttBuilder = new GanttBuilder(3, 4, techRoutes, timeOperations);


        ganttBuilder.shortestOperation();

    }

    @Test
    public void maxResidualLabor() throws Exception {
        GanttBuilder ganttBuilder = new GanttBuilder(3, 4, techRoutes, timeOperations);

        ganttBuilder.maxResidualLabor();

    }

}