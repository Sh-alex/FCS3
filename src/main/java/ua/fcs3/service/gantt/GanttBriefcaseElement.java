package ua.fcs3.service.gantt;

import java.util.List;

public class GanttBriefcaseElement {

    private Integer gvm;
    private List<Integer> details;
    private Double start;

    public GanttBriefcaseElement(Integer gvm, List<Integer> details, Double start) {
        this.gvm = gvm;
        this.details = details;
        this.start = start;
    }

    public Integer getGvm() {
        return gvm;
    }

    public void setGvm(Integer gvm) {
        this.gvm = gvm;
    }

    public List<Integer> getDetails() {
        return details;
    }

    public void setDetails(List<Integer> details) {
        this.details = details;
    }

    public Double getStart() {
        return start;
    }

    public void setStart(Double start) {
        this.start = start;
    }
}
