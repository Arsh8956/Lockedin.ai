package com.pomodoro.model;

import java.time.LocalDateTime;

public class Task {
    private Long id;
    private String text;
    private boolean completed;
    private LocalDateTime timestamp;

    public Task() {
    }

    public Task(Long id, String text, boolean completed, LocalDateTime timestamp) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
} 