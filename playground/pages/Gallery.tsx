import { useState, type ReactNode } from "react";
import {
  AssignmentCard, Avatar, AvatarGroup, Badge, Button, CalendarCard, CalendarIllustration, Card, CardHeader,
  CollaborateIllustration, CreateTile, FeatureCard, GiftIllustration, IconButton, MeetingCard, MetaItem, NavTabs,
  NotesIllustration, NotificationItem, ProgressBar, ProgressRing, PromoCard, SearchInput, SegmentedControl, SideRail,
  StatCard, StatusDot, SwipeActions, TaskList, TextField, WeekStrip, fontSize, radius, space,
  AnalogClock, AppTile, CountdownCard, DayChips, DigitalClock, IntakeStepper, KnobSwitch, MeterGroup, MusicPlayer,
  TimeChip, TransportControls, VerticalMeter, Waveform, WeatherCard, sampleWaveform,
} from "../../ui/index";
import { agendaSlots, railItems, tasks, team, themeOptions, topTabs, week } from "./data";
import type { Theme } from "./Dashboard";
import "./Gallery.css";

function Section({ id, title, note, children }: { id: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section id={id} className="gal-section">
      <header className="gal-section__head">
        <h2>{title}</h2>
        {note && <p>{note}</p>}
      </header>
      {children}
    </section>
  );
}

function Specimen({ name, children, wide }: { name: string; children: ReactNode; wide?: boolean }) {
  return (
    <figure className={wide ? "gal-specimen gal-specimen--wide" : "gal-specimen"}>
      <div className="gal-specimen__stage">{children}</div>
      <figcaption>{name}</figcaption>
    </figure>
  );
}

const semanticColors = [
  "bg-canvas", "bg-app", "bg-surface", "bg-sunken", "bg-inverse", "bg-accent", "bg-accent-soft", "bg-accent-subtle",
  "bg-success", "bg-success-soft", "bg-danger-soft", "text-primary", "text-secondary", "text-muted", "text-accent",
  "text-success", "text-danger", "border-subtle", "border-default", "border-dashed", "status-attention",
];

const nav = [
  ["tokens", "Tokens"], ["buttons", "Buttons"], ["data-display", "Data display"], ["inputs", "Inputs"],
  ["surfaces", "Surfaces"], ["navigation", "Navigation"], ["widgets", "Widgets"], ["ambient", "Ambient widgets"],
  ["illustrations", "Illustrations"],
] as const;

