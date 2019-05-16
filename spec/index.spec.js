import { mount } from '@vue/test-utils';

import DomListeners, { getUseCapture } from '../src/index';

describe('DomListeners', () => {
    const component = {
        template: `
            <div>
                foobar
            </div>
        `,

        mixins: [DomListeners],
    };

    describe('getUseCapture', () => {
        it('returns false for undefined', () => {
            expect(getUseCapture(undefined)).toBe(false);
        });

        it('returns false for false', () => {
            expect(getUseCapture(false)).toBe(false);
        });

        it('returns true for true', () => {
            expect(getUseCapture(true)).toBe(true);
        });

        it('returns false for object', () => {
            expect(getUseCapture({})).toBe(false);
        });

        it('returns false for object with other arguments', () => {
            expect(getUseCapture({ passive: true })).toBe(false);
        });

        it('returns false for object with capture false', () => {
            expect(getUseCapture({ capture: false })).toBe(false);
        });

        it('returns true for object with capture true', () => {
            expect(getUseCapture({ capture: true })).toBe(true);
        });
    });

    describe('when mounted', () => {
        let wrapper;
        let callback;

        beforeEach(() => {
            wrapper = mount(component);
            callback = jest.fn();
            jest.spyOn(document, 'addEventListener');
            jest.spyOn(document, 'removeEventListener');
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        describe('when calling addEventListener', () => {
            beforeEach(() => {
                wrapper.vm.addEventListener(document, 'click', callback);
            });

            it('calls native addEventListener', () => {
                expect(document.addEventListener).toHaveBeenCalled();
            });

            it('calls native addEventListener with the same args', () => {
                expect(document.addEventListener).toHaveBeenCalledWith('click', callback, undefined);
            });

            it('adds the listener to the internal memory', () => {
                expect(wrapper.vm.$data._domListeners).toEqual([{
                    element: document,
                    type: 'click',
                    listener: callback,
                    capture: false,
                }]);
            });

            describe('when component destroyed', () => {
                beforeEach(() => {
                    wrapper.destroy();
                });

                it('calls native removeEventListener', () => {
                    expect(document.removeEventListener).toHaveBeenCalled();
                });

                it('calls native removeEventListener with the correct args', () => {
                    expect(document.removeEventListener)
                        .toHaveBeenCalledWith('click', callback, false);
                });
            });

            describe('when calling removeEventListener with same details', () => {
                beforeEach(() => {
                    wrapper.vm.removeEventListener(document, 'click', callback);
                });

                it('calls native removeEventListener', () => {
                    expect(document.removeEventListener).toHaveBeenCalled();
                });

                it('calls native removeEventListener with the correct args', () => {
                    expect(document.removeEventListener)
                        .toHaveBeenCalledWith('click', callback, undefined);
                });

                it('removes the listener from the internal memory', () => {
                    expect(wrapper.vm.$data._domListeners).toEqual([]);
                });
            });

            describe('when calling removeEventListener with different capture', () => {
                beforeEach(() => {
                    wrapper.vm.removeEventListener(document, 'click', callback, true);
                });

                it('does not remove the listener from the internal memory', () => {
                    expect(wrapper.vm.$data._domListeners.length).toEqual(1);
                });
            });

            describe('when calling removeEventListener with different callback', () => {
                beforeEach(() => {
                    wrapper.vm.removeEventListener(document, 'click', jest.fn());
                });

                it('does not remove the listener from the internal memory', () => {
                    expect(wrapper.vm.$data._domListeners.length).toEqual(1);
                });
            });

            describe('when calling removeEventListener with different type', () => {
                beforeEach(() => {
                    wrapper.vm.removeEventListener(document, 'mousedown', callback);
                });

                it('does not remove the listener from the internal memory', () => {
                    expect(wrapper.vm.$data._domListeners.length).toEqual(1);
                });
            });

            describe('when calling removeEventListener with different element', () => {
                beforeEach(() => {
                    wrapper.vm.removeEventListener(document.body, 'click', callback);
                });

                it('does not remove the listener from the internal memory', () => {
                    expect(wrapper.vm.$data._domListeners.length).toEqual(1);
                });
            });
        });
    });
});
