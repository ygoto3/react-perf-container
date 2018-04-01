import React, { Component } from 'react';
import { render } from 'react-dom';
import withPerf from '../index.js';

function generateNewItemFactory() {
  var i = 0;
  return () => newItemFactory(i++);
}

function newItemFactory(i) {
  return { title: `Item : ${ i }`, description: `Item #${ i } comes here` };
}

function getLastPrintTypes() {
  return JSON.parse(getItemFromStorage('last-printTypes') || '{}');
}

function getItemFromStorage(key) {
  return localStorage.getItem(`${ storagePrefix }${ key }`);
}

function setItemToStorage(key, value) {
  localStorage.setItem(`${ storagePrefix }${ key }`, value);
}

const storagePrefix = 'react-perf-container_';

const newItem = generateNewItemFactory();

const List = ({ items }) => <ul>{ items.map((i, idx) => <Item key={ idx } { ...i } />) }</ul>;
const Item = ({ title, description }) => (
  <div>
    <Heading>{ title }</Heading>
    <Text>{ description }</Text>
  </div>
);
const Heading = ({ children }) => <h2>{ children }</h2>;
const Text = ({ children }) => <p>{ children }</p>;

class Example extends Component {
  render() {
    const { items } = this.props;
    return <List items={ items } />;
  }
}

render((
  withPerf({
    props: {
      items: [
        newItem(),
      ],
    },
    actions: {
      'Add Item': function (end) {
        const items = this.state.items.concat(newItem());
        this.setState({ items }, end);
        setItemToStorage('last-printTypes', JSON.stringify(this.printTypes));
      }
    },
    defaultPrintTypes: getLastPrintTypes(),
  })(({ items }) => (
    <Example items={ items } />
  ))
), document.getElementById('root'));
