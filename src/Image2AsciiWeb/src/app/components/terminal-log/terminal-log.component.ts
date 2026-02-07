import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalLogService } from '../../services/terminal-log.service';

@Component({
  selector: 'app-terminal-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terminal-log.component.html',
  styleUrl: './terminal-log.component.scss'
})
export class TerminalLogComponent {
  protected terminalLog = inject(TerminalLogService);
}

