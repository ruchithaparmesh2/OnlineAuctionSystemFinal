import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionInsightsComponent } from './auction-insights.component';

describe('AuctionInsightsComponent', () => {
  let component: AuctionInsightsComponent;
  let fixture: ComponentFixture<AuctionInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionInsightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
