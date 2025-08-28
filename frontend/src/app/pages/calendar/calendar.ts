import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class Calendar {
  today = new Date();
  currentYear = signal(this.today.getFullYear());
  currentMonth = signal(this.today.getMonth());

  private releases: Record<string, { title: string; id: string }[]> = {
    [this.iso(new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()))]: [
      { title: 'Surprise Drop', id: 'surprise' }
    ],
    [this.iso(new Date(2025, 6, 9))]: [ { title: 'Space Odyssey Reborn', id: 'space-odyssey' } ],
    [this.iso(new Date(2025, 6, 16))]: [ { title: 'Mystery Manor', id: 'mystery-manor' }, { title: 'Desert Dune Tales', id: 'dune-tales' } ]
  };

  monthLabel = computed(() => {
    return new Date(this.currentYear(), this.currentMonth(), 1).toLocaleString(undefined, { month: 'long', year: 'numeric' });
  });

  weeks = computed(() => this.buildMonth(this.currentYear(), this.currentMonth()));

  prevMonth() {
    const m = this.currentMonth();
    if (m === 0) { this.currentMonth.set(11); this.currentYear.update(y => y - 1); } else { this.currentMonth.set(m - 1); }
  }
  nextMonth() {
    const m = this.currentMonth();
    if (m === 11) { this.currentMonth.set(0); this.currentYear.update(y => y + 1); } else { this.currentMonth.set(m + 1); }
  }
  goToday() {
    this.currentYear.set(this.today.getFullYear());
    this.currentMonth.set(this.today.getMonth());
  }

  buildMonth(year: number, month: number) {
    const first = new Date(year, month, 1);
    const startDay = first.getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: { date: Date | null; releases: { title: string; id: string }[] }[] = [];
    for (let i = 0; i < startDay; i++) cells.push({ date: null, releases: [] });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      cells.push({ date, releases: this.releases[this.iso(date)] ?? [] });
    }
    while (cells.length % 7 !== 0) cells.push({ date: null, releases: [] });
    const weeks: typeof cells[] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  }

  iso(d: Date) { return d.toISOString().slice(0,10); }
}
