/**
 * Get the capture state either from an options object or the boolean state
 *
 * @param {Object|Boolean|undefined} options
 *
 * @returns {Boolean}
 */
export function getUseCapture(options) {
    if (!options) {
        return false;
    }

    if (typeof options === 'boolean') {
        return options;
    }

    return options.capture || false;
}

export default {
    data() {
        return {
            _domListeners: [],
        };
    },

    methods: {
        /**
         * Add an internally tracked event listener
         *
         * @param {EventTarget} element
         * @param {String} type
         * @param {Function} listener
         * @param {Object|Boolean|undefined} options
         * @param {Array<any>} ...args
         */
        addEventListener(element, type, listener, options, ...args) {
            this.$data._domListeners.push({
                element,
                type,
                listener,
                capture: getUseCapture(options),
            });

            element.addEventListener(type, listener, options, ...args);
        },

        /**
         * Remove an internally tracked event listener
         *
         * @param {EventTarget} element
         * @param {String} type
         * @param {Function} listener
         * @param {Object|Boolean|undefined} options
         * @param {Array<any>} ...args
         */
        removeEventListener(element, type, listener, options, ...args) {
            element.removeEventListener(type, listener, options, ...args);

            const capture = getUseCapture(options);

            this.$data._domListeners = this.$data._domListeners.filter(
                opts => (
                    opts.element !== element ||
                    opts.type !== type ||
                    opts.listener !== listener ||
                    opts.capture !== capture
                )
            );
        },
    },

    beforeDestroy() {
        this.$data._domListeners.forEach(({ element, type, listener, capture }) => {
            element.removeEventListener(type, listener, capture);
        });
    },
};
