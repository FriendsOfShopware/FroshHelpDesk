import { Application } from 'src/core/shopware';
import './module/documentation';
import './module/issuetracker';
import DocumentationService from './service/documentation.api.service';
import IssuetrackerService from './service/issuetracker.api.service';


Application.addServiceProvider('documentationService', (container) => {
    const initContainer = Application.getContainer('init');

    return new DocumentationService(initContainer.httpClient, container.loginService);
});

Application.addServiceProvider('issuetrackerService', (container) => {
    const initContainer = Application.getContainer('init');

    return new IssuetrackerService(initContainer.httpClient, container.loginService);
});
