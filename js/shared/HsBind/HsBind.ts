module hirespace {
    'use strict';

    export class HsBind {
        filters: Array<string> = ['date'];

        static updateElem(elem: HTMLElement, resolveObject: any) {
            let applyFilters: Array<string> = [];

            let path: string = $(elem).attr('hs-bind'),
                filters = _.map(path.split('|'), side => _.trim(side));

            if (filters.length > 1) {
                applyFilters = _.map(_.last(filters).split(','), filter => _.trim(filter));

                path = _.first(filters);
            }

            if (!path || path.length < 1) {
                hirespace.Logger.error('Invalid hs-bind attribute');
                return false;
            }

            let value: string = hirespace.AssertionParser.resolveObject(path, resolveObject, true);

            if (applyFilters.length > 0) {
                if (_.contains(applyFilters, 'N/A') || _.contains(applyFilters, 'TBC')) {
                    if (_.isUndefined(value) || _.isNull(value) || value.toString().length == 0) {
                        value = _.contains(applyFilters, 'N/A') ? 'N/A' : 'TBC';
                    } else {
                        let newFilters = _.without(_.without(applyFilters, 'N/A'), 'TBC');
                        value = newFilters.length > 0 ? hirespace.HsBind.applyFilters(value, newFilters) : value;
                    }
                } else {
                    value = hirespace.HsBind.applyFilters(value, applyFilters);
                }
            }

            if (!_.isUndefined(value) && !_.isNull(value) && value.toString().length > 0) {
                switch (elem.tagName.toLowerCase()) {
                    case 'input':
                        $(elem)
                            .attr('value', !_.isUndefined(value) ? value.toString() : '')
                            .val(!_.isUndefined(value) ? value.toString() : '');
                        break;
                    default:
                        $(elem).html(!_.isUndefined(value) ? value.toString() : '');
                        break;
                }
            }
        }

        static applyFilters(value: string, filters: Array<string>): string {
            let mutation: string = '';

            _.forEach(filters, (filter: string) => mutation = hirespace.HsBind.mutate(value, filter));

            return mutation;
        }

        static mutate(value, filter): string {
            let mutation: string;

            switch (filter) {
                case 'date':
                    mutation = moment(value, moment.ISO_8601).isValid() ? moment(value).format('DD MMMM YYYY') : '';
                    break;
                case 'pounds':
                    mutation = '£' + value;
                    break;
                default:
                    mutation = value;
                    break;
            }

            return mutation;
        }
    }
}