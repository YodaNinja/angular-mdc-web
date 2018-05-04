import { Component, DebugElement } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { async, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MdcSelectModule, MdcSelect } from '@angular-mdc/web';

describe('MdcSelectModule', () => {
  let fixture: ComponentFixture<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MdcSelectModule],
      declarations: [
        SimpleTest,
        SelectFormControl,
      ]
    });
    TestBed.compileComponents();
  }));

  describe('basic behaviors', () => {
    let testDebugElement: DebugElement;
    let testNativeElement: HTMLElement;
    let testInstance: MdcSelect;
    let testComponent: SimpleTest;

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleTest);
      fixture.detectChanges();

      testDebugElement = fixture.debugElement.query(By.directive(MdcSelect));
      testNativeElement = testDebugElement.nativeElement;
      testInstance = testDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
    });

    it('#should have mdc-select by default', () => {
      expect(testDebugElement.nativeElement.classList).toContain('mdc-select');
    });

    it('#should set disabled to true', () => {
      testComponent.disabled = true;
      fixture.detectChanges();
      expect(testInstance.disabled).toBe(true);
      expect(testInstance.isDisabled()).toBe(true);
    });

    it('#should set floatingLabel to false', () => {
      testComponent.floatingLabel = false;
      fixture.detectChanges();
      expect(testInstance.floatingLabel).toBe(false);
    });

    it('#should generate a unique id for the select if no id is set', () => {
      expect(testInstance.id).toMatch(/mdc-select-\d+/);
    });

    it('#should have `Please select` as placeholder text', () => {
      testInstance.setPlaceholder('Please select');
      fixture.detectChanges();
      expect(testInstance.placeholder).toMatch('Please select');
    });

    it('#should select fruit-3', () => {
      testInstance.setValue('fruit-3');
      fixture.detectChanges();
      expect(testInstance.getValue());
    });

    it('#should have no selected options', () => {
      testInstance.setValue(null);
      fixture.detectChanges();
      expect(testInstance.getSelectedIndex()).toBe(0);
    });
  });

  describe('form control basic behaviors', () => {
    let testDebugElement: DebugElement;
    let testNativeElement: HTMLElement;
    let testInstance: MdcSelect;
    let testComponent: SelectFormControl;

    beforeEach(() => {
      fixture = TestBed.createComponent(SelectFormControl);
      fixture.detectChanges();

      testDebugElement = fixture.debugElement.query(By.directive(MdcSelect));
      testNativeElement = testDebugElement.nativeElement;
      testInstance = testDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;

      fixture.detectChanges();
    });

    it('#should set value to tacos-2', () => {
      testComponent.foodControl.setValue('tacos-2');
      fixture.detectChanges();

      expect(testInstance.getValue()).toBe('tacos-2');
    });

    it('should be able to focus the select trigger', fakeAsync(() => {
      document.body.focus(); // ensure that focus isn't on the trigger already
      testInstance.focus();

      expect(document.activeElement).toBe(testInstance.inputEl.nativeElement, 'Expected select element to be focused.');
    }));
  });
});

@Component({
  template: `
    <form #demoSelectForm="ngForm" id="demoSelectForm">
      <mdc-select #select placeholder="Favorite food" ngModel #demoSelectModel="ngModel" name="food"
       [disabled]="disabled" [floatingLabel]="floatingLabel"
       (change)="handleChange($event)" (selectionChange)="handleSelectedChange($event)">
        <option *ngFor="let food of foods" [value]="food.value" [disabled]="food.disabled">
          {{food.description}}
        </option>
      </mdc-select>
    </form>
  `,
})
class SimpleTest {
  myPlaceholder: string = 'Favorite food';
  disabled: boolean = true;
  floatingLabel: boolean;

  foods = [
    { value: 'steak-0', description: 'Steak' },
    { value: 'pizza-1', description: 'Pizza' },
    { value: 'tacos-2', description: 'Tacos' },
    { value: 'fruit-3', description: 'Fruit', disabled: true },
  ];

  handleChange(event: { index: number, value: string }) { }
  handleSelectedChange(event: { index: number, value: string }) { }
}

@Component({
  template: `
  <mdc-select placeholder="Favorite food" [formControl]="foodControl" [autosize]="false" [box]="true" (blur)="handleBlur()">
    <option *ngFor="let food of foods" [value]="food.value" [disabled]="food.disabled">
      {{food.description}}
    </option>
  </mdc-select>
  `,
})
class SelectFormControl {
  foodControl = new FormControl();

  foods = [
    { value: 'steak-0', description: 'Steak' },
    { value: 'pizza-1', description: 'Pizza' },
    { value: 'tacos-2', description: 'Tacos' },
    { value: 'fruit-3', description: 'Fruit', disabled: true },
  ];

  handleChange(event: { index: number, value: string }) { }
  handleBlur: () => void = () => { };
}
