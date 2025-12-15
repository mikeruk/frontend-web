import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject, signal } from '@angular/core';
import {DecimalPipe, NgIf} from '@angular/common';
import { HttpClient } from '@angular/common/http';

type OfferRequest = {
  kilometers: number;
  vehicleType: string;
  postcode: string;
};

type OfferResponse = {
  offerId: number;
  offerRequestId: number;
  kilometers: number;
  vehicleType: string;
  postcode: string;
  price: number;
  kmFactor: number;
  vehicleTypeFactor: number;
  regionFactor: number;
  status: string;
  expirationDate: string;
};

@Component({
  selector: 'app-step-result',
  standalone: true,
  imports: [NgIf, DecimalPipe],
  templateUrl: './step-result.html',
  styleUrls: ['./step-result.css'],
})
export class StepResultComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);

  @Input() createOfferPath = '/api/offers';

  @Input({ required: true }) kilometers!: number;
  @Input({ required: true }) vehicleType!: string;
  @Input({ required: true }) postcode!: string;

  @Output() reset = new EventEmitter<void>();
  @Output() backToStep2 = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  private readonly minSpinnerMs = 3000;
  private loadSeq = 0;

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  offer = signal<OfferResponse | null>(null);

  remainingText = signal<string>('--:--:--.---');
  expired = signal(false);

  private timerId: number | null = null;
  private expiresAtMs: number | null = null;

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  load(): void {
    const seq = ++this.loadSeq;
    const startedAt = Date.now();

    this.loading.set(true);
    this.errorMessage.set(null);
    this.offer.set(null);

    this.stopTimer();
    this.remainingText.set('--:--:--.---');
    this.expired.set(false);

    const req = {
      kilometers: this.kilometers,
      vehicleType: this.vehicleType,
      postcode: this.postcode,
    };

    const finishAfterMinDelay = (fn: () => void) => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, this.minSpinnerMs - elapsed);

      window.setTimeout(() => {
        if (seq !== this.loadSeq) return;

        fn();
      }, remaining);
    };

    this.http.post<OfferResponse>(this.createOfferPath, req).subscribe({
      next: (res) => {
        finishAfterMinDelay(() => {
          this.offer.set(res);
          this.loading.set(false);
          this.success.emit();

          this.expiresAtMs = this.parseLocalDateTimeToMs(res.expirationDate);
          this.startTimer();
        });
      },
      error: (err) => {
        const msg = this.extractErrorMessage(err);
        finishAfterMinDelay(() => {
          this.errorMessage.set(msg);
          this.loading.set(false);
        });
      },
    });
  }


  onReset(): void { this.reset.emit(); }
  onBack(): void { this.backToStep2.emit(); }

  private startTimer(): void {
    if (!this.expiresAtMs) return;

    this.timerId = window.setInterval(() => {
      const now = Date.now();
      const diff = this.expiresAtMs! - now;

      if (diff <= 0) {
        this.remainingText.set('00:00:00.000');
        this.expired.set(true);
        this.stopTimer();
        return;
      }

      this.remainingText.set(this.formatMs(diff));
      this.expired.set(false);
    }, 50);
  }

  private stopTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private formatMs(ms: number): string {
    const totalMs = Math.max(0, Math.floor(ms));
    const hours = Math.floor(totalMs / 3_600_000);
    const rem1 = totalMs % 3_600_000;
    const mins = Math.floor(rem1 / 60_000);
    const rem2 = rem1 % 60_000;
    const secs = Math.floor(rem2 / 1000);
    const msec = rem2 % 1000;

    const hh = String(hours).padStart(2, '0');
    const mm = String(mins).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');
    const mmm = String(msec).padStart(3, '0');

    return `${hh}:${mm}:${ss}.${mmm}`;
  }


  private parseLocalDateTimeToMs(value: string): number {
    // yyyy-MM-ddTHH:mm:ss(.fffffffff)?
    const [datePart, timePartRaw] = value.split('T');
    const [y, mo, d] = datePart.split('-').map(Number);

    const timePart = timePartRaw ?? '00:00:00';
    const [hms, fracRaw] = timePart.split('.');
    const [hh, mm, ss] = hms.split(':').map(Number);

    const frac = (fracRaw ?? '').replace(/\D/g, '');
    const msStr = (frac + '000').slice(0, 3);
    const millis = Number(msStr);

    return new Date(y, (mo ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, ss ?? 0, millis).getTime();
  }

  private extractErrorMessage(err: any): string {
    const e = err?.error;
    if (typeof e === 'string' && e.trim()) return e;
    if (e?.message) return String(e.message);
    if (err?.message) return String(err.message);
    return 'Request failed';
  }
}
