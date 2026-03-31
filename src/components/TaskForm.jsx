function TaskForm({
  title,
  date,
  time,
  selectedReminders,
  difficulty,
  setTitle,
  setDate,
  setTime,
  toggleReminder,
  setDifficulty,
  addTask,
  reminderOptions,
}) {
  const today = new Date().toISOString().split("T")[0];

  const difficultyOptions = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  return (
    <form className="task-form" onSubmit={addTask}>
      <div className="field">
        <label htmlFor="task-title">Quest title</label>
        <input
          id="task-title"
          type="text"
          placeholder="Write a release checklist"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="task-date">Date</label>
          <input
            id="task-date"
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="task-time">Time</label>
          <input
            id="task-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field">
        <label>Reminders</label>
        <div className="reminder-checkboxes">
          {reminderOptions.map((option) => (
            <label key={option.value} className="reminder-checkbox-label">
              <input
                type="checkbox"
                checked={selectedReminders.includes(option.value)}
                onChange={() => toggleReminder(option.value)}
              />
              <span className="reminder-checkbox-custom" />
              <span className="reminder-checkbox-text">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Difficulty</label>
        <div className="difficulty-selector">
          {difficultyOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`difficulty-button difficulty-${option.value}${
                difficulty === option.value ? " is-selected" : ""
              }`}
              onClick={() => setDifficulty(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="primary-button">
        Add quest
      </button>
    </form>
  );
}

export default TaskForm;
