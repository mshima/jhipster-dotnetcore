import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { BLAZOR, XAMARIN } from '../generator-dotnetcore-constants.js';
import command from './command.js';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });

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
        if (application.clientFrameworkBuiltIn) {
          // Remove prettier from eslint config, prettier is not installed in the client folder
          this.editFile(`${application.clientRootDir}${application.eslintConfigFile}`, content =>
            content.replace('prettier,\n', '').replace('extends: [prettier],\n', ''),
          );

          const clientPackageJson = this.readDestinationJSON(`${application.clientRootDir}/package.json`);
          this.packageJson.merge({
            overrides: clientPackageJson.overrides,
          });
        }

        if (application.clientFramework !== BLAZOR && application.clientRootDir) {
          this.packageJson.merge({
            scripts: {
              test: `npm test --prefix ${application.clientRootDir}`,
            },
          });
        }
      },
    });
  }
}
