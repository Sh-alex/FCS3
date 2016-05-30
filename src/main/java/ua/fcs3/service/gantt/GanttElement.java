package ua.fcs3.service.gantt;

public class GanttElement {

    private Integer gvm;
    private Integer detail;
    private Double start;
    private Double end;

    public GanttElement(Integer gvm, Integer detail, Double start, Double end) {
        this.gvm = gvm;
        this.detail = detail;
        this.start = start;
        this.end = end;
    }

    public Integer getGvm() {
        return gvm;
    }

    public void setGvm(Integer gvm) {
        this.gvm = gvm;
    }

    public Integer getDetail() {
        return detail;
    }

    public void setDetail(Integer detail) {
        this.detail = detail;
    }

    public Double getStart() {
        return start;
    }

    public void setStart(Double start) {
        this.start = start;
    }

    public Double getEnd() {
        return end;
    }

    public void setEnd(Double end) {
        this.end = end;
    }
}
