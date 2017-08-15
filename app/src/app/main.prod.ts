import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { AppModuleNgFactory } from './app.module.ngfactory';
// import {ColorPickerService} from 'ct-angular2-color-picker/component'

enableProdMode();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
