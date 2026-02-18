import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimeRangeEditor } from '@/modules/settings/components/TimeRangeEditor';

describe('TimeRangeEditor', () => {
  it('parses initial value and calls onChange when updated', () => {
    const onChange = jest.fn();
    const initial = '00:00-01:00 Charge\n12:00-13:00 Discharge';
    render(<TimeRangeEditor value={initial} onChange={onChange} />);

    const timeInputs = document.querySelectorAll('input[type="time"]');
    expect(timeInputs.length).toBe(4);

    fireEvent.change(timeInputs[0], { target: { value: '00:30' } });

    expect(onChange).toHaveBeenCalled();
    const lastArg = (onChange.mock.calls[onChange.mock.calls.length - 1][0] as string);
    expect(lastArg).toContain('00:30-01:00');
  });

  it('adds and removes ranges', () => {
    const onChange = jest.fn();
    render(<TimeRangeEditor value={''} onChange={onChange} />);
    const addBtn = screen.getByText('Add Range');
    fireEvent.click(addBtn);
    expect(document.querySelectorAll('input[type="time"]').length).toBe(2);
    const removeBtns = screen.getAllByText('Remove');
    fireEvent.click(removeBtns[0]);
    expect(document.querySelectorAll('input[type="time"]').length).toBe(0);
  });
});
