import TaskMenu from "./TaskMenu";

const buildDateTime = (date, time) => {
  if (!date || !time) return null;
  const parsed = new Date(`${date}T${time}`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const formatDateTime = (date, time) => {
  const parsed = buildDateTime(date, time);
  if (!parsed) return `${date} ${time}`;
  const dateLabel = parsed.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeLabel = parsed.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${dateLabel} · ${timeLabel}`;
};

function TaskList({ tasks, toggleTask, onReschedule, onDelete, xpPerComplete, reminderLabel }) {
  const now = Date.now();

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No quests yet. Add one above to earn XP.</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task, index) => {
        const dueAt = buildDateTime(task.date, task.time);
        const timeLeft = dueAt ? dueAt.getTime() - now : null;
        const isOverdue =
          !task.completed && timeLeft != null && timeLeft < 0;
        const isSoon =
          !task.completed &&
          timeLeft != null &&
          timeLeft > 0 &&
          timeLeft <= 60 * 60 * 1000;

        return (
          <li
            key={task.id}
            className={`task-card${task.completed ? " is-complete" : ""}${isOverdue ? " is-overdue" : ""
              }`}
            style={{ "--delay": `${index * 70}ms` }}
          >
            <button
              type="button"
              className={`check-button${task.completed ? " is-active" : ""}`}
              onClick={() => toggleTask(task.id)}
              aria-pressed={task.completed}
              aria-label={
                task.completed
                  ? `Mark ${task.title} as incomplete`
                  : `Mark ${task.title} as complete`
              }
            >
              <span aria-hidden="true">{task.completed ? "✓" : ""}</span>
            </button>

            <div className="task-main">
              <p className="task-title">{task.title}</p>
              <div className="task-meta">
                <span className="chip">{formatDateTime(task.date, task.time)}</span>
                {task.reminderMinutes != null ? (
                  <span className="chip chip-accent">
                    {reminderLabel(task.reminderMinutes)}
                  </span>
                ) : null}
                {isSoon ? <span className="chip chip-warn">Due soon</span> : null}
                {isOverdue ? (
                  <span className="chip chip-danger">Overdue</span>
                ) : null}
              </div>
            </div>

            <div className="task-reward">
              {task.completed ? "Completed" : `+${xpPerComplete} XP`}
            </div>

            <TaskMenu
              taskId={task.id}
              onReschedule={onReschedule}
              onDelete={onDelete}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default TaskList;
