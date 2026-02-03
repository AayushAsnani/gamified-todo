function TaskForm({
  title,
  date,
  time,
  reminderMinutes,
  setTitle,
  setDate,
  setTime,
  setReminderMinutes,
  addTask,
  reminderOptions,
}) {
  const today = new Date().toISOString().split("T")[0];

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
        <label htmlFor="task-reminder">Reminder</label>
        <select
          id="task-reminder"
          value={reminderMinutes}
          onChange={(e) => setReminderMinutes(e.target.value)}
        >
          {reminderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="primary-button">
        Add quest
      </button>
    </form>
  );
}

export default TaskForm;
