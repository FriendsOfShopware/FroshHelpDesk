import { Application } from 'src/core/shopware';
import './src/module/documentation';
import './src/module/issuetracker';
import documentationService from './src/service/documentation.api.service';
import issuetrackerService from './src/service/issuetracker.api.service';


Application.addServiceProvider('documentationService', (container) => {
    const initContainer = Application.getContainer('init');

    return new documentationService(initContainer.httpClient, container.loginService);
});

Application.addServiceProvider('issuetrackerService', (container) => {
    const initContainer = Application.getContainer('init');

    return new issuetrackerService(initContainer.httpClient, container.loginService);
});
