import React from 'react';
import { shallow } from 'enzyme';
import Input from './Input';
import { findByTestAttr } from '../../test/unitTestUtils';

const defaultProps = {
  URI:
    'postgres://obhoewra:VTmNUAJf2aPTnwz9APKEVjCrsFvPXAZQ@drona.db.elephantsql.com:5432/obhoewra',
};

/**
 * Factory function to create a ShallowWrapper for the Input component.
 * @function setup
 * @param {object} initialState
 * @returns {ShallowWrapper}
 */

const setup = (initialProps = {}) => {
  const wrapper = shallow(<Input URI={initialProps} />)
    .dive()
    .dive();
  return wrapper;
};

setup();

describe('render with no input', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  });
  it('renders input component without error', () => {
    const inputComponent = findByTestAttr(wrapper, 'uri-input');
    expect(inputComponent.length).toBe(1);
  });
});
