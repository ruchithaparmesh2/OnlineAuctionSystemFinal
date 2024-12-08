import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllauctionsuserComponent } from './allauctionsuser.component';

describe('AllauctionsuserComponent', () => {
  let component: AllauctionsuserComponent;
  let fixture: ComponentFixture<AllauctionsuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllauctionsuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllauctionsuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
