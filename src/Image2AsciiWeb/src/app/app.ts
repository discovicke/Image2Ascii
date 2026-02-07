import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { ApiStatusBannerComponent } from './components/api-status-banner/api-status-banner.component';
import { ApiStatusService } from './services/api-status.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, WorkspaceComponent, ApiStatusBannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private apiStatus = inject(ApiStatusService);

  ngOnInit() {
    // Check API health on startup
    this.apiStatus.checkHealth();
  }
}
