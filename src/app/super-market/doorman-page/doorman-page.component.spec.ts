import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoormanPageComponent } from './doorman-page.component';

describe('DoormanPageComponent', () => {
  let component: DoormanPageComponent;
  let fixture: ComponentFixture<DoormanPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoormanPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoormanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
