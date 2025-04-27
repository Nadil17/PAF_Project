package com.example.PAF_LearningPlans_Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanDTO {
    private int planId;
    private int userId;
    private String title;
    private String description;
}
