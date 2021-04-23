import { Component, OnInit } from '@angular/core';
import { AcuService } from '@core/services/acu.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  constructor(private acuService: AcuService) {}

  ngOnInit(): void {

  }
}
