import { cx } from "../../lib/cx";
import { Avatar } from "../primitives/Avatar";
import { Badge, type BadgeTone } from "../primitives/Badge";
import { IconButton } from "../primitives/Button";
import "./Assignment.css";

export type Priority = "high" | "medium" | "low";

const priorityTone: Record<Priority, BadgeTone> = { high: "danger", medium: "accent", low: "success" };
const priorityLabel: Record<Priority, string> = { high: "High", medium: "Medium", low: "Low" };

export interface AssignmentCardProps {
  /** Category trail; the first is highlighted as the discipline. */
  categories: string[];
  title: string;
  priority: Priority;
  tag: string;
  assignee: { name: string; src?: string };
  onMore?: () => void;
  className?: string;
}

/** A single assignment tile: categories, title, priority, tag and assignee. */
export function AssignmentCard({ categories, title, priority, tag, assignee, onMore, className }: AssignmentCardProps) {
  const [discipline, ...rest] = categories;
  return (
    <article className={cx("ds-assignment", className)}>
      <header className="ds-assignment__head">
        <div className="ds-assignment__cats">
          <Badge tone="accent" variant="soft" size="sm">
            {discipline}
          </Badge>
          {rest.map((c) => (
            <span key={c} className="ds-assignment__cat">
              {c}
            </span>
          ))}
        </div>
        <IconButton icon="more" label="Assignment options" size="sm" onClick={onMore} />
      </header>
      <div className="ds-assignment__main">
        <h3 className="ds-assignment__title">{title}</h3>
        <Badge tone={priorityTone[priority]} variant="soft" size="md" className="ds-assignment__priority">
          {priorityLabel[priority]}
        </Badge>
      </div>
      <footer className="ds-assignment__foot">
        <Badge tone="success" variant="solid" size="md">
          {tag}
        </Badge>
        <span className="ds-assignment__assignee">
          {assignee.name}
          <Avatar {...assignee} size="xs" />
        </span>
      </footer>
    </article>
  );
}
