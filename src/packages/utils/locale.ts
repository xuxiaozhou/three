import store from 'store'

export default class {
  private readonly localeFixed: string;

  constructor(localeFixed: string) {
    this.localeFixed = localeFixed
  }

  locale(field: string, value?: any) {
    const realField = this.localeFixed + field;
    if (value === undefined) {
      return store.get(realField)
    }
    store.set(realField, value)
  }

  remove(field: string) {
    store.remove(this.localeFixed + field)
  }
}
