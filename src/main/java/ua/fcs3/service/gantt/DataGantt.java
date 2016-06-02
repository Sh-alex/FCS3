package ua.fcs3.service.gantt;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class DataGantt {

    private Integer numGVM;
    private Integer numDetails;
    private String calcRule;

    private List<List<Integer>> techRoutesMatrix;
    private List<List<Double>> timeMatrix;

    public Integer getNumGVM() {
        return numGVM;
    }
    @JsonProperty("numGVM")
    public void setNumGVM(Integer numGVM) {
        this.numGVM = numGVM;
    }

    public Integer getNumDetails() {
        return numDetails;
    }
    @JsonProperty("numDetails")
    public void setNumDetails(Integer numDetails) {
        this.numDetails = numDetails;
    }

    public String getCalcRule() {
        return calcRule;
    }
    @JsonProperty("calcRule")
    public void setCalcRule(String calcRule) {
        this.calcRule = calcRule;
    }

    public List<List<Integer>> getTechRoutesMatrix() {
        return techRoutesMatrix;
    }
    @JsonProperty("techRoutesMatrix")
    public void setTechRoutesMatrix(List<List<Integer>> techRoutesMatrix) {
        this.techRoutesMatrix = techRoutesMatrix;
    }

    public List<List<Double>> getTimeMatrix() {
        return timeMatrix;
    }
    @JsonProperty("timeMatrix")
    public void setTimeMatrix(List<List<Double>> timeMatrix) {
        this.timeMatrix = timeMatrix;
    }
}
