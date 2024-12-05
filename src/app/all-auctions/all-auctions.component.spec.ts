import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAuctionsComponent } from './all-auctions.component';

describe('AllAuctionsComponent', () => {
  let component: AllAuctionsComponent;
  let fixture: ComponentFixture<AllAuctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllAuctionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllAuctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