export function Gallery({ theme, onThemeChange }: { theme: Theme; onThemeChange: (t: Theme) => void }) {
  const [seg, setSeg] = useState<"list" | "grid" | "board">("grid");
  const [tab, setTab] = useState<string>("dashboard");
  const [day, setDay] = useState("2021-05-18");
  const [swipeOpen, setSwipeOpen] = useState(true);
  const [chip, setChip] = useState(24);
  const [on, setOn] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [cups, setCups] = useState(3);
  const [bars] = useState(() => sampleWaveform(30));
  const [birthday] = useState(() => new Date(Date.now() + 98 * 86_400_000 + 2 * 3_600_000 + 15 * 60_000 + 30_000));

  return (
    <div className="gal">
      <aside className="gal-toc">
        <a href="#" className="gal-toc__brand">Planify UI</a>
        <nav aria-label="Sections">
          {nav.map(([id, label]) => (
            <a key={id} href={`#components`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }}>
              {label}
            </a>
          ))}
        </nav>
        <SegmentedControl
          label="Theme"
          value={theme}
          onChange={onThemeChange}
          options={themeOptions}
        />
        <a href="#" className="gal-toc__back">← Back to dashboard</a>
      </aside>

      <main className="gal-main">
        <h1 className="gal-title">Component library</h1>
        <p className="gal-lead">Every token and component extracted from the Planify dashboard, rendered live from the same code the dashboard uses.</p>

        <Section id="tokens" title="Tokens" note="Semantic colours re-map per theme; components never reference the raw palette.">
          <div className="gal-swatches">
            {semanticColors.map((c) => (
              <div key={c} className="gal-swatch">
                <span style={{ background: `var(--ds-${c})` }} />
                <code>--ds-{c}</code>
              </div>
            ))}
          </div>

          <h3 className="gal-sub">Type scale · Urbanist</h3>
          <div className="gal-type">
            {Object.entries(fontSize).reverse().map(([k, px]) => (
              <div key={k} className="gal-type__row">
                <code>{k} · {px}px</code>
                <span style={{ fontSize: px, fontWeight: px >= 20 ? 600 : 500 }}>What are your plans for today?</span>
              </div>
            ))}
          </div>

          <h3 className="gal-sub">Spacing · 4px grid</h3>
          <div className="gal-space">
            {Object.entries(space).filter(([, v]) => v > 0).map(([k, v]) => (
              <div key={k}><span style={{ width: `var(--ds-space-${k})`, height: `var(--ds-space-${k})` }} /><code>{k} · {v}×density</code></div>
            ))}
          </div>

          <h3 className="gal-sub">Radii · from the shape facet</h3>
          <div className="gal-radii">
            {Object.entries(radius).map(([k, v]) => (
              <div key={k}><span style={{ borderRadius: k === "pill" ? 36 : v }} /><code>{k}</code></div>
            ))}
          </div>

          <h3 className="gal-sub">Elevation</h3>
          <div className="gal-elev">
            {([0, 1, 2, 3] as const).map((e) => (
              <Card key={e} elevation={e} padding="md" radius="lg"><code>elevation={e}</code></Card>
            ))}
            <Card tone="accent" elevation={2} padding="md" radius="lg"><code>accent glow</code></Card>
          </div>
        </Section>

        <Section id="buttons" title="Buttons">
          <div className="gal-grid">
            <Specimen name="Button · variants">
              <Button>Accept invite</Button>
              <Button variant="inverse">Add new board</Button>
              <Button variant="soft">Reschedule</Button>
              <Button variant="ghost" leadingIcon="edit">Edit</Button>
              <Button variant="dashed" leadingIcon="plus">Add item</Button>
            </Specimen>
            <Specimen name="Button · sizes + trailing slot">
              <Button size="sm">Check</Button>
              <Button size="md">Medium</Button>
              <Button size="lg" variant="inverse">Find out more</Button>
              <Button variant="soft" leadingIcon="download" trailing={<Badge tone="accent" variant="solid" size="xs">xls</Badge>}>Export data</Button>
            </Specimen>
            <Specimen name="IconButton · ghost / soft / surface / accent, dot">
              <IconButton icon="bell" label="Notifications" dot />
              <IconButton icon="settings" label="Settings" variant="soft" />
              <IconButton icon="chevronRight" label="Next" variant="surface" />
              <IconButton icon="plus" label="Add" variant="accent" />
              <IconButton icon="more" label="More" size="sm" />
            </Specimen>
          </div>
        </Section>

        <Section id="data-display" title="Data display">
          <div className="gal-grid">
            <Specimen name="Badge · tones × variants">
              <Badge tone="danger">High</Badge>
              <Badge tone="success" variant="solid" size="md">Package design</Badge>
              <Badge tone="accent">Motion design</Badge>
              <Badge tone="neutral">Draft</Badge>
              <Badge tone="success" variant="solid" size="xs">NEW</Badge>
            </Specimen>
            <Specimen name="StatusDot · MetaItem">
              <StatusDot tone="online" /> <StatusDot tone="attention" /> <StatusDot tone="accent" /> <StatusDot tone="danger" />
              <MetaItem icon="calendarDays">Sat, 10 May</MetaItem>
              <MetaItem icon="clock">11 AM - 11:45 AM</MetaItem>
            </Specimen>
            <Specimen name="Avatar · AvatarGroup">
              <Avatar name="Rachel Lee" size="xs" />
              <Avatar name="Ken Smith" size="sm" />
              <Avatar name="John Smith" size="md" />
              <AvatarGroup people={team} onAdd={() => {}} />
              <AvatarGroup people={[...team, { name: "Ivy Park" }, { name: "Sam Roe" }]} max={3} />
            </Specimen>
            <Specimen name="ProgressBar · ProgressRing">
              <div style={{ width: 160 }}><ProgressBar value={90} label="Demo" /></div>
              <ProgressRing value={90} tone="success" label="Demo" />
              <ProgressRing value={65} tone="danger" label="Demo" />
              <ProgressRing value={40} tone="accent" size={44} label="Demo" />
            </Specimen>
          </div>
        </Section>

        <Section id="inputs" title="Inputs">
          <div className="gal-grid">
            <Specimen name="SearchInput">
              <div style={{ width: 240 }}><SearchInput /></div>
            </Specimen>
            <Specimen name="TextField">
              <div style={{ width: 260 }}><TextField label="Reply" placeholder="Hey team, just wanted to check in…" /></div>
            </Specimen>
            <Specimen name="SegmentedControl · filled / plain">
              <SegmentedControl label="Theme demo" value={theme} onChange={onThemeChange} options={themeOptions} />
              <SegmentedControl label="View" variant="plain" size="sm" value={seg} onChange={setSeg} options={[{ value: "list", icon: "viewList", ariaLabel: "List" }, { value: "grid", icon: "viewGrid", ariaLabel: "Grid" }, { value: "board", icon: "viewBoard", ariaLabel: "Board" }]} />
            </Specimen>
            <Specimen name="WeekStrip">
              <div style={{ width: 300 }}><WeekStrip days={week} selected={day} onSelect={setDay} /></div>
            </Specimen>
          </div>
        </Section>

        <Section id="surfaces" title="Surfaces">
          <div className="gal-grid">
            <Specimen name="Card + CardHeader" wide>
              <Card style={{ width: "100%" }}>
                <CardHeader title="Assignments" actions={<Button variant="ghost" size="sm" leadingIcon="edit">Edit</Button>} />
                <p style={{ color: "var(--ds-text-secondary)" }}>Any content. Cards take elevation, padding, radius and tone.</p>
              </Card>
            </Specimen>
            <Specimen name="CreateTile · square / row" wide>
              <div style={{ width: 140, height: 140 }}><CreateTile label="Create board" /></div>
              <div style={{ flex: 1, minWidth: 220 }}><CreateTile layout="row" label="Add new assignment" /></div>
            </Specimen>
          </div>
        </Section>

        <Section id="navigation" title="Navigation">
          <div className="gal-grid">
            <Specimen name="NavTabs" wide>
              <NavTabs tabs={[...topTabs]} active={tab} onChange={setTab} />
            </Specimen>
            <Specimen name="SideRail">
              <SideRail items={railItems} active="home" />
            </Specimen>
          </div>
        </Section>

        <Section id="widgets" title="Widgets" note="Composites built only from the primitives above.">
          <div className="gal-widgets">
            <FeatureCard illustration={<CalendarIllustration />} title="Stay organized" description="A clear structure for your notes" />
            <Card>
              <CardHeader title="Notifications" actions={<Button variant="ghost" size="sm" leadingIcon="trash" onClick={() => setSwipeOpen((o) => !o)}>Toggle tray</Button>} />
              <SwipeActions open={swipeOpen} actions={[{ icon: "trash", label: "Delete" }, { icon: "edit", label: "Edit" }]}>
                <NotificationItem
                  state={swipeOpen ? "raised" : "resting"}
                  title="Upcoming event"
                  titleAdornment={<StatusDot />}
                  subtitle="Landing design meeting | Time: 120 min"
                  meta={<><MetaItem icon="calendarDays">Sat, 10 May</MetaItem><MetaItem icon="clock">11 AM - 11:45 AM</MetaItem></>}
                />
              </SwipeActions>
            </Card>
            <AssignmentCard categories={["Motion design", "Logo"]} title="Design a packaging concept for a new product" priority="high" tag="Package design" assignee={{ name: "Rachel Lee" }} />
            <CalendarCard monthLabel="May 2021" days={week} selected={day} onSelect={setDay} slots={agendaSlots} />
            <Card className="gal-span2">
              <CardHeader title="Today tasks" adornment={<AvatarGroup people={team} onAdd={() => {}} />} />
              <TaskList tasks={tasks} selectedId="research" />
            </Card>
            <PromoCard illustration={<GiftIllustration />} title="Go premium!" description="Gain access to a range of benefits designed to enhance your user experience" ctaLabel="Find out more" />
            <StatCard value={65} tone="danger" eyebrow="UX/UI design" title="Typography" caption="You marked 3/5" detail="2 assignments left" action={{ label: "Check" }} />
            <MeetingCard title="Board meeting" when="March 24 at 4:00 PM" description="Meeting with John Smith, 4th floor, room 159" />
          </div>
        </Section>

        <Section id="ambient" title="Ambient widgets" note="From the soft-UI reference. Switch to the Soft theme to see them as designed; they also work in Light and Dark.">
          <div className="gal-grid">
            <Specimen name="DayChips · TimeChip">
              <DayChips days={[21, 22, 23, 24, 25]} selected={chip} onSelect={setChip} />
              <TimeChip value={98} unit="d" digits={3} />
              <TimeChip value={2} unit="h" />
            </Specimen>
            <Specimen name="Waveform · TransportControls">
              <div style={{ width: 150 }}><Waveform bars={bars} progress={0.55} /></div>
              <div style={{ width: 220 }}><TransportControls playing={playing} onToggle={() => setPlaying((p) => !p)} /></div>
            </Specimen>
            <Specimen name="AppTile · VerticalMeter">
              <div style={{ width: 76 }}><AppTile icon="camera" label="Camera" filled /></div>
              <div style={{ width: 76 }}><AppTile icon="fan" label="Fan" filled /></div>
              <VerticalMeter label="Week" value={44} tone="highlight" />
              <VerticalMeter label="Month" value={20} />
            </Specimen>
            <Specimen name="KnobSwitch">
              <div style={{ width: 280 }}><KnobSwitch checked={on} onChange={setOn}>luck...</KnobSwitch></div>
            </Specimen>
          </div>
          <div className="gal-widgets" style={{ marginTop: 24 }}>
            <DigitalClock meter={{ value: 40, label: "Battery" }} />
            <WeatherCard condition="fine" temperature={0} days={[21, 22, 23, 24, 25]} selectedDay={chip} onSelectDay={setChip} />
            <Card padding="md" style={{ display: "grid", placeItems: "center" }}><AnalogClock size={200} /></Card>
            <CountdownCard title="Birthday left" target={birthday} />
            <MusicPlayer title="music" bars={bars} progress={0.55} playing={playing} onToggle={() => setPlaying((p) => !p)} />
            <MeterGroup title="Count down" meters={[{ label: "Today", value: 9 }, { label: "Week", value: 44, tone: "highlight" }, { label: "Month", value: 20 }, { label: "Year", value: 26, tone: "highlight" }]} />
            <IntakeStepper title="Water intake" value={cups} max={8} onChange={setCups} />
          </div>
        </Section>

        <Section id="illustrations" title="Illustrations" note="Line art on currentColor; paper and accent fills come from --ds-illus-* so they follow the theme.">
          <div className="gal-illus">
            {[CalendarIllustration, NotesIllustration, CollaborateIllustration, GiftIllustration].map((I, i) => (
              <Card key={i} padding="md" radius="lg"><I /></Card>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}
