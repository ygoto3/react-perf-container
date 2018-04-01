import React, { Component, PureComponent } from 'react';
import { pure } from 'recompose';
import Perf from 'react-addons-perf';

export const emojis = {
  CROSS_MARK: '❌',
  UP_ARROW: '⬆️',
  DOWN_ARROW: '⬇️',
};

export const printTypes = [ 'printWasted', 'printOperations', 'printInclusive', 'printExclusive' ];

export const borderStyle = {
  border: '1px solid #c1c1c1',
  borderRadius: '2px',
  color: '#828282',
};

export const buttonStyle = {
  ...borderStyle,
  fontSize: '12px',
  padding: '0.5em 1em',
};

export const sButtonStyle = {
  ...borderStyle,
  fontSize: '12px',
  padding: '0.5em 1em',
};

export const sqButtonStyle = {
  ...borderStyle,
  backgroundColor: '#f7f7f7',
  fontSize: '8px',
  height: '3em',
  width: '3em',
};

export const rootStyle = {
  height: '100vh',
  position: 'relative',
};

export const bodyStyle = {
  width: '11em',
};

export const actionsStyle = {
  color: '#828282',
  position: 'absolute',
  right: 0,
  textAlign: 'right',
  top: 0,
};

export const actionsStyleBottom = {
  ...actionsStyle,
  bottom: 0,
  top: 'initial',
};

export const hiddenStyle = {
  display: 'none',
  visibility: 'hidden',
};

export const printsStyle = {
  display: 'flex',
  flexDirection: 'column',
};

export const flexRowStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
};

export const flexColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
};

export const planeListStyle = {
  margin: '0',
  listStyleType: 'none',
};

export const tabStyle = {
  flex: '1',
};

export const tabButtonStyle = {
  ...buttonStyle,
  borderRadius: 0,
  width: '100%',
};

export const subSectionStyle = {
  ...borderStyle,
  backgroundColor: '#fff',
  padding: '.5em',
};

export const sectionStyle = {
  ...borderStyle,
  backgroundColor: '#f7f7f7',
  padding: '.5em',
};

export const printSettingsStyle = {
  fontSize: '10px',
  textAlign: 'left',
};

export const settingsSectionStyle = {
  paddingBottom: '.5em',
};

export const styles = {
  section: {
    ...borderStyle,
    backgroundColor: '#f7f7f7',
    padding: '1em',
  },
  types: {
    display: 'none',
  },
  button: {
    ...borderStyle,
    fontSize: '12px',
    padding: '0.5em 1em',
  },
  sButton: {
    ...borderStyle,
    fontSize: '8px',
    padding: '0.5em 1em',
  },
};

export function withStyle(style, Tag = 'div') {
  style = { ...style };
  return ({ style:customStyle, ...props }) => (
    <Tag style={ !customStyle ? style : { ...style, ...customStyle } } { ...props } />
  );
}

function action2button(action, idx) {
  return <Button key={ idx } onClick={ action[1] }>{ action[0] }</Button>;
}

export const Button = withStyle(buttonStyle, 'button');
export const SButton = withStyle(sButtonStyle, 'button');
export const SqButton = withStyle(sqButtonStyle, 'button');
export const TabButton = withStyle(tabButtonStyle, 'button');
export const FlexRow = withStyle(flexRowStyle);
export const FlexColumn = withStyle(flexColumnStyle);
export const Section = withStyle(sectionStyle);
export const SubSection = withStyle(subSectionStyle);

export const Tabs = pure(({ items }) => (
  <ul style={{ ...planeListStyle, ...flexRowStyle }}>
    { items.map((item, idx) => (
      <li key={ idx } style={ tabStyle }><TabButton onClick={ item[1] }>{ item[0] }</TabButton></li>
    )) }
  </ul>
));

export const Settings = pure(({ onChangeFlag, printTypeSets, ...props }) => (
  <SubSection { ...props }>
    <div style={ printSettingsStyle }>
      { printTypes.map((type, idx) => (
        <div key={ idx }>
          <input id={`perf_${ type }`} data-type={ type } type="checkbox" defaultChecked={ printTypeSets[type] } onChange={ onChangeFlag } />
          <label htmlFor={`perf_${ type }`}>{ type }</label>
        </div>
      )) }
    </div>
  </SubSection>
));

export const Actions = pure(({ items, onChangeFlag, printTypeSets }) => (
  <div>
    <div style={ settingsSectionStyle }>
      <Settings
        onChangeFlag={ onChangeFlag }
        printTypeSets={ printTypeSets }
      />
    </div>
    <FlexColumn>
      { items.map(action2button) }
    </FlexColumn>
  </div>
));

