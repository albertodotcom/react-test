/* eslint-env jest */
import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import configureStore from './configureStore';
import Quote from './Quote';
import * as QuoteModule from './module';

jest.mock('./module');

describe('Quote', () => {
  let store;

  beforeEach(() => {
    QuoteModule.quoteReducer.mockImplementation(() => ({}));
    QuoteModule.getQuote.mockImplementation(() => ({ loading: false }));
    store = configureStore({});
  });

  afterEach(() => {
    QuoteModule.getQuote.mockClear();
  });

  // Test that the state is passed to the component
  it('displays a loading text', () => {
    QuoteModule.getQuote.mockImplementation(() => ({
      loading: true,
    }));

    const wrapper = mount(<Quote store={store} />);

    expect(QuoteModule.getQuote.mock.calls.length).toEqual(1);
    expect(wrapper.find('.t-quote').text()).toEqual('Loading');
  });

  it('displays a quote', () => {
    QuoteModule.getQuote.mockImplementation(() => ({
      quote: 'foo',
      author: 'baz',
      loading: false,
    }));

    const wrapper = mount(<Quote store={store} />);

    expect(QuoteModule.getQuote.mock.calls.length).toEqual(1);
    expect(wrapper.find('.t-quote').text()).toEqual('foo, baz');
  });

  // Test that the action creator is connected to the component
  it('calls fetchQuote when the "Get Quote" button is clicked', () => {
    QuoteModule.fetchQuote.mockImplementation(() => ({ type: 'TEST' }));

    const wrapper = mount(<Quote store={store} />);
    wrapper.find('.t-fetch-quote').simulate('click');

    expect(QuoteModule.fetchQuote.mock.calls.length).toEqual(1);
    expect(QuoteModule.fetchQuote).toBeCalledWith();
  });

  describe('journey with snapshot', () => {
    it('renders a quote', () => {
      const wrapper = mount(<Quote store={store} />);
      expect(toJson(wrapper.find('Quote'))).toMatchSnapshot();

      QuoteModule.getQuote
      .mockImplementationOnce(() => ({
        loading: true,
      }));
      wrapper.find('.t-fetch-quote').simulate('click');
      expect(toJson(wrapper.find('Quote'))).toMatchSnapshot();

      QuoteModule.getQuote
      .mockImplementationOnce(() => ({
        quote: 'foo',
        author: 'baz',
        loading: false,
      }));
      wrapper.find('.t-fetch-quote').simulate('click');
      expect(toJson(wrapper.find('Quote'))).toMatchSnapshot();
    });
  });
});
