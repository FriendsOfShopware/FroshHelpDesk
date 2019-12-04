import { Module } from 'src/core/shopware';
import './page/documentation-view';
import deDE from '../documentation/snippet/de_DE.json';
import enGB from '../documentation/snippet/en_GB.json';


Module.register('sw-documentation', {
    type: 'plugin',
    name: 'Documentation',
    description: 'T',
    version: '1.0.0',
    targetVersion: '1.0.0',
    color: '#d0e83a',
    icon: 'default-action-document-view',

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB
    },

    routes: {
        index: {
            components: {
                default: 'documentation-view'
            },
            path: 'view'
        }
    },

    navigation: [{
        label: 'documentation.menu.documentation',
        color: '#d0e83a',
        path: 'sw.documentation.index',
        icon: 'default-action-document-view',
        parent: 'sw-documentation'
    }]
});