export const Timing = pure(({ actions }) => (
  <div>
    <FlexRow>
      { actions.slice(0, 2).map(action2button) }
    </FlexRow>
    <FlexColumn>
      { actions.slice(2).map(action2button) }
    </FlexColumn>
  </div>
));

export const ControllerPresenter = pure(({
  layout,
  display,
  selected,
  toggle,
  toggleLayout,
  actions,
  tabActions,
  onChangeFlag,
  printTypeSets,
  printActions
}) => (
  <div style={ layout === 'top' ? actionsStyle : actionsStyleBottom }>
    <SqButton onClick={ toggleLayout }>{ layout === 'top' ? emojis.DOWN_ARROW : emojis.UP_ARROW }</SqButton>
    <SqButton onClick={ toggle }>{ display ? emojis.CROSS_MARK : '>' }</SqButton>
    { !display ? null :
      <div style={ bodyStyle }>
        <Tabs items={ tabActions } />
        <Section>
        { selected === 'Actions' ? (
          <Actions
            items={ actions }
            onChangeFlag={ onChangeFlag }
            printTypeSets={ printTypeSets }
          />
        ) : (
          <Timing actions={ printActions } />
        ) }
        </Section>

      </div>
    }
  </div>
));

export class ControllerContainer extends PureComponent {
  constructor() {
    super();
    [ 'toggle', 'toggleLayout' ].forEach(v => this[v] = this[v].bind(this));
    this.tabActions = [ 'Actions', 'Timing' ]
      .map(method => [ method, this.onSelect.bind(this, method) ]);
    this.state = {
      display: true,
      layout: 'top',
      selected: 'Actions',
    };
  }

  render() {
    const { tabActions, toggle, toggleLayout } = this;
    const { actions, printActions, onChangeFlag, printTypeSets } = this.props;
    const { display, layout, selected } = this.state;
    return (
      <ControllerPresenter
        layout={ layout }
        display={ display }
        selected={ selected }
        toggle={ toggle }
        toggleLayout={ toggleLayout }
        actions={ actions }
        tabActions={ tabActions }
        onChangeFlag={ onChangeFlag }
        printTypeSets={ printTypeSets }
        printActions={ printActions }
      />
    );
  }

  toggle() {
    this.setState({ display: !this.state.display });
  }

  toggleLayout() {
    this.setState({ layout: this.state.layout !== 'top' ? 'top' : 'bottom' });
  }

  onSelect(selected) {
    this.setState({ selected });
  }
}

export class PerfContainer extends Component {

  constructor() {
    super();
    ['onChangeFlag', 'print']
      .forEach(method => this[method] = this[method].bind(this));
    this.printTypes = {};
  }

  componentWillMount() {
    const { debug, ...props } = this.props;
    this.state = { ...props };
    this.component = debug.component;
    this.actions = Object.keys(debug.actions)
      .map(label => [ label, () => {
        const action = debug.actions[label].bind(this);
        this.startPerf();
        action(() => {
          this.stopPerf();
          this.print();
        });
      }]);
    this.printActions = [ 'startPerf', 'stopPerf', ...printTypes ]
        .map(method => [ method, this[method].bind(this) ]);
    Object.keys(debug.defaultPrintTypes).forEach(type => this.printTypes[type] = debug.defaultPrintTypes[type]);
  }

  render() {
    const { component, actions, onChangeFlag, printTypes, printActions } = this;
    return (
      <div style={ rootStyle }>
        { component({ ...this.state }) }
        <ControllerContainer
          actions={ actions }
          onChangeFlag={ onChangeFlag }
          printTypeSets={ printTypes }
          printActions={ printActions }
        />
      </div>
    ); 
  }

  onChangeFlag(e) {
    const target = e.currentTarget;
    this.printTypes[target.dataset.type] = target.checked;
  }

  print() {
    printTypes.forEach(type => this.printTypes[type] && Perf[type]());
  }

  startPerf() {
    Perf.start();
  }

  stopPerf() {
    Perf.stop();
  }

  printWasted() {
    Perf.printWasted();
  }

  printOperations() {
    Perf.printOperations();
  }

  printInclusive() {
    Perf.printInclusive();
  }

  printExclusive() {
    Perf.printExclusive();
  }

}

export default ({ actions, props, defaultPrintTypes = { printWasted: true } }) => component => (
  <PerfContainer debug={{ component, actions, defaultPrintTypes }} { ...props } />
);
