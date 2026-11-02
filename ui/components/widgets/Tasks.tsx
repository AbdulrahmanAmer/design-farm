import { cx } from "../../lib/cx";
import { MetaItem } from "../primitives/Inputs";
import { ProgressBar } from "../primitives/Progress";
import "./Tasks.css";

export interface Task {
  id: string;
  title: string;
  date: string;
  duration: string;
  progress: number;
  attachments: number;
  due: string;
}

export interface TaskRowProps {
  task: Task;
  /** Lifts the row onto its own raised surface (selected / in focus). */
  highlighted?: boolean;
  onSelect?: (id: string) => void;
}

/** One line of the task table: title + date, duration, progress, attachments and due date. */
export function TaskRow({ task, highlighted, onSelect }: TaskRowProps) {
  return (
    <li
      className={cx("ds-taskrow", highlighted && "is-highlighted")}
      aria-current={highlighted || undefined}
      onClick={() => onSelect?.(task.id)}
    >
      <div className="ds-taskrow__title">
        {/* Click bubbles to the row handler; the button gives keyboard access. */}
        <button type="button" className="ds-taskrow__name">
          {task.title}
        </button>
        <span className="ds-taskrow__sub">{task.date}</span>
      </div>
      <div className="ds-taskrow__duration">
        <span className="ds-taskrow__sub">Duration</span>
        <span className="ds-taskrow__value">{task.duration}</span>
      </div>
      <ProgressBar value={task.progress} label={`${task.title} progress`} className="ds-taskrow__progress" />
      <div className="ds-taskrow__meta">
        <MetaItem icon="attachment">{task.attachments}</MetaItem>
        <span className="ds-taskrow__sep" aria-hidden />
        <MetaItem icon="calendar">{task.due}</MetaItem>
      </div>
    </li>
  );
}

export interface TaskListProps {
  tasks: Task[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function TaskList({ tasks, selectedId, onSelect, className }: TaskListProps) {
  return (
    <ul className={cx("ds-tasklist", className)}>
      {tasks.map((t) => (
        <TaskRow key={t.id} task={t} highlighted={t.id === selectedId} onSelect={onSelect} />
      ))}
    </ul>
  );
}
