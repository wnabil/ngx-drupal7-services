import { NgxDrupal7ServicesPage } from './app.po';

describe('ngx-drupal7-services App', () => {
  let page: NgxDrupal7ServicesPage;

  beforeEach(() => {
    page = new NgxDrupal7ServicesPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
