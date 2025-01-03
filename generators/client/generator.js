import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { BLAZOR, XAMARIN } from '../generator-dotnetcore-constants.js';
import command from './command.js';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, queueCommandTasks: true, sbsBlueprint: true });

    this.jhipsterContext.command = command;
  }

  get [BaseApplicationGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      async composingTemplateTask() {
        if (this.jhipsterConfig.clientFramework === BLAZOR) {
          await this.composeWithJHipster('jhipster-dotnetcore:blazor');
        }
        if (this.jhipsterConfig.clientFramework === XAMARIN) {
          await this.composeWithJHipster('jhipster-dotnetcore:xamarin');
        }
      },
    });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      async postWritingTemplateTask({ application }) {
        if (application.clientFramework !== BLAZOR && application.clientRootDir) {
          this.packageJson.merge({
            scripts: {
              test: `npm test -w ${application.clientRootDir}`,
            },
          });
        }
      },
    });
  }
}
