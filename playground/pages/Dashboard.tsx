import { useState } from "react";
import {
  AppShell, AssignmentCard, AvatarGroup, Badge, Button, CalendarCard, CalendarIllustration, Card, CardHeader,
  CollaborateIllustration, CreateTile, FeatureCard, GiftIllustration, Greeting, IconButton, MeetingCard, MetaItem,
  NavTabs, NotesIllustration, NotificationItem, PromoCard, SearchInput, SegmentedControl, SideRail, StatCard,
  StatusDot, SwipeActions, TaskList, TextField, TopBar, WorkspaceTokens,
} from "../../ui/index";
import { agendaSlots, railItems, tasks, team, themeOptions, topTabs, week, type Theme } from "./data";
import "./Dashboard.css";

export type { Theme };

export function Dashboard({ theme, onThemeChange }: { theme: Theme; onThemeChange: (t: Theme) => void }) {
  const [tab, setTab] = useState<(typeof topTabs)[number]["id"]>("dashboard");
  const [railItem, setRailItem] = useState<(typeof railItems)[number]["id"]>("home");
  const [day, setDay] = useState("2021-05-18");
  const [view, setView] = useState<"list" | "grid" | "board">("grid");
  const [taskId, setTaskId] = useState("research");

  return (
    <div className="demo-canvas">
      <AppShell
        rail={<SideRail items={railItems} active={railItem} onSelect={setRailItem} />}
        topBar={
          <TopBar
            start={<NavTabs tabs={topTabs} active={tab} onChange={setTab} />}
            center={<SearchInput />}
            end={
              <>
                <SegmentedControl
                  label="Theme"
                  value={theme}
                  onChange={onThemeChange}
                  options={themeOptions}
                />
                <IconButton icon="bell" label="Notifications" />
                <IconButton icon="settings" label="Settings" />
                <Button
                  variant="soft"
                  leadingIcon="download"
                  className="demo-export"
                  trailing={
                    <Badge tone="accent" variant="solid" size="xs">
                      xls
                    </Badge>
                  }
                >
                  Export data
                </Button>
                <Button variant="inverse">Add new board</Button>
              </>
            }
          />
        }
      >
        <div className="demo-grid">
          {/* Row 1: hero */}
          <Greeting
            className="area-greeting"
            name="James"
            question="What are your plans for today?"
            description="This platform is designed to revolutionize the way you organize and access your notes"
            adornment={<WorkspaceTokens />}
          />
          <CreateTile className="area-create" label="Create a new board" />
          <FeatureCard
            className="area-f1"
            illustration={<CalendarIllustration />}
            title="Stay organized"
            description="A clear structure for your notes"
          />
          <FeatureCard
            className="area-f2"
            illustration={<NotesIllustration />}
            title="Sync your notes"
            description="Ensure that notes are synced"
          />
          <FeatureCard
            className="area-f3"
            illustration={<CollaborateIllustration />}
            title="Collaborate and share"
            description="Share notes with colleagues"
          />

          {/* Row 2 */}
          <Card as="section" className="area-notifications demo-notifications" aria-label="Notifications">
            <CardHeader
              title="Notifications"
              actions={
                <Button variant="ghost" size="sm" leadingIcon="trash">
                  Clear
                </Button>
              }
            />
            <div className="demo-stack">
              <SwipeActions open actions={[{ icon: "trash", label: "Delete" }, { icon: "edit", label: "Edit" }]}>
                <NotificationItem
                  state="raised"
                  title="Upcoming event"
                  titleAdornment={<StatusDot tone="online" label="Live" />}
                  subtitle="Landing design meeting | Time: 120 min"
                  meta={
                    <>
                      <MetaItem icon="calendarDays">Sat, 10 May</MetaItem>
                      <MetaItem icon="clock">11 AM - 11:45 AM</MetaItem>
                    </>
                  }
                />
              </SwipeActions>
              <NotificationItem
                className="demo-message"
                title={
                  <>
                    Message <span className="demo-pipe">|</span> Product design
                  </>
                }
                meta={<MetaItem icon="mail">Message from Ken Smith</MetaItem>}
              >
                <TextField label="Reply" placeholder="Hey team, just wanted to check in and see how a..." />
              </NotificationItem>
            </div>
          </Card>

          <Card as="section" className="area-assignments" aria-label="Assignments">
            <CardHeader
              title="Assignments"
              actions={
                <Button variant="ghost" size="sm" leadingIcon="edit">
                  Edit
                </Button>
              }
            />
            <div className="demo-stack">
              <AssignmentCard
                categories={["Motion design", "Logo"]}
                title="Design a packaging concept for a new product"
                priority="high"
                tag="Package design"
                assignee={{ name: "Rachel Lee" }}
              />
              <CreateTile layout="row" label="Add new assignment" />
            </div>
          </Card>

          <CalendarCard className="area-calendar" monthLabel="May 2021" days={week} selected={day} onSelect={setDay} slots={agendaSlots} />

          {/* Row 3 */}
          <Card as="section" className="area-tasks" aria-label="Today tasks">
            <CardHeader
              title="Today tasks"
              adornment={<AvatarGroup people={team} max={3} onAdd={() => {}} />}
              actions={
                <>
                  <SegmentedControl
                    label="View"
                    variant="plain"
                    size="sm"
                    value={view}
                    onChange={setView}
                    options={[
                      { value: "list", icon: "viewList", ariaLabel: "List view" },
                      { value: "grid", icon: "viewGrid", ariaLabel: "Grid view" },
                      { value: "board", icon: "viewBoard", ariaLabel: "Board view" },
                    ]}
                  />
                  <Button variant="ghost" size="sm" leadingIcon="edit">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" leadingIcon="share">
                    Share
                  </Button>
                </>
              }
            />
            <TaskList tasks={tasks} selectedId={taskId} onSelect={setTaskId} />
          </Card>

          <PromoCard
            className="area-promo"
            illustration={<GiftIllustration />}
            title="Go premium!"
            description="Gain access to a range of benefits designed to enhance your user experience"
            ctaLabel="Find out more"
          />

          <div className="area-side demo-side">
            <StatCard
              value={90}
              tone="success"
              eyebrow="Data research"
              title="Marketing"
              caption="You marked 5/5"
              detail="All assignments are done!"
            />
            <StatCard
              value={65}
              tone="danger"
              eyebrow="UX/UI design"
              title="Typography"
              caption="You marked 3/5"
              detail="2 assignments left"
              action={{ label: "Check" }}
            />
            <MeetingCard
              className="demo-meeting"
              title="Board meeting"
              when="March 24 at 4:00 PM"
              description="Meeting with John Smith, 4th floor, room 159"
            />
          </div>
        </div>
      </AppShell>
    </div>
  );
}
