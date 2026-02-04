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

  function deleteTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setActiveReminders((prev) =>
      prev.filter((reminder) => !reminder.id.startsWith(`${id}-`))
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
            deleteTask={deleteTask}
            xpPerComplete={XP_PER_COMPLETE}
            reminderLabel={reminderLabel}
          />
        </section>
      </main>

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
