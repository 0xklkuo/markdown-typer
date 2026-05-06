import { Application } from '@nativescript/core';

import { MainViewModel } from './app/view-models/main-view-model';
import { createMainPage } from './app/components/main-page';

Application.run({
  create: () => createMainPage(new MainViewModel()),
});
