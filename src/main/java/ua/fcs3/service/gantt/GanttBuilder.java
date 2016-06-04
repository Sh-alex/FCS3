package ua.fcs3.service.gantt;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Component
public class GanttBuilder {

    private List<List<Integer>> techRoutes;
    private List<List<Double>> timeOperations;
    private List<List<GanttElement>> resultGantt;
    private List<List<GanttBriefcaseElement>> resultBriefcase;
    private Integer countGvm;
    private Integer countDetails;
    private List<Double> endOperGvm;
    private List<Double> endOper;

    public GanttBuilder() {
    }

    public GanttBuilder(Integer countGvm, Integer countDetails, List<List<Integer>> techRoutes, List<List<Double>> timeOperations) {
        this.countGvm = countGvm;
        this.countDetails = countDetails;
        this.techRoutes = techRoutes;
        this.timeOperations = timeOperations;


        endOperGvm = new ArrayList<>(Collections.nCopies(countGvm, 0.0));
        endOper = new ArrayList<>(Collections.nCopies(countDetails, 0.0));

        resultGantt = new ArrayList<>();
        resultBriefcase = new ArrayList<>();
        for (int i = 0; i < countGvm; i++) {
            resultGantt.add(new ArrayList<>());
            resultBriefcase.add(new ArrayList<>());
        }
    }

    public List<List<GanttBriefcaseElement>> getResultBriefcase() {
        return resultBriefcase;
    }

    public void setResultBriefcase(List<List<GanttBriefcaseElement>> resultBriefcase) {
        this.resultBriefcase = resultBriefcase;
    }

    public List<List<GanttElement>> getResultGantt() {
        return resultGantt;
    }

    public void setResultGantt(List<List<GanttElement>> resultGantt) {
        this.resultGantt = resultGantt;
    }



    private List<List<Integer>> searchCandidatesOnGvm() {

        List<List<Integer>> candidatesOnGvm = new ArrayList<>();
        Set<Integer> usedGvm = new HashSet<>();

        for (int i = 0; i < techRoutes.size(); i++) {
            if (techRoutes.get(i).isEmpty())
                continue;

            Integer currentGvm = techRoutes.get(i).get(0);
            if (!usedGvm.contains(currentGvm)) {

                usedGvm.add(currentGvm);
                candidatesOnGvm.add(new ArrayList<>());
                candidatesOnGvm.get(candidatesOnGvm.size() - 1).add(i);
            } else {
                continue;
            }

            for (int j = 0; j < techRoutes.size(); j++) {
                if (i == j) {
                    continue;
                }

                if (!techRoutes.get(j).isEmpty() && techRoutes.get(j).get(0) == currentGvm) {
                    candidatesOnGvm.get(candidatesOnGvm.size() - 1).add(j);
                }


            }
        }
        return candidatesOnGvm;
    }

    public void shortestOperation() {

        boolean techRoutesIsEmpty = false;

        while (!techRoutesIsEmpty) {
            List<List<Integer>> candidatesOnGvm = searchCandidatesOnGvm();

            for (int i = 0; i < candidatesOnGvm.size(); i++) {
                for (int j = candidatesOnGvm.get(i).size() - 1; j >= 0; j--) {
                    for (int k = 0; k < j; k++) {
                        if (timeOperations.get(candidatesOnGvm.get(i).get(k)).get(0) >
                                timeOperations.get(candidatesOnGvm.get(i).get(k + 1)).get(0)) {
                            int temp = candidatesOnGvm.get(i).get(k);
                            candidatesOnGvm.get(i).set(k, candidatesOnGvm.get(i).get(k + 1));
                            candidatesOnGvm.get(i).set(k + 1, temp);
                        }
                    }
                }
            }


            saveElement(candidatesOnGvm);

            for (List<Integer> list : techRoutes) {
                if (list.isEmpty()) {
                    techRoutesIsEmpty = true;
                } else {
                    techRoutesIsEmpty = false;
                    break;
                }
            }


        }


    }

