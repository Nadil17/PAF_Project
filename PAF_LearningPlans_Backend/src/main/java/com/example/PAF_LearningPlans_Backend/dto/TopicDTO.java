
package com.example.PAF_LearningPlans_Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopicDTO {
    private int topicId;
    private int planId;
    private String title;
    private String content;
    private String url;
}