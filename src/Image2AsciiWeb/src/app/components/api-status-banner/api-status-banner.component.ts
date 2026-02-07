import { Component, inject, computed, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiStatusService } from '../../services/api-status.service';

@Component({
  selector: 'app-api-status-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api-status-banner.component.html',
  styleUrl: './api-status-banner.component.scss',
})
export class ApiStatusBannerComponent {
  private apiStatus = inject(ApiStatusService);

  status = this.apiStatus.status;
  retryCount = this.apiStatus.retryCount;

  showBanner = computed(() => {
    const s = this.status();
    return s === 'connecting' || s === 'waking' || s === 'offline';
  });

  @HostBinding('class.hidden')
  get isHidden() {
    return !this.showBanner();
  }

  statusIcon = computed(() => {
    switch (this.status()) {
      case 'connecting': return '◐';
      case 'waking': return '◑';
      case 'offline': return '✗';
      default: return '○';
    }
  });

  statusText = computed(() => {
    switch (this.status()) {
      case 'connecting':
        return 'CONNECTING TO RENDER ENGINE...';
      case 'waking':
        return 'WAKING UP SERVER (FREE TIER ~30-60s)...';
      case 'offline':
        return 'RENDER ENGINE OFFLINE - PLEASE TRY AGAIN LATER';
      default:
        return '';
    }
  });
}

