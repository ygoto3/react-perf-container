import React from 'react';
import test from 'ava';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import td from 'testdouble';
import withPerf, {
  buttonStyle,
  withStyle,
  Button,
  Tabs,
  TabButton,
  Settings,
  ControllerContainer,
  ControllerPresenter,
  PerfContainer,
} from './with-perf.js';

configure({ adapter: new Adapter() });

test('withStyle', t => {
  const StyledButton = withStyle(buttonStyle, 'button');
  const wrapper = shallow(<StyledButton>Button</StyledButton>);
  t.is(wrapper.props().style.fontSize, buttonStyle.fontSize);
});

test('Button', t => {
  const onClick = td.function();
  const wrapper = shallow(<Button onClick={ onClick }>Button</Button>);
  wrapper.simulate('click');
  t.is(td.explain(onClick).callCount, 1);
});

test('Tabs', t => {
  const label = 'label';
  const onClick = td.function();
  const items = [ [label, onClick], [label, onClick] ];
  const wrapper = shallow(<Tabs items={ items } />).dive();

  const tabButtonWrapper = wrapper.find(TabButton);
  t.is(tabButtonWrapper.length, 2);

  tabButtonWrapper.at(0).simulate('click');
  t.is(td.explain(onClick).callCount, 1);
});

test('Settings', t => {
  const label = 'label';
  const onChangeFlag = td.function();
  const printTypeSets = { printWasted: true };
  const wrapper = shallow(<Settings onChangeFlag={ onChangeFlag } printTypeSets={ printTypeSets } />).dive();

  const inputWrapper = wrapper.find('input');
  t.is(inputWrapper.length, 4);

  const printWastedWrapper = inputWrapper.at(0);
  t.is(printWastedWrapper.props().defaultChecked, true);


  const printOperationsWrapper = inputWrapper.at(1);
  t.is(printOperationsWrapper.props().defaultChecked, undefined);
  printOperationsWrapper.simulate('change');
  t.is(td.explain(onChangeFlag).callCount, 1);
});

test('withPerf', t => {
  const Test = <p>Test</p>;
  const wrapper = shallow(withPerf({
    props: {
      items: [
        { title: 'Item', description: 'Item comes here' },
      ],
    },
    actions: { 'Add Item': () => {} },
  })(({ items }) => (
    <Test />
  )));

  const controllerContainerWrapper = wrapper.find(ControllerContainer);
  t.is(controllerContainerWrapper.length, 1);
  t.is(controllerContainerWrapper.props().actions[0][0], 'Add Item');
});
