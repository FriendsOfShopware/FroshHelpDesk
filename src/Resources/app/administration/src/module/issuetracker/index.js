import { Module } from 'src/core/shopware';
import './page/issuetracker-view';
import deDE from './snippet/de_DE.json';
import enGB from './snippet/en_GB.json';

Module.register('sw-issuetracker', {
    type: 'plugin',
    name: 'Issuetracker',
    description: '',
    version: '1.0.0',
    targetVersion: '1.0.0',
    color: '#d0e83a',
    icon: 'default-web-bug',

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB
    },

    routes: {
        index: {
            components: {
                default: 'issuetracker-view'
            },
            path: 'view'
        }
    },

    navigation: [{
        id: 'sw-documentation',
        label: 'issuetracker.menu.service',
        color: '#d0e83a',
        path: 'sw.issuetracker.index',
        icon: 'default-badge-help'
    }, {
        label: 'issuetracker.menu.issuetracker',
        color: '#d0e83a',
        path: 'sw.issuetracker.index',
        icon: 'default-web-bug',
        parent: 'sw-documentation'
    }]
});
