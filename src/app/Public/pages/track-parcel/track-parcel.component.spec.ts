import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackParcelComponent } from './track-parcel.component';

describe('TrackParcelComponent', () => {
  let component: TrackParcelComponent;
  let fixture: ComponentFixture<TrackParcelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackParcelComponent]
    });
    fixture = TestBed.createComponent(TrackParcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
