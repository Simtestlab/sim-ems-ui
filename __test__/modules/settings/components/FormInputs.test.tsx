import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  TextInput,
  NumberInput,
  SmallNumberInput,
  CheckboxInput,
  RadioInput,
  UnitLabel,
} from '@/modules/settings/components/FormInputs';

describe('FormInputs', () => {
  it('renders text and number inputs and responds to changes', () => {
    const onChange = jest.fn();
    render(<TextInput value="x" onChange={onChange} />);
    const t = screen.getByDisplayValue('x') as HTMLInputElement;
    expect(t).toBeInTheDocument();
    fireEvent.change(t, { target: { value: 'y' } });
    expect(onChange).toHaveBeenCalled();

    render(<NumberInput value={''} aria-label="num" onChange={onChange} />);
    const num = screen.getByLabelText('num') as HTMLInputElement;
    expect(num.type).toBe('number');
  });

  it('renders small number input and checkbox/radio', () => {
    const onChange = jest.fn();
    render(<SmallNumberInput value={''} onChange={onChange} />);
    const small = document.querySelector('input[type="number"].w-20');
    expect(small).toBeInTheDocument();

    render(<CheckboxInput checked onChange={onChange} />);
    const cb = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(cb).toBeInTheDocument();

    render(<RadioInput name="r" value="1" onChange={onChange} />);
    const r = document.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(r).toBeInTheDocument();
  });

  it('renders UnitLabel children', () => {
    render(<UnitLabel>kW</UnitLabel>);
    expect(screen.getByText('kW')).toBeInTheDocument();
  });
});