    public void maxResidualLabor() {
        boolean techRoutesIsEmpty = false;

        while (!techRoutesIsEmpty) {
            List<List<Integer>> candidatesOnGvm = searchCandidatesOnGvm();

            for (int i = 0; i < candidatesOnGvm.size(); i++) {
                for (int j = candidatesOnGvm.get(i).size() - 1; j >= 0; j--) {
                    for (int k = 0; k < j; k++) {
                        if (timeOperations.get(candidatesOnGvm.get(i).get(k)).stream().mapToDouble(Double::doubleValue).sum() <
                                timeOperations.get(candidatesOnGvm.get(i).get(k + 1)).stream().mapToDouble(Double::doubleValue).sum()) {
                            int temp = candidatesOnGvm.get(i).get(k);
                            candidatesOnGvm.get(i).set(k, candidatesOnGvm.get(i).get(k + 1));
                            candidatesOnGvm.get(i).set(k + 1, temp);
                        }
                    }
                }
            }


            saveElement(candidatesOnGvm);

            for (List<Integer> list : techRoutes) {
                if (list.isEmpty()) {
                    techRoutesIsEmpty = true;
                } else {
                    techRoutesIsEmpty = false;
                    break;
                }
            }


        }
    }

    public void minResidualLabor() {
        boolean techRoutesIsEmpty = false;

        while (!techRoutesIsEmpty) {
            List<List<Integer>> candidatesOnGvm = searchCandidatesOnGvm();

            for (int i = 0; i < candidatesOnGvm.size(); i++) {
                for (int j = candidatesOnGvm.get(i).size() - 1; j >= 0; j--) {
                    for (int k = 0; k < j; k++) {
                        if (timeOperations.get(candidatesOnGvm.get(i).get(k)).stream().mapToDouble(Double::doubleValue).sum() >
                                timeOperations.get(candidatesOnGvm.get(i).get(k + 1)).stream().mapToDouble(Double::doubleValue).sum()) {
                            int temp = candidatesOnGvm.get(i).get(k);
                            candidatesOnGvm.get(i).set(k, candidatesOnGvm.get(i).get(k + 1));
                            candidatesOnGvm.get(i).set(k + 1, temp);
                        }
                    }
                }
            }


            saveElement(candidatesOnGvm);

            for (List<Integer> list : techRoutes) {
                if (list.isEmpty()) {
                    techRoutesIsEmpty = true;
                } else {
                    techRoutesIsEmpty = false;
                    break;
                }
            }


        }
    }

    private void saveElement(List<List<Integer>> candidatesOnGvm) {


        for (int i = 0; i < candidatesOnGvm.size(); i++) {

            Integer gvm = techRoutes.get(candidatesOnGvm.get(i).get(0)).get(0);

            Integer detail = candidatesOnGvm.get(i).get(0);

            Double start = endOperGvm.get(gvm - 1) > endOper.get(detail) ? endOperGvm.get(gvm - 1) : endOper.get(detail);
            start = new BigDecimal(start).setScale(2, RoundingMode.UP).doubleValue();

            Double end = start + timeOperations.get(detail).get(0);
            end = new BigDecimal(end).setScale(2, RoundingMode.UP).doubleValue();

            candidatesOnGvm.get(i).replaceAll(e->e+1);
            Collections.reverse(candidatesOnGvm.get(i));
            resultBriefcase.get(gvm-1).add(new GanttBriefcaseElement(gvm, candidatesOnGvm.get(i), start));

            //candidatesOnGvm.get(i).subList(1, candidatesOnGvm.get(i).size()).clear();

            resultGantt.get(gvm - 1).add(new GanttElement(gvm, detail + 1, start, end));

            endOperGvm.set(gvm - 1, end);
            endOper.set(detail, end);

            techRoutes.get(detail).remove(0);
            timeOperations.get(detail).remove(0);
        }
    }
}
