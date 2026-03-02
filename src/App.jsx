import { useEffect, useMemo, useRef, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

const XP_PER_CREATE = 5;
const XP_PER_COMPLETE = 10;

const REMINDER_OPTIONS = [
  { label: "No reminder", value: "none" },
  { label: "At start time", value: "0" },
  { label: "5 min before", value: "5" },
  { label: "15 min before", value: "15" },
  { label: "30 min before", value: "30" },
  { label: "1 hour before", value: "60" },
];

const reminderLabel = (minutes) => {
  if (minutes == null) return "No reminder";
  if (minutes === 0) return "At start time";
  if (minutes === 60) return "1 hour before";
  return `${minutes} min before`;
};

const buildDateTime = (date, time) => {
  if (!date || !time) return null;
  const parsed = new Date(`${date}T${time}`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const normalizeReminder = (value) => {
  if (value === "none") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

function App() {
  // ---------------- STATE ----------------
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState("none");
  const [tasks, setTasks] = useState([]);

  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);
  const [activeReminders, setActiveReminders] = useState([]);

  // Reschedule modal state
  const [rescheduleTaskId, setRescheduleTaskId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  const reminderTimers = useRef(new Map());

  const notificationsSupported =
    typeof window !== "undefined" && "Notification" in window;
  const [notificationStatus, setNotificationStatus] = useState(
    notificationsSupported ? Notification.permission : "unsupported"
  );

  // 🔑 IMPORTANT FLAG
  const [isLoaded, setIsLoaded] = useState(false);

  // ---------------- LOAD FROM STORAGE (ONCE) ----------------
  useEffect(() => {
    try {
      const savedTasks = JSON.parse(localStorage.getItem("tasks"));
      const savedXp = JSON.parse(localStorage.getItem("xp"));
      const savedStreak = JSON.parse(localStorage.getItem("streak"));
      const savedLastDate = localStorage.getItem("lastCompletedDate");

      if (Array.isArray(savedTasks)) setTasks(savedTasks);
      if (typeof savedXp === "number") setXp(savedXp);
      if (typeof savedStreak === "number") setStreak(savedStreak);
      if (savedLastDate) setLastCompletedDate(savedLastDate);
    } catch (e) {
      console.error("Failed to load localStorage");
    } finally {
      // ✅ MARK LOADING COMPLETE
      setIsLoaded(true);
    }
  }, []);

  // ---------------- SAVE TASKS (ONLY AFTER LOAD) ----------------
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  // ---------------- SAVE XP + STREAK ----------------
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("xp", JSON.stringify(xp));
    localStorage.setItem("streak", JSON.stringify(streak));
    if (lastCompletedDate) {
      localStorage.setItem("lastCompletedDate", lastCompletedDate);
    }
  }, [xp, streak, lastCompletedDate, isLoaded]);

  // ---------------- REMINDERS ----------------
  useEffect(() => {
    if (!isLoaded) return;

    reminderTimers.current.forEach((timeoutId) => clearTimeout(timeoutId));
    reminderTimers.current.clear();

    tasks.forEach((task) => {
      if (task.completed) return;
      if (task.reminderMinutes == null) return;

      const dueAt = buildDateTime(task.date, task.time);
      if (!dueAt) return;

      const reminderAt =
        dueAt.getTime() - task.reminderMinutes * 60 * 1000;
      const delay = reminderAt - Date.now();

      if (delay <= 0) return;

      const timeoutId = setTimeout(() => {
        setActiveReminders((prev) => [
          {
            id: `${task.id}-${Date.now()}`,
            taskId: task.id,
            title: task.title,
            date: task.date,
            time: task.time,
            reminderMinutes: task.reminderMinutes,
          },
          ...prev,
        ]);

        if (notificationsSupported && Notification.permission === "granted") {
          new Notification("Quest Reminder", {
            body: `${task.title} • ${task.date} ${task.time}`,
          });
        }
      }, delay);

      reminderTimers.current.set(task.id, timeoutId);
    });

    return () => {
      reminderTimers.current.forEach((timeoutId) => clearTimeout(timeoutId));
      reminderTimers.current.clear();
    };
  }, [tasks, isLoaded, notificationsSupported]);

  const requestNotificationPermission = async () => {
    if (!notificationsSupported) return;
    if (Notification.permission === "granted") {
      setNotificationStatus("granted");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);
    } catch (error) {
      console.error("Notification permission request failed", error);
    }
  };

  // ---------------- ADD TASK ----------------
  function addTask(event) {
    event?.preventDefault();

    if (!title || !date || !time) return;

    const reminderValue = normalizeReminder(reminderMinutes);

    const newTask = {
      id: Date.now(),
      title,
      date,
      time,
      reminderMinutes: reminderValue,
      completed: false,
    };

    if (reminderValue != null) {
      requestNotificationPermission();
    }

    setTasks((prev) => [...prev, newTask]);
    setXp((prev) => prev + XP_PER_CREATE);
    setTitle("");
    setDate("");
    setTime("");
    setReminderMinutes("none");
  }

  // ---------------- DELETE TASK ----------------
  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    // Clear any active reminder for this task
    if (reminderTimers.current.has(id)) {
      clearTimeout(reminderTimers.current.get(id));
      reminderTimers.current.delete(id);
    }
    setActiveReminders((prev) => prev.filter((r) => r.taskId !== id));
  }

  // ---------------- RESCHEDULE TASK ----------------
  function openRescheduleModal(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setRescheduleTaskId(id);
    setRescheduleDate(task.date);
    setRescheduleTime(task.time);
  }

  function closeRescheduleModal() {
    setRescheduleTaskId(null);
    setRescheduleDate("");
    setRescheduleTime("");
  }

  function saveReschedule(event) {
    event?.preventDefault();
    if (!rescheduleTaskId || !rescheduleDate || !rescheduleTime) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === rescheduleTaskId
          ? { ...t, date: rescheduleDate, time: rescheduleTime }
          : t
      )
    );
    closeRescheduleModal();
  }

  // ---------------- TOGGLE TASK (XP + STREAK) ----------------
  function toggleTask(id) {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    if (!task.completed) {
      setXp((prev) => prev + XP_PER_COMPLETE);

      if (lastCompletedDate === today) {
        // already counted today
      } else if (lastCompletedDate === yesterday) {
        setStreak((prev) => prev + 1);
      } else {
        setStreak(1);
      }

      setLastCompletedDate(today);
    } else {
      setXp((prev) => Math.max(0, prev - XP_PER_COMPLETE));
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }

  const level = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100;
  const completedCount = tasks.filter((task) => task.completed).length;
  const notificationCopy = {
    granted: "enabled",
    denied: "blocked",
    default: "not yet enabled",
  }[notificationStatus];

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const aTime = buildDateTime(a.date, a.time)?.getTime() ?? 0;
      const bTime = buildDateTime(b.date, b.time)?.getTime() ?? 0;
      return aTime - bTime;
    });
  }, [tasks]);

  // ---------------- UI ----------------
  return (
    <div className="app">
      <main className="shell">
        <header className="hero">
          <div className="hero-title">
            <p className="hero-kicker">Quest Board</p>
            <h1>Plan quests. Bank XP. Keep streaks alive.</h1>
            <p className="hero-subtitle">
              Schedule missions, set reminders, and level up every time you
              create or finish a task.
            </p>
          </div>
          <div className="hero-card">
            <div className="hero-card-stats">
              <div>
                <p className="hero-label">Level</p>
                <p className="hero-value">{level}</p>
              </div>
              <div>
                <p className="hero-label">XP</p>
                <p className="hero-value">{xp}</p>
              </div>
              <div>
                <p className="hero-label">Streak</p>
                <p className="hero-value">{streak} days</p>
              </div>
            </div>
            <div className="hero-avatar">
              <svg viewBox="0 0 120 190" fill="none" xmlns="http://www.w3.org/2000/svg" className="avatar-svg">
                {/* ===== HAT (bucket hat, appears at level 3+) ===== */}
                {level >= 3 && (
                  <g className="avatar-crown">
                    {/* Hat brim */}
                    <ellipse cx="60" cy="40" rx="32" ry="6" fill="#6c5ce7" />
                    {/* Hat dome */}
                    <path d="M38 40 Q38 18 60 16 Q82 18 82 40 Z" fill="#a29bfe" />
                    {/* Hat band */}
                    <rect x="38" y="36" width="44" height="5" rx="2" fill="#fd79a8" />
                    {/* Hat badge */}
                    <circle cx="60" cy="26" r="4" fill="rgba(255,205,130,0.95)" />
                    <text x="60" y="29" textAnchor="middle" fill="#6c5ce7" fontSize="6" fontWeight="700">★</text>
                  </g>
                )}

                {/* ===== HEAD ===== */}
                <circle cx="60" cy="58" r="24" fill="rgba(255,255,255,0.95)" />
                {/* Eyes */}
                <ellipse cx="50" cy="54" rx="3.5" ry="4" fill="#2f2a3b" />
                <ellipse cx="70" cy="54" rx="3.5" ry="4" fill="#2f2a3b" />
                {/* Eye sparkles */}
                <circle cx="51.5" cy="52" r="1.5" fill="rgba(255,255,255,0.9)" />
                <circle cx="71.5" cy="52" r="1.5" fill="rgba(255,255,255,0.9)" />
                {/* Blush */}
                <ellipse cx="42" cy="62" rx="5" ry="3" fill="rgba(255,140,148,0.5)" />
                <ellipse cx="78" cy="62" rx="5" ry="3" fill="rgba(255,140,148,0.5)" />
                {/* Mouth - happy if streak > 0 */}
                {streak > 0 ? (
                  <path d="M52 66 Q60 74 68 66" stroke="#2f2a3b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                ) : (
                  <line x1="53" y1="68" x2="67" y2="68" stroke="#2f2a3b" strokeWidth="2.5" strokeLinecap="round" />
                )}

                {/* ===== T-SHIRT ===== */}
                {/* Shirt body */}
                <rect x="42" y="82" rx="12" ry="12" width="36" height="42" fill="#6c5ce7" />
                {/* Collar / neckline */}
                <path d="M50 82 Q60 90 70 82" stroke="#a29bfe" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* Shirt bottom hem */}
                <rect x="42" y="120" width="36" height="4" rx="2" fill="#5b4fcf" />
                {/* Left sleeve */}
                <g className="avatar-left-arm">
                  <rect x="22" y="84" rx="8" ry="8" width="24" height="18" fill="#6c5ce7" />
                  {/* Sleeve cuff */}
                  <rect x="22" y="96" width="24" height="4" rx="2" fill="#5b4fcf" />
                  {/* Exposed hand */}
                  <ellipse cx="30" cy="104" rx="6" ry="5" fill="rgba(255,255,255,0.9)" />
                </g>
                {/* Right sleeve */}
                <g className="avatar-right-arm">
                  <rect x="74" y="84" rx="8" ry="8" width="24" height="18" fill="#6c5ce7" />
                  {/* Sleeve cuff */}
                  <rect x="74" y="96" width="24" height="4" rx="2" fill="#5b4fcf" />
                  {/* Exposed hand */}
                  <ellipse cx="90" cy="104" rx="6" ry="5" fill="rgba(255,255,255,0.9)" />
                </g>
                {/* Level badge on t-shirt */}
                <circle cx="60" cy="102" r="8" fill="rgba(255,140,148,0.9)" />
                <text x="60" y="106" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">{level}</text>

                {/* ===== PANTS ===== */}
                {/* Waistband */}
                <rect x="43" y="122" width="34" height="5" rx="2" fill="#2d3436" />
                {/* Belt buckle */}
                <rect x="56" y="122" width="8" height="5" rx="1" fill="#ffeaa7" />
                {/* Left leg */}
                <rect x="44" y="126" rx="6" ry="4" width="14" height="30" fill="#636e72" />
                {/* Right leg */}
                <rect x="62" y="126" rx="6" ry="4" width="14" height="30" fill="#636e72" />
                {/* Pant seams */}
                <line x1="51" y1="128" x2="51" y2="155" stroke="#576060" strokeWidth="1" opacity="0.5" />
                <line x1="69" y1="128" x2="69" y2="155" stroke="#576060" strokeWidth="1" opacity="0.5" />

                {/* ===== BOOTS ===== */}
                {/* Left boot */}
                <rect x="41" y="153" rx="4" ry="4" width="18" height="14" fill="#2d3436" />
                <rect x="38" y="162" rx="3" ry="3" width="22" height="8" fill="#2d3436" />
                {/* Left boot sole */}
                <rect x="38" y="168" rx="2" ry="2" width="22" height="3" fill="#1a1a2e" />
                {/* Left boot strap */}
                <rect x="42" y="156" width="16" height="2" rx="1" fill="#ffeaa7" />
                {/* Right boot */}
                <rect x="61" y="153" rx="4" ry="4" width="18" height="14" fill="#2d3436" />
                <rect x="60" y="162" rx="3" ry="3" width="22" height="8" fill="#2d3436" />
                {/* Right boot sole */}
                <rect x="60" y="168" rx="2" ry="2" width="22" height="3" fill="#1a1a2e" />
                {/* Right boot strap */}
                <rect x="62" y="156" width="16" height="2" rx="1" fill="#ffeaa7" />

                {/* ===== SPARKLE PARTICLES (high XP) ===== */}
                {xp > 100 && (
                  <g className="avatar-sparkles">
                    <text x="18" y="50" fontSize="12" fill="rgba(255,205,130,1)">✦</text>
                    <text x="96" y="44" fontSize="10" fill="rgba(174,252,206,1)">✦</text>
                    <text x="8" y="76" fontSize="8" fill="rgba(255,140,148,0.9)">✦</text>
                    <text x="104" y="72" fontSize="14" fill="rgba(255,205,130,0.9)">✦</text>
                  </g>
                )}
              </svg>
            </div>
          </div>
        </header>

        <section className="stats">
          <div className="stat-card">
            <p className="stat-title">Progress to next level</p>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <p className="stat-meta">{100 - levelProgress} XP to level up</p>
          </div>
          <div className="stat-card">
            <p className="stat-title">Quests completed</p>
            <p className="stat-value">
              {completedCount} / {tasks.length}
            </p>
            <p className="stat-meta">
              +{XP_PER_CREATE} XP on create · +{XP_PER_COMPLETE} XP on complete
            </p>
          </div>
        </section>

        <section className="actions">
          <div className="action-card">
            <h2>Schedule a quest</h2>
            <TaskForm
              title={title}
              date={date}
              time={time}
              reminderMinutes={reminderMinutes}
              setTitle={setTitle}
              setDate={setDate}
              setTime={setTime}
              setReminderMinutes={setReminderMinutes}
              addTask={addTask}
              reminderOptions={REMINDER_OPTIONS}
            />
          </div>
          <div className="action-card tips">
            <h3>Reminder status</h3>
            {notificationsSupported ? (
              <p>
                Desktop reminders are {notificationCopy ?? notificationStatus}.
                You can still rely on in-app popups.
              </p>
            ) : (
              <p>Desktop notifications are not supported in this browser.</p>
            )}
            {notificationsSupported && notificationStatus !== "granted" ? (
              <button
                type="button"
                className="ghost-button"
                onClick={requestNotificationPermission}
              >
                Enable desktop reminders
              </button>
            ) : null}
            <div className="tips-list">
              <p>Set reminders for your most important quests.</p>
              <p>Keep a streak going by completing at least one quest per day.</p>
            </div>
          </div>
        </section>

        <section className="quest-board">
          <div className="section-heading">
            <h2>Upcoming quests</h2>
            <p>{tasks.length === 0 ? "Start by adding a quest." : ""}</p>
          </div>
          <TaskList
            tasks={sortedTasks}
            toggleTask={toggleTask}
            onReschedule={openRescheduleModal}
            onDelete={deleteTask}
            xpPerComplete={XP_PER_COMPLETE}
            reminderLabel={reminderLabel}
          />
        </section>
      </main>

      {rescheduleTaskId && (
        <div className="reschedule-overlay" onClick={closeRescheduleModal}>
          <div
            className="reschedule-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Reschedule Quest</h3>
            <form onSubmit={saveReschedule}>
              <div className="field">
                <label htmlFor="reschedule-date">New Date</label>
                <input
                  id="reschedule-date"
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="reschedule-time">New Time</label>
                <input
                  id="reschedule-time"
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={closeRescheduleModal}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeReminders.length > 0 ? (
        <div className="reminder-stack" aria-live="polite">
          {activeReminders.map((reminder) => (
            <div key={reminder.id} className="reminder-toast">
              <div>
                <p className="reminder-title">Reminder: {reminder.title}</p>
                <p className="reminder-meta">
                  {reminder.date} · {reminder.time} ·{" "}
                  {reminderLabel(reminder.reminderMinutes)}
                </p>
              </div>
              <button
                type="button"
                className="ghost-button"
                onClick={() =>
                  setActiveReminders((prev) =>
                    prev.filter((item) => item.id !== reminder.id)
                  )
                }
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default App;
