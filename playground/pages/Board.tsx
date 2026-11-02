import { useMemo, useState } from "react";
import {
  AnalogClock, AppGrid, AppTile, CountdownCard, DigitalClock, IntakeStepper, KnobSwitch, MeterGroup, MusicPlayer,
  SegmentedControl, WeatherCard, sampleWaveform,
} from "../../ui/index";
import { themeOptions, type Theme } from "./data";
import "./Board.css";

/** Phone-sized widget board rebuilt from the soft-UI reference, using only library components. */
export function Board({ theme, onThemeChange }: { theme: Theme; onThemeChange: (t: Theme) => void }) {
  const [day, setDay] = useState(24);
  const [lucky, setLucky] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [water, setWater] = useState(0);
  const bars = useMemo(() => sampleWaveform(30), []);
  // Fixed target so the countdown reads like the reference on first load.
  const birthday = useMemo(() => new Date(Date.now() + ((98 * 24 + 2) * 60 + 15) * 60_000 + 30_000), []);

  return (
    <div className="board-canvas">
      <header className="board-bar">
        <h1>Widget board</h1>
        <SegmentedControl label="Theme" value={theme} onChange={onThemeChange} options={themeOptions} size="sm" />
      </header>

      <div className="board">
        <DigitalClock className="b-clock" meter={{ value: 40, label: "Battery" }} />
        <WeatherCard className="b-weather" condition="fine" temperature={0} days={[21, 22, 23, 24, 25]} selectedDay={day} onSelectDay={setDay} />

        <AppGrid
          className="b-apps"
          apps={[
            { icon: "clock", label: "Clock" },
            { icon: "flashlight", label: "Flashlight", filled: true },
            { icon: "globe", label: "Browser" },
            { icon: "camera", label: "Camera", filled: true },
          ]}
        />
        <div className="b-analog">
          <AnalogClock size={210} />
        </div>

        <CountdownCard className="b-birthday" title="Birthday left" target={birthday} />
        <div className="b-luck">
          <KnobSwitch checked={lucky} onChange={setLucky}>
            luck...
          </KnobSwitch>
        </div>

        <MusicPlayer className="b-music" title="music" bars={bars} progress={0.55} playing={playing} onToggle={() => setPlaying((p) => !p)} />
        <MeterGroup
          className="b-meters"
          title="Count down"
          meters={[
            { label: "Today", value: 9, tone: "accent" },
            { label: "Week", value: 44, tone: "highlight" },
            { label: "Month", value: 20, tone: "accent" },
            { label: "Year", value: 26, tone: "highlight" },
          ]}
        />

        <AppTile className="b-fan" icon="fan" label="Fan" size="lg" filled />
        <AppTile className="b-frame" icon="image" label="Photos" size="lg" />
        <IntakeStepper className="b-water" title="Water intake" value={water} max={8} onChange={setWater} />
      </div>
    </div>
  );
}
